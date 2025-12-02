const ffmpeg = require('fluent-ffmpeg');

/**
 * Applique un effet Ken Burns (zoom + pan) sur une image
 * @param {string} imagePath - Chemin de l'image
 * @param {number} duration - Durée en secondes
 * @param {string} outputPath - Chemin vidéo de sortie
 * @returns {Promise<string>} - Chemin vidéo générée
 */
async function applyKenBurnsEffect(imagePath, duration, outputPath) {
    return new Promise((resolve, reject) => {
        console.log(`[KenBurns] Applying effect to ${imagePath} (${duration}s)`);

        // Calcul des paramètres pour effet Ken Burns
        const frames = Math.floor(duration * 30);
        const zoomSpeed = 0.0015;
        const maxZoom = 1.5;

        ffmpeg(imagePath)
            .videoFilters([
                // Redimensionner et crop pour 1920x1080
                'scale=1920:1080:force_original_aspect_ratio=increase',
                'crop=1920:1080',
                // Appliquer zoompan - syntaxe sans guillemets
                `zoompan=z=min(zoom+${zoomSpeed}\\,${maxZoom}):d=${frames}:x=iw/2-(iw/zoom/2):y=ih/2-(ih/zoom/2):s=1920x1080:fps=30`
            ])
            .duration(duration)
            .outputOptions([
                '-c:v', 'libx264',
                '-preset', 'fast',
                '-crf', '22',
                '-pix_fmt', 'yuv420p'
            ])
            .output(outputPath)
            .on('end', () => {
                console.log(`[KenBurns] ✅ Effect applied: ${outputPath}`);
                resolve(outputPath);
            })
            .on('error', (err) => {
                console.error('[KenBurns] Error:', err);
                reject(err);
            })
            .run();
    });
}

module.exports = {
    applyKenBurnsEffect
};
