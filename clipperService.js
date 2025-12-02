const KEYWORDS = ['secret', 'mistake', 'reason', 'how to', 'why', 'what', 'the best'];

/**
 * Analyse une transcription pour identifier les segments vidéo les plus pertinents.
 * @param {object} transcriptionResult La transcription complète (avec .text et .words).
 * @returns {Array<object>} Une liste de clips potentiels avec { startTime, endTime, title }.
 */
function findPotentialClips(transcriptionResult) {
  const { words } = transcriptionResult;
  if (!words || words.length === 0) {
    return [];
  }

  const sentences = groupWordsIntoSentences(words);
  const potentialClips = [];

  let currentClipCandidate = [];
  let currentDuration = 0;

  sentences.forEach(sentence => {
    const sentenceDuration = (sentence.end - sentence.start) / 1000;

    // Si une seule phrase est déjà trop longue, on la considère comme un clip
    if (sentenceDuration > 60) {
      if (currentClipCandidate.length > 0) {
        potentialClips.push(buildClipFromSentences(currentClipCandidate));
        currentClipCandidate = [];
        currentDuration = 0;
      }
      potentialClips.push(buildClipFromSentences([sentence]));
      return;
    }
    
    // Si l'ajout de la nouvelle phrase dépasse la durée max, on finalise le clip précédent
    if (currentDuration + sentenceDuration > 60) {
        if (currentClipCandidate.length > 0) {
            potentialClips.push(buildClipFromSentences(currentClipCandidate));
        }
        currentClipCandidate = [sentence];
        currentDuration = sentenceDuration;
    } else {
      currentClipCandidate.push(sentence);
      currentDuration += sentenceDuration;
    }
  });
  
  // Ajoute le dernier clip candidat s'il existe
  if (currentClipCandidate.length > 0) {
      potentialClips.push(buildClipFromSentences(currentClipCandidate));
  }
  
  // Filtre et score les clips
  return potentialClips
    .filter(clip => clip.duration >= 15) // Garde uniquement les clips d'au moins 15s
    .map(clip => ({
      ...clip,
      virality_score: calculateViralityScore(clip.title),
    }))
    .sort((a, b) => b.virality_score - a.virality_score) // Trie par score
    .slice(0, 5); // Garde les 5 meilleurs
}

function groupWordsIntoSentences(words) {
    const sentences = [];
    let currentSentence = [];
    words.forEach(word => {
        currentSentence.push(word);
        if (word.text.endsWith('.') || word.text.endsWith('?') || word.text.endsWith('!')) {
            sentences.push({
                text: currentSentence.map(w => w.text).join(' '),
                start: currentSentence[0].start,
                end: currentSentence[currentSentence.length - 1].end,
            });
            currentSentence = [];
        }
    });
    // Ajoute la dernière phrase si elle n'a pas de ponctuation finale
    if (currentSentence.length > 0) {
        sentences.push({
            text: currentSentence.map(w => w.text).join(' '),
            start: currentSentence[0].start,
            end: currentSentence[currentSentence.length - 1].end,
        });
    }
    return sentences;
}

function buildClipFromSentences(sentenceGroup) {
    const text = sentenceGroup.map(s => s.text).join(' ');
    const startTime = sentenceGroup[0].start;
    const endTime = sentenceGroup[sentenceGroup.length-1].end;
    return {
        startTime: startTime / 1000, // en secondes
        endTime: endTime / 1000,     // en secondes
        duration: (endTime - startTime) / 1000,
        title: text.substring(0, 70) + '...', // Titre simple basé sur le début du clip
    };
}

function calculateViralityScore(text) {
    let score = 70; // Score de base
    const lowerText = text.toLowerCase();
    if (lowerText.includes('?')) score += 10;
    if (lowerText.includes('!')) score += 5;
    KEYWORDS.forEach(keyword => {
        if (lowerText.includes(keyword)) {
            score += 8;
        }
    });
    return Math.min(score, 99); // Plafonne le score à 99
}

module.exports = {
  findPotentialClips,
};
