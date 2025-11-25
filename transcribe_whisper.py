import whisper
import sys
import json
import os

# Redirige stderr vers /dev/null pour cacher les messages de chargement de modèle.
sys.stderr = open(os.devnull, 'w')

def transcribe_audio(file_path):
    """
    Transcrit un fichier audio en utilisant OpenAI Whisper.
    Charge le modèle 'tiny.en' qui est rapide et suffisant pour des tests.
    """
    try:
        model = whisper.load_model("tiny.en")
        result = model.transcribe(file_path, word_timestamps=True)
        
        # Formatte la sortie pour qu'elle corresponde à la structure d'AssemblyAI
        formatted_result = {
            "text": result["text"],
            "words": [
                {
                    "text": word.get("word", ""),
                    "start": int(word.get("start", 0) * 1000), # en millisecondes
                    "end": int(word.get("end", 0) * 1000)      # en millisecondes
                }
                for segment in result["segments"] 
                for word in segment.get("words", [])
            ]
        }
        
        print(json.dumps(formatted_result))
    except Exception as e:
        print(json.dumps({"error": str(e)}), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No audio file path provided."}), file=sys.stderr)
        sys.exit(1)
    
    audio_file = sys.argv[1]
    transcribe_audio(audio_file)
