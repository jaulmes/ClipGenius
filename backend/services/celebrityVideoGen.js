const path = require('path');
const fs = require('fs');
const groqService = require('./groqService');
const ttsService = require('./ttsService');
const videoAssembler = require('./videoAssembler');
const kenBurnsEffect = require('./kenBurnsEffect');
const artistManager = require('./artistManager');

async function generateCelebrityVideo(sessionId, scriptText, options = {}) {
    const { language = 'en-US' } = options;

    const tempDir = path.join(__dirname, '../temp');
    const outputsDir = path.join(__dirname, '../outputs');

    [tempDir, outputsDir].forEach(dir => {
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    });

    try {
        // 1. Analyser le script avec GroqAI
        console.log('[Celebrity] Analyzing script...');
        const analysis = await groqService.analyzeForCelebrityVideo(scriptText);

        if (!analysis || !analysis.scenes || analysis.scenes.length === 0) {
            throw new Error('Failed to analyze script or no scenes detected');
        }

        // Vérifier que tous les artistes existent
        for (const artistName of analysis.artists) {
            const artistId = artistManager.normalizeArtistName(artistName);
            if (!artistManager.artistExists(artistId)) {
                throw new Error(`Artiste "${artistName}" introuvable dans le système. Veuillez d'abord uploader ses médias via le backoffice.`);
            }
        }

        // 2. Générer voice-over complet
        console.log('[Celebrity] Generating voice-over...');
        const narrationPath = await ttsService.generateContinuousNarration(
            analysis.scenes,
            sessionId,
            { language }
        );

        // 3. Traiter chaque scène
        console.log(`[Celebrity] Processing ${analysis.scenes.length} scenes...`);
        const scenePaths = [];
        const usedMedia = new Set(); // Éviter de réutiliser

        for (let i = 0; i < analysis.scenes.length; i++) {
            const scene = analysis.scenes[i];
            const artistId = artistManager.normalizeArtistName(scene.artist);

            // Obtenir médias de l'artiste
            const media = artistManager.getArtistMedia(artistId);

            let sceneVideoPath;

            // Déterminer le meilleur type de média disponible
            const hasImages = media.images.length > 0;
            const hasVideos = media.videos.length > 0;
            const useImage = (scene.preferredMediaType === 'image' && hasImages) || (!hasVideos && hasImages);
            const useVideo = (scene.preferredMediaType === 'video' && hasVideos) || (!hasImages && hasVideos);

            // Choisir et traiter le média
            if (useImage) {
                // Utiliser une image avec Ken Burns
                let availableImages = media.images.filter(img => !usedMedia.has(img));
                if (availableImages.length === 0) {
                    // Si toutes utilisées, réinitialiser
                    usedMedia.clear();
                    availableImages = media.images;
                }

                const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)];
                usedMedia.add(randomImage);

                console.log(`[Celebrity] Scene ${i + 1}: Applying Ken Burns to image`);
                const outputPath = path.join(tempDir, `scene_${sessionId}_${i}_kenburns.mp4`);
                sceneVideoPath = await kenBurnsEffect.applyKenBurnsEffect(
                    randomImage,
                    scene.duration,
                    outputPath
                );
            } else if (useVideo) {
                // Utiliser une vidéo
                let availableVideos = media.videos.filter(vid => !usedMedia.has(vid));
                if (availableVideos.length === 0) {
                    usedMedia.clear();
                    availableVideos = media.videos;
                }

                const randomVideo = availableVideos[Math.floor(Math.random() * availableVideos.length)];
                usedMedia.add(randomVideo);

                console.log(`[Celebrity] Scene ${i + 1}: Trimming video`);
                const outputPath = path.join(tempDir, `scene_${sessionId}_${i}_trimmed.mp4`);
                sceneVideoPath = await videoAssembler.trimVideo(
                    randomVideo,
                    scene.duration,
                    outputPath
                );
            } else {
                throw new Error(`Aucun média (image/vidéo) disponible pour l'artiste "${scene.artist}"`);
            }

            scenePaths.push(sceneVideoPath);
        }

        // 4. Assembler toutes les scènes
        console.log('[Celebrity] Assembling scenes...');
        const assembledPath = path.join(tempDir, `assembled_${sessionId}.mp4`);
        await videoAssembler.assembleScenes(scenePaths, assembledPath);

        // 5. Ajouter voice-over
        console.log('[Celebrity] Adding voice-over...');
        const finalPath = path.join(outputsDir, `celebrity_video_${sessionId}.mp4`);
        await videoAssembler.addAudioToVideo(assembledPath, narrationPath, finalPath);

        // Cleanup
        try {
            fs.unlinkSync(assembledPath);
            fs.unlinkSync(narrationPath);
            scenePaths.forEach(p => { try { fs.unlinkSync(p); } catch (e) { } });
        } catch (e) { }

        console.log('[Celebrity] ✅ Video generation complete!');
        return `/outputs/celebrity_video_${sessionId}.mp4`;

    } catch (error) {
        console.error('[Celebrity] Generation error:', error);
        throw error;
    }
}

module.exports = {
    generateCelebrityVideo
};
