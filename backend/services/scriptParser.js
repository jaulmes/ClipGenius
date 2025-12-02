const groqService = require('./groqService');

/**
 * Parse un script libre en scènes structurées avec IA
 * @param {string} scriptText - Texte du script (paragraphe libre)
 * @returns {Promise<Object>} - Scènes parsées
 */
async function parseScript(scriptText) {
    try {
        console.log('[ScriptParser] Parsing script with AI optimization...');

        let segments = [];

        // 1. Try AI Segmentation first (Idea-based)
        segments = await groqService.segmentScriptWithAI(scriptText);

        // 2. Fallback to Regex Segmentation (Sentence/Clause-based)
        if (!segments || segments.length === 0) {
            console.log('[ScriptParser] AI segmentation unavailable, using smart regex splitting...');
            // Split by punctuation, but also by commas/conjunctions if sentences are long
            segments = scriptText
                .split(/([.!?]+)|(,\s+(?:and|but|or|so|because|when|while)\s+)/)
                .map(s => s ? s.trim() : '')
                .filter(s => s.length > 15); // Filter out very short fragments
        }

        if (segments.length === 0) {
            // Ultimate fallback: simple sentence split
            segments = scriptText.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 5);
        }

        if (segments.length === 0) {
            throw new Error('Script is too short or empty');
        }

        // Create scenes from segments
        const scenes = [];
        let sceneId = 1;

        for (const segment of segments) {
            // Use Groq AI to optimize keywords for better video search!
            const keywords = await groqService.optimizeKeywordsWithAI(segment);

            // Use AI-optimized keywords as description  
            const description = keywords.join(' ');

            // Duration based on text length (approx 2.5 words per second)
            // Min 2s, Max 7s (shorter scenes as requested)
            const wordCount = segment.split(/\s+/).length;
            const duration = Math.min(7, Math.max(2, Math.ceil(wordCount / 2.5)));

            scenes.push({
                id: sceneId++,
                description,
                duration,
                narration: segment,
                keywords
            });
        }

        // Calculate total duration
        const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);

        // Generate title from first segment
        const title = segments[0].substring(0, 50) + (segments[0].length > 50 ? '...' : '');

        const result = {
            title,
            totalDuration,
            scenes
        };

        console.log(`[ScriptParser] Parsed ${scenes.length} scenes, total duration: ${totalDuration}s`);

        return result;
    } catch (error) {
        console.error('[ScriptParser] Error:', error);
        throw new Error(`Failed to parse script: ${error.message}`);
    }
}

/**
 * Valide et ajuste les scènes parsées
 */
function validateScenes(parsedData) {
    const MAX_SCENE_DURATION = 8; // Reduced max duration
    const MIN_SCENE_DURATION = 2; // Reduced min duration (was 3)

    let { scenes, totalDuration } = parsedData;

    // Adjust scene durations if necessary
    scenes = scenes.map(scene => {
        if (scene.duration > MAX_SCENE_DURATION) scene.duration = MAX_SCENE_DURATION;
        if (scene.duration < MIN_SCENE_DURATION) scene.duration = MIN_SCENE_DURATION;
        return scene;
    });

    // Recalculate total duration
    totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);

    console.log(`[Validator] Validated ${scenes.length} scenes, total: ${totalDuration}s`);

    return { ...parsedData, scenes, totalDuration };
}

module.exports = {
    parseScript,
    validateScenes
};
