const { AssemblyAI } = require('assemblyai');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

async function transcribeWithAssemblyAI(audioPath) {
  // ... (code existant, inchangé)
  const apiKey = process.env.ASSEMBLYAI_API_KEY;
  if (!apiKey) {
    throw new Error('ASSEMBLYAI_API_KEY environment variable is not set.');
  }
  const client = new AssemblyAI({ apiKey });
  const audioUrl = await client.files.upload(audioPath);
  const transcript = await client.transcripts.transcribe({
    audio_url: audioUrl,
    word_boost: ["Hormozi", "viral", "hook"],
  });
  if (transcript.status === 'error') {
    throw new Error(`AssemblyAI transcription failed: ${transcript.error}`);
  }
  return { text: transcript.text, words: transcript.words };
}

/**
 * Transcrit un fichier audio localement en utilisant le script Python Whisper.
 * @param {string} audioPath Le chemin vers le fichier audio.
 * @returns {Promise<object>} La transcription complète avec horodatage des mots.
 */
function transcribeWithWhisper(audioPath) {
  return new Promise((resolve, reject) => {
    console.log(`[TranscriptionService] Starting Whisper transcription for: ${audioPath}`);
    
    const pythonProcess = spawn('python3', ['transcribe_whisper.py', audioPath]);

    let stdoutData = '';
    let stderrData = '';

    pythonProcess.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      stderrData += data.toString();
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error(`[TranscriptionService] Whisper script exited with code ${code}`);
        console.error(`[TranscriptionService] Whisper stderr: ${stderrData}`);
        return reject(new Error(`Whisper transcription failed. Details: ${stderrData}`));
      }
      
      try {
        const result = JSON.parse(stdoutData);
        if (result.error) {
            return reject(new Error(result.error));
        }
        console.log('[TranscriptionService] Whisper transcription successful.');
        resolve(result);
      } catch (e) {
        reject(new Error('Failed to parse Whisper script output.'));
      }
    });

    pythonProcess.on('error', (err) => {
        console.error('[TranscriptionService] Failed to start Whisper script:', err);
        reject(new Error('Failed to start Whisper process.'));
    });
  });
}

module.exports = {
  transcribeWithAssemblyAI,
  transcribeWithWhisper,
};
