const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const artistManager = require('../services/artistManager');

// Setup multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const tempDir = path.join(__dirname, '../temp');
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50 MB max
});

// GET /api/admin/artists - Liste tous les artistes
router.get('/artists', (req, res) => {
    try {
        const artists = artistManager.getAllArtists();
        res.json(artists);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/admin/artists - Créer un nouvel artiste
router.post('/artists', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || name.trim().length === 0) {
            return res.status(400).json({ error: 'Nom de l\'artiste requis' });
        }

        const artistId = await artistManager.createArtist(name);
        res.json({ success: true, artistId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// POST /api/admin/artists/:artistId/media - Ajouter médias
router.post('/artists/:artistId/media', upload.array('files', 100), async (req, res) => {
    try {
        const { artistId } = req.params;
        const files = req.files;

        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'Aucun fichier fourni' });
        }

        const stats = await artistManager.addMediaToArtist(artistId, files);
        res.json({ success: true, added: stats });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET /api/admin/artists/:artistId - Obtenir un artiste
router.get('/artists/:artistId', (req, res) => {
    try {
        const { artistId } = req.params;
        const artist = artistManager.getArtistById(artistId);

        if (!artist) {
            return res.status(404).json({ error: 'Artiste introuvable' });
        }

        res.json(artist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/admin/artists/:artistId - Supprimer un artiste
router.delete('/artists/:artistId', async (req, res) => {
    try {
        const { artistId } = req.params;
        await artistManager.deleteArtist(artistId);
        res.json({ success: true });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
