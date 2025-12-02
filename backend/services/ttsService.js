const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

console.log('[TTS] Simple & Reliable TTS Service');

// Voice config (currently only Google TTS works reliably)
const VOICE_CONFIG = {
    'en-US': [
        { id: 'en-us-male', name: '👨 Male Voice', lang: 'en', provider: 'google' },
        { id: 'en-us-female', name: '👩 Female Voice', lang: 'en', provider: 'google' }
    ],
    'fr-FR': [{ id: 'fr-fr-male', name: '👨 Voix Homme', lang: 'fr', provider: 'google' },
    { id: 'fr-fr-female', name: '👩 Voix Femme', lang: 'fr', provider: 'google' }
    ]
};

async function generateGoogleSpeech(text, lang, outputPath) {
    const gtts = require('node-gtts');

    return new Promise((resolve, reject) => {
        console.log(`[TTS] Generating with Google TTS (${lang})`);
        const tts = gtts(lang);
        tts.save(outputPath, text, (err) => {
            if (err) {
                reject(err);
            } else {
                const stats = fs.statSync(outputPath);
                console.log(`[TTS] ✅ Generated: ${stats.size} bytes`);
                resolve(outputPath);
            }
        });
    });
}

function getVoices(language = 'en-US') {
    return VOICE_CONFIG[language] || VOICE_CONFIG['en-US'];
}

async function previewVoice(language, voiceId) {
    const audioDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir, { recursive: true });
    }

    const text = language === 'fr-FR'
        ? "Bonjour, voici un aperçu de ma voix."
        : "Hello, this is a preview of my voice.";

    const outputPath = path.join(audioDir, `preview_${voiceId}.mp3`);

    if (fs.existsSync(outputPath)) {
        return outputPath;
    }

    const langCode = language.split('-')[0];
    try {
        return await generateGoogleSpeech(text, langCode, outputPath);
    } catch (error) {
        console.error('[TTS] Preview failed:', error);
        return createSilentAudio(outputPath);
    }
}

async function generateContinuousNarration(scenes, sessionId, options = {}) {
    const { language = 'en-US' } = options;

    console.log(`[TTS] Generating narration (${language})`);

    const audioDir = path.join(__dirname, '../temp');
    if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir, { recursive: true });
    }

    const fullNarration = scenes
        .map(scene => scene.narration || '')
        .filter(text => text.trim().length > 0)
        .join('. ... ');

    if (!fullNarration) {
        console.log('[TTS] No text');
        const silentPath = path.join(audioDir, `narration_${sessionId}.mp3`);
        await createSilentAudio(silentPath, 5);
        return silentPath;
    }

    console.log(`[TTS] Text: ${fullNarration.length} chars`);
    const narrationPath = path.join(audioDir, `narration_${sessionId}.mp3`);

    try {
        const langCode = language.split('-')[0];
        const result = await generateGoogleSpeech(fullNarration, langCode, narrationPath);
        const stats = fs.statSync(result);
        console.log(`[TTS] ✅ Done: ${stats.size} bytes`);

        if (stats.size < 100) {
            await createSilentAudio(narrationPath, 5);
        }

        return result;
    } catch (error) {
        console.error('[TTS] Failed:', error);
        await createSilentAudio(narrationPath, 5);
        return narrationPath;
    }
}

async function createSilentAudio(outputPath, duration = 1) {
    return new Promise((resolve, reject) => {
        ffmpeg()
            .input('anullsrc=r=24000:cl=mono')
            .inputFormat('lavfi')
            .duration(duration)
            .audioCodec('libmp3lame')
            .output(outputPath)
            .on('end', () => resolve(outputPath))
            .on('error', (err) => {
                fs.writeFileSync(outputPath, '');
                resolve(outputPath);
            })
            .run();
    });
}

module.exports = {
    getVoices,
    previewVoice,
    generateContinuousNarration,
    createSilentAudio
};
