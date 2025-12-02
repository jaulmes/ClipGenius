const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

console.log('[Groq] ✅ AI optimization enabled');

async function segmentScriptWithAI(scriptText) {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a professional video editor. Split the following script into natural video scenes. Return ONLY a JSON array of strings, where each string is a scene narration segment. Do not include any other text."
                },
                {
                    role: "user",
                    content: scriptText
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            max_tokens: 4096,
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) return null;

        // Try to parse JSON
        try {
            // Find JSON array in content (in case of extra text)
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return JSON.parse(content);
        } catch (e) {
            console.warn('[GroqService] Failed to parse JSON response for segmentation');
            return null;
        }
    } catch (error) {
        console.error('[GroqService] Segmentation error:', error.message);
        return null;
    }
}

async function optimizeKeywordsWithAI(segment) {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "Extract 3-5 visual keywords for stock footage search from this text. Return ONLY a JSON array of strings. Example: [\"happy woman\", \"sunset beach\", \"running\"]."
                },
                {
                    role: "user",
                    content: segment
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
            max_tokens: 100,
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) return [segment];

        try {
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            return [segment];
        } catch (e) {
            return [segment];
        }
    } catch (error) {
        console.error('[GroqService] Keyword optimization error:', error.message);
        return [segment];
    }
}

/**
 * Analyse un script pour Celebrity Video
 * Identifie les artistes et découpe en scènes
 */
async function analyzeForCelebrityVideo(scriptText) {
    try {
        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: `Tu es un assistant d'analyse de scripts vidéo. Analyse le script et retourne UNIQUEMENT un JSON avec :
1. "artists": array de noms d'artistes/célébrités mentionnés
2. "scenes": array d'objets avec:
   - "narration": texte à narrer (max 5 secondes)
   - "artist": nom de l'artiste concerné
   - "preferredMediaType": "image" ou "video"
   - "keywords": array de mots-clés descriptifs
   - "duration": durée estimée en secondes (2-5)

Exemple:
{
  "artists": ["Michael Jackson"],
  "scenes": [{
    "narration": "Michael Jackson was the king of pop",
    "artist": "Michael Jackson",
    "preferredMediaType": "image",
    "keywords": ["smiling", "stage", "performance"],
    "duration": 4
  }]
}`
                },
                {
                    role: "user",
                    content: scriptText
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.3,
            max_tokens: 4096,
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) return null;

        // Parse JSON
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0]);
            console.log(`[Groq] Celebrity analysis: ${result.artists?.length || 0} artists, ${result.scenes?.length || 0} scenes`);
            return result;
        }
        return null;
    } catch (error) {
        console.error('[Groq] Celebrity analysis error:', error.message);
        return null;
    }
}

module.exports = {
    segmentScriptWithAI,
    optimizeKeywordsWithAI,
    analyzeForCelebrityVideo
};
