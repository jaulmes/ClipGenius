const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const fs = require('fs');
const path = require('path');

// Configure FFmpeg path for fluent-ffmpeg
if (ffmpegPath) {
  ffmpeg.setFfmpegPath(ffmpegPath);
  console.log('[VideoService] FFmpeg path configured:', ffmpegPath);
}

const tempDir = path.join(__dirname, 'temp');
const fallbackAudioPath = path.join(tempDir, 'fallback_audio.mp3');

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

// Télécharge et extrait l'audio d'une vidéo YouTube avec yt-dlp
function downloadAndExtractAudio(youtubeUrl) {
  return new Promise((resolve, reject) => {
    try {
      // Extraire l'ID de la vidéo YouTube
      const videoId = youtubeUrl.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/)?.[1];
      if (!videoId) {
        return reject(new Error('Invalid YouTube URL'));
      }

      const audioPath = path.join(tempDir, `${videoId}.mp3`);

      // Si le fichier existe déjà, le réutiliser
      if (fs.existsSync(audioPath)) {
        console.log(`[VideoService] Audio file already exists: ${audioPath}`);
        return resolve(audioPath);
      }

      console.log(`[VideoService] Downloading audio from: ${youtubeUrl}`);

      // Utiliser yt-dlp pour télécharger et convertir l'audio
      const { spawn } = require('child_process');
      const ytdlp = spawn('py', [
        '-m', 'yt_dlp',
        '-x', // Extract audio
        '--audio-format', 'mp3',
        '--audio-quality', '128K',
        '-o', audioPath.replace('.mp3', '.%(ext)s'), // Template de sortie
        '--no-playlist', // Ne télécharger qu'une seule vidéo
        youtubeUrl
      ]);

      let stderr = '';

      ytdlp.stdout.on('data', (data) => {
        const output = data.toString().trim();
        if (output) {
          console.log(`[VideoService] yt-dlp: ${output}`);
        }
      });

      ytdlp.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      ytdlp.on('close', (code) => {
        if (code !== 0) {
          console.error(`[VideoService] yt-dlp error: ${stderr}`);
          return reject(new Error(`yt-dlp failed with code ${code}`));
        }

        console.log(`[VideoService] Audio extraction complete: ${audioPath}`);
        resolve(audioPath);
      });

      ytdlp.on('error', (err) => {
        console.error('[VideoService] Failed to start yt-dlp:', err);
        reject(new Error('yt-dlp is not installed. Install it with: py -m pip install yt-dlp'));
      });

    } catch (err) {
      console.error('[VideoService] Error:', err);
      reject(err);
    }
  });
}


/**
 * Télécharge la vidéo YouTube complète en haute qualité avec yt-dlp
 */
function downloadFullVideo(youtubeUrl) {
  return new Promise((resolve, reject) => {
    const videoId = youtubeUrl.match(/(?:v=|\/)([a-zA-Z0-9_-]{11})/)?.[1];
    if (!videoId) {
      return reject(new Error('Invalid YouTube URL'));
    }

    const videoPath = path.join(tempDir, `${videoId}.mp4`);

    // Si déjà téléchargé, réutiliser
    if (fs.existsSync(videoPath)) {
      console.log(`[VideoService] Video already exists: ${videoPath}`);
      return resolve(videoPath);
    }

    console.log(`[VideoService] Downloading full video: ${youtubeUrl}`);

    const { spawn } = require('child_process');
    const ytdlp = spawn('py', [
      '-m', 'yt_dlp',
      // Limiter à 1080p max pour gain de temps (pas besoin de 4K pour 1080x1920)
      '-f', 'bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080][ext=mp4]/best',
      '--merge-output-format', 'mp4',
      '--extractor-args', 'youtube:player_client=android', // Évite les problèmes SABR
      '-o', videoPath,
      '--no-playlist',
      '--no-check-certificates', // Évite les problèmes SSL
      '--retries', '3',
      youtubeUrl
    ]);

    let stderr = '';

    ytdlp.stdout.on('data', (data) => {
      const output = data.toString().trim();
      if (output && !output.includes('[download]')) { // Réduire le bruit
        console.log(`[VideoService] ${output}`);
      }
    });

    ytdlp.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    ytdlp.on('close', (code) => {
      if (code !== 0) {
        console.error(`[VideoService] Video download error: ${stderr}`);

        // Si erreur de fichier verrouillé, attendre un peu et réessayer
        if (stderr.includes('WinError 32') || stderr.includes('utilisé par un autre processus')) {
          console.log('[VideoService] File locked, waiting 3 seconds and checking again...');
          setTimeout(() => {
            if (fs.existsSync(videoPath)) {
              console.log('[VideoService] Video file exists despite error, continuing...');
              resolve(videoPath);
            } else {
              reject(new Error(`Video download failed with code ${code}`));
            }
          }, 3000);
        } else {
          return reject(new Error(`Video download failed with code ${code}`));
        }
      } else {
        console.log(`[VideoService] Video downloaded: ${videoPath}`);
        resolve(videoPath);
      }
    });

    ytdlp.on('error', (err) => {
      console.error('[VideoService] Failed to start yt-dlp:', err);
      reject(new Error('yt-dlp video download failed'));
    });
  });
}

/**
 * Formate un timestamp en centièmes de seconde pour ASS (HH:MM:SS.CC)
 */
function formatASSTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const centiseconds = Math.floor((milliseconds % 1000) / 10);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(1, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`;
}

/**
 * Génère un fichier ASS avec style TikTok viral pour les sous-titres
 */
function generateSubtitleFile(words, outputPath) {
  // Remplacer .srt par .ass
  const assPath = outputPath.replace('.srt', '.ass');

  // En-tête ASS avec style TikTok viral
  let assContent = `[Script Info]
Title: TikTok Style Subtitles
ScriptType: v4.00+
WrapStyle: 0
PlayResX: 1080
PlayResY: 1920
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: TikTok,Arial Black,60,&H00FFFF00,&H000000FF,&H00000000,&H80000000,-1,0,0,0,100,100,0,0,1,4,3,2,10,10,120,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;

  // Ajouter chaque mot avec le style TikTok
  for (const word of words) {
    const startTime = formatASSTime(word.start);
    const endTime = formatASSTime(word.end);

    // Nettoyer le texte (échapper les caractères spéciaux ASS)
    const cleanText = word.text.replace(/\\/g, '\\\\').replace(/\{/g, '').replace(/\}/g, '');

    // Ajouter avec effet de mise en valeur
    assContent += `Dialogue: 0,${startTime},${endTime},TikTok,,0,0,0,,{\\b1\\fs60\\c&H00FFFF&}${cleanText}\n`;
  }

  fs.writeFileSync(assPath, assContent, 'utf-8');
  console.log(`[VideoService] TikTok-style ASS subtitle file created: ${assPath}`);
  return assPath;
}

/**
 * Crée un clip vidéo vertical (9:16) avec sous-titres animés
 */
function createVerticalClip(videoPath, clipData, subtitlePath, outputPath) {
  return new Promise((resolve, reject) => {
    console.log(`[VideoService] Creating clip: ${clipData.title.substring(0, 50)}...`);

    // Normaliser le chemin pour FFmpeg (Windows)
    const normalizedSubPath = subtitlePath.replace(/\\/g, '/').replace(/:/g, '\\:');

    ffmpeg(videoPath)
      .setStartTime(clipData.startTime)
      .setDuration(clipData.duration)
      // Filtre complexe pour format vertical + sous-titres
      .complexFilter([
        // 1. Crop en 9:16 avec scaling optimisé (lanczos = meilleure qualité)
        '[0:v]crop=ih*9/16:ih,scale=1080:1920:flags=lanczos,setsar=1[cropped]',
        // 2. Ajouter les sous-titres (style défini dans le fichier ASS)
        `[cropped]subtitles='${normalizedSubPath}'[subtitled]`
      ])
      .outputOptions([
        '-map', '[subtitled]',
        '-map', '0:a?', // Audio optionnel
        '-c:v', 'libx264',
        '-preset', 'faster',      // Plus rapide qu'avant (medium)
        '-crf', '18',             // Meilleure qualité (était 23)
        '-profile:v', 'high',     // Profil H.264 haute qualité
        '-level', '4.2',          // Support 1080p optimisé
        '-c:a', 'aac',
        '-b:a', '192k',           // Audio amélioré (était 128k)
        '-ar', '48000',           // Sample rate optimal
        '-movflags', '+faststart', // Pour streaming web
        '-threads', '0'           // Utiliser tous les CPU disponibles
      ])
      .on('progress', (progress) => {
        if (progress.percent) {
          console.log(`[VideoService] Clip progress: ${Math.floor(progress.percent)}%`);
        }
      })
      .on('end', () => {
        console.log(`[VideoService] Clip created: ${outputPath}`);
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('[VideoService] FFmpeg error:', err);
        reject(err);
      })
      .save(outputPath);
  });
}


/**
 * Découpe une vidéo en un clip plus court.
 * @param {string} videoPath Chemin vers la vidéo source.
 * @param {number} startTime Heure de début en secondes.
 * @param {number} duration Durée du clip en secondes.
 * @param {string} outputPath Chemin de sortie pour le clip.
 * @returns {Promise<string>} Le chemin vers le clip découpé.
 */
function cutVideo(videoPath, startTime, duration, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .setStartTime(startTime)
      .setDuration(duration)
      .outputOptions('-c copy') // Copie les codecs pour un découpage rapide
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(err))
      .save(outputPath);
  });
}


module.exports = {
  downloadAndExtractAudio,
  downloadFullVideo,
  generateSubtitleFile,
  createVerticalClip,
};
