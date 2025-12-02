const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

async function trimVideo(inputPath, duration, outputPath, format = '16:9') {
    const resolution = format === '9:16' ? '1080:1920' : '1920:1080';

    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .setStartTime(0)
            .setDuration(duration)
            .outputOptions([
                '-c:v', 'libx264',
                '-preset', 'fast',
                '-crf', '22',
                `-vf`, `scale=${resolution}:force_original_aspect_ratio=increase,crop=${resolution},fps=30`,
                '-pix_fmt', 'yuv420p',
                '-an'
            ])
            .output(outputPath)
            .on('end', () => resolve(outputPath))
            .on('error', reject)
            .run();
    });
}

async function extractThumbnail(videoPath, timestamp, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(videoPath)
            .screenshots({
                timestamps: [timestamp],
                filename: path.basename(outputPath),
                folder: path.dirname(outputPath),
                size: '320x180'
            })
            .on('end', () => resolve(outputPath))
            .on('error', reject);
    });
}

async function mergeVideoAudio(videoPath, audioPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(videoPath)
            .input(audioPath)
            .outputOptions([
                '-c:v', 'copy',
                '-c:a', 'aac',
                '-map', '0:v:0',
                '-map', '1:a:0',
                '-shortest'
            ])
            .output(outputPath)
            .on('end', () => resolve(outputPath))
            .on('error', reject)
            .run();
    });
}

async function addAudioToVideo(videoPath, audioPath, outputPath) {
    return new Promise((resolve, reject) => {
        console.log(`[Assembler] Adding continuous audio track to video...`);

        try {
            const stats = fs.statSync(audioPath);
            console.log(`[Assembler] Audio file size: ${stats.size} bytes`);
            if (stats.size < 100) console.warn('[Assembler] Warning: Audio file seems empty');
        } catch (e) {
            console.error('[Assembler] Audio file check failed:', e);
        }

        ffmpeg()
            .input(videoPath)
            .input(audioPath)
            .outputOptions([
                '-c:v', 'copy',
                '-c:a', 'aac',
                '-ar', '44100',
                '-ac', '2',
                '-b:a', '192k',
                '-map', '0:v:0',
                '-map', '1:a:0',
                '-shortest'
            ])
            .output(outputPath)
            .on('end', () => {
                console.log(`[Assembler] Audio added successfully`);
                resolve(outputPath);
            })
            .on('error', (err) => {
                console.error('[Assembler] Error adding audio:', err);
                reject(err);
            })
            .run();
    });
}

async function addBackgroundMusic(videoPath, musicPath, outputPath) {
    return new Promise((resolve, reject) => {
        console.log(`[Assembler] Adding background music...`);

        ffmpeg()
            .input(videoPath)
            .input(musicPath)
            .complexFilter([
                '[1:a]volume=0.15[music]',
                '[0:a][music]amix=inputs=2:duration=first[audio]'
            ])
            .outputOptions([
                '-c:v', 'copy',
                '-map', '0:v',
                '-map', '[audio]',
                '-c:a', 'aac',
                '-b:a', '192k'
            ])
            .output(outputPath)
            .on('end', () => resolve(outputPath))
            .on('error', (err) => {
                console.error('[Assembler] Error adding music:', err);
                reject(err);
            })
            .run();
    });
}

async function assembleScenes(scenePaths, outputPath, format = '16:9') {
    return new Promise((resolve, reject) => {
        console.log(`[VideoAssembler] Assembling ${scenePaths.length} scenes in ${format} format...`);

        const tempDir = path.dirname(outputPath);
        const concatPath = path.join(tempDir, `concat_${Date.now()}.txt`);

        const concatContent = scenePaths
            .map(p => `file '${p.replace(/\\/g, '/')}'`)
            .join('\n');

        fs.writeFileSync(concatPath, concatContent, 'utf-8');

        const resolution = format === '9:16' ? '1080:1920' : '1920:1080';

        ffmpeg()
            .input(concatPath)
            .inputOptions(['-f', 'concat', '-safe', '0'])
            .outputOptions([
                '-c:v', 'libx264',
                '-c:a', 'aac',
                `-vf`, `scale=${resolution}:force_original_aspect_ratio=decrease,pad=${resolution}:(ow-iw)/2:(oh-ih)/2`,
                '-movflags', '+faststart'
            ])
            .output(outputPath)
            .on('end', () => {
                try { fs.unlinkSync(concatPath); } catch (e) { }
                console.log(`[VideoAssembler] Final video created: ${resolution} (${format})`);
                resolve(outputPath);
            })
            .on('error', (err) => {
                try { fs.unlinkSync(concatPath); } catch (e) { }
                reject(err);
            })
            .run();
    });
}

async function replaceScene(originalScenes, sceneIndex, newScenePath, outputPath) {
    const updatedScenes = [...originalScenes];
    updatedScenes[sceneIndex] = newScenePath;
    return assembleScenes(updatedScenes, outputPath);
}

module.exports = {
    trimVideo,
    extractThumbnail,
    mergeVideoAudio,
    addAudioToVideo,
    addBackgroundMusic,
    assembleScenes,
    replaceScene
};
