const fs = require('fs');
const path = require('path');

const ARTISTS_DIR = path.join(__dirname, '../uploads/artists');
const DB_PATH = path.join(__dirname, '../database/artists.json');

// Initialiser la DB si elle n'existe pas
function initDatabase() {
    if (!fs.existsSync(path.dirname(DB_PATH))) {
        fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
        fs.writeFileSync(DB_PATH, JSON.stringify({}));
    }
    if (!fs.existsSync(ARTISTS_DIR)) {
        fs.mkdirSync(ARTISTS_DIR, { recursive: true });
    }
}

function loadDatabase() {
    initDatabase();
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function saveDatabase(db) {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function normalizeArtistName(name) {
    return name.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special chars
        .replace(/\s+/g, '-')          // Replace spaces with dashes
        .trim();
}

function artistExists(artistId) {
    const db = loadDatabase();
    return !!db[artistId];
}

async function createArtist(name) {
    const artistId = normalizeArtistName(name);

    if (artistExists(artistId)) {
        throw new Error(`L'artiste "${name}" existe déjà dans le système`);
    }

    // Créer dossiers
    const artistPath = path.join(ARTISTS_DIR, artistId);
    fs.mkdirSync(path.join(artistPath, 'images'), { recursive: true });
    fs.mkdirSync(path.join(artistPath, 'videos'), { recursive: true });

    // Enregistrer dans DB
    const db = loadDatabase();
    db[artistId] = {
        id: artistId,
        name,
        imageCount: 0,
        videoCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    saveDatabase(db);

    console.log(`[ArtistManager] Created artist: ${name} (${artistId})`);
    return artistId;
}

async function addMediaToArtist(artistId, files) {
    if (!artistExists(artistId)) {
        throw new Error(`Artiste "${artistId}" introuvable`);
    }

    const artistPath = path.join(ARTISTS_DIR, artistId);
    const stats = { images: 0, videos: 0 };

    const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const videoExts = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];

    for (const file of files) {
        const ext = path.extname(file.originalname).toLowerCase();
        const isImage = imageExts.includes(ext);
        const isVideo = videoExts.includes(ext);

        if (isImage) {
            const destPath = path.join(artistPath, 'images', file.originalname);
            fs.copyFileSync(file.path, destPath);
            stats.images++;
        } else if (isVideo) {
            const destPath = path.join(artistPath, 'videos', file.originalname);
            fs.copyFileSync(file.path, destPath);
            stats.videos++;
        }

        // Supprimer le fichier temporaire
        try { fs.unlinkSync(file.path); } catch (e) { }
    }

    // Mettre à jour le compte dans la DB
    updateArtistMediaCount(artistId);

    console.log(`[ArtistManager] Added ${stats.images} images, ${stats.videos} videos to ${artistId}`);
    return stats;
}

function updateArtistMediaCount(artistId) {
    const artistPath = path.join(ARTISTS_DIR, artistId);
    const images = fs.readdirSync(path.join(artistPath, 'images'));
    const videos = fs.readdirSync(path.join(artistPath, 'videos'));

    const db = loadDatabase();
    db[artistId].imageCount = images.length;
    db[artistId].videoCount = videos.length;
    db[artistId].updatedAt = new Date().toISOString();
    saveDatabase(db);
}

function getAllArtists() {
    const db = loadDatabase();
    return Object.values(db);
}

function getArtistById(artistId) {
    const db = loadDatabase();
    return db[artistId] || null;
}

function getArtistMedia(artistId) {
    const artistPath = path.join(ARTISTS_DIR, artistId);

    const imagesDir = path.join(artistPath, 'images');
    const videosDir = path.join(artistPath, 'videos');

    const images = fs.existsSync(imagesDir)
        ? fs.readdirSync(imagesDir).map(f => path.join(artistPath, 'images', f))
        : [];

    const videos = fs.existsSync(videosDir)
        ? fs.readdirSync(videosDir).map(f => path.join(artistPath, 'videos', f))
        : [];

    return { images, videos };
}

async function deleteArtist(artistId) {
    if (!artistExists(artistId)) {
        throw new Error(`Artiste "${artistId}" introuvable`);
    }

    // Supprimer dossier
    const artistPath = path.join(ARTISTS_DIR, artistId);
    fs.rmSync(artistPath, { recursive: true, force: true });

    // Supprimer de la DB
    const db = loadDatabase();
    delete db[artistId];
    saveDatabase(db);

    console.log(`[ArtistManager] Deleted artist: ${artistId}`);
}

module.exports = {
    createArtist,
    addMediaToArtist,
    getAllArtists,
    getArtistById,
    getArtistMedia,
    deleteArtist,
    artistExists,
    normalizeArtistName
};
