from flask import Flask, request, jsonify
import librosa
import numpy as np
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import os
from datetime import datetime
import speech_recognition as sr

app = Flask(__name__)

analyzer = SentimentIntensityAnalyzer()


# 🎙️ Speech-to-Text
def speech_to_text(file_path):
    """Convert audio file to text using speech recognition"""
    recognizer = sr.Recognizer()

    try:
        # Validate file exists
        if not os.path.exists(file_path):
            print(f"Audio file not found: {file_path}")
            return ""

        with sr.AudioFile(file_path) as source:
            # Adjust for ambient noise
            recognizer.adjust_for_ambient_noise(source, duration=0.5)
            audio = recognizer.record(source)

        # Try Google Speech Recognition
        text = recognizer.recognize_google(audio)
        return text
    except sr.UnknownValueError:
        print("Speech recognition could not understand audio")
        return ""
    except sr.RequestError as e:
        print(f"Could not request results from speech recognition service: {e}")
        return ""
    except Exception as e:
        print(f"Speech-to-text error: {str(e)}")
        return ""


# 🎤 Feature Extraction
def extract_features(file_path):
    """Extract audio features from file with error handling"""
    try:
        # Validate file exists
        if not os.path.exists(file_path):
            raise ValueError(f"Audio file not found: {file_path}")

        # Validate file size
        file_size = os.path.getsize(file_path)
        if file_size == 0:
            raise ValueError("Audio file is empty")

        # Load audio file
        try:
            y, sr = librosa.load(file_path, sr=None, duration=60)  # Limit to 60 seconds
        except Exception as load_error:
            raise ValueError(f"Failed to load audio file: {str(load_error)}")

        # Validate audio data
        if len(y) == 0:
            raise ValueError("Audio file contains no data")

        # 🔹 Pitch extraction
        try:
            pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
            pitch_values = pitches[pitches > 50]
            pitch_values = pitch_values[pitch_values < 400]
            pitch = float(np.mean(pitch_values)) if pitch_values.size > 0 else 150.0
        except Exception as pitch_error:
            print(f"Pitch extraction error: {str(pitch_error)}")
            pitch = 150.0

        # 🔹 Jitter calculation
        try:
            if pitch_values.size > 1:
                jitter = float(np.mean(np.abs(np.diff(pitch_values))))
            else:
                jitter = 0.0
        except Exception as jitter_error:
            print(f"Jitter calculation error: {str(jitter_error)}")
            jitter = 0.0

        # 🔹 Energy (RMS)
        try:
            rms = librosa.feature.rms(y=y)
            energy = float(np.mean(rms))
        except Exception as energy_error:
            print(f"Energy calculation error: {str(energy_error)}")
            energy = 0.05

        # 🔹 Tempo calculation
        try:
            duration = librosa.get_duration(y=y, sr=sr)
            tempo = float(60 / duration) if duration > 0 else 120.0
        except Exception as tempo_error:
            print(f"Tempo calculation error: {str(tempo_error)}")
            tempo = 120.0

        # 🔹 Apply constraints
        pitch = max(min(pitch, 400), 50)
        tempo = max(min(tempo, 200), 80)
        jitter = max(min(jitter, 100), 0)
        energy = max(min(energy, 1.0), 0.0)

        # 🔹 Round values
        pitch = round(pitch, 2)
        energy = round(energy, 4)
        tempo = round(tempo, 2)
        jitter = round(jitter, 2)

        return {
            "pitch": pitch,
            "energy": energy,
            "tempo": tempo,
            "jitter": jitter
        }
    except Exception as e:
        print(f"Feature extraction failed: {str(e)}")
        # Return default values on error
        return {
            "pitch": 150.0,
            "energy": 0.05,
            "tempo": 120.0,
            "jitter": 0.0
        }


# 🧠 Mood Score
def calculate_mood(features, sentiment_score):
    """Calculate mood score from features and sentiment with validation"""
    try:
        pitch = float(features.get("pitch", 150))
        energy = float(features.get("energy", 0.05))
        tempo = float(features.get("tempo", 120))
        jitter = float(features.get("jitter", 0))
        sentiment_score = float(sentiment_score)

        # Validate ranges
        pitch = max(min(pitch, 400), 50)
        energy = max(min(energy, 1.0), 0.0)
        tempo = max(min(tempo, 200), 80)
        jitter = max(min(jitter, 100), 0)
        sentiment_score = max(min(sentiment_score, 1.0), -1.0)

        # Normalize to 0-1 range
        pitch_score = min((pitch - 50) / 350, 1.0)
        energy_score = min(energy / 0.1, 1.0)
        tempo_score = min((tempo - 80) / 120, 1.0)
        jitter_score = 1 - min(jitter / 100, 1.0)
        sentiment_normalized = (sentiment_score + 1) / 2  # Convert -1 to 1 range to 0 to 1

        # Weighted average
        score = (
            pitch_score * 0.25 +
            energy_score * 0.25 +
            tempo_score * 0.2 +
            jitter_score * 0.1 +
            sentiment_normalized * 0.2
        )

        # Ensure score is in valid range
        score = max(min(score, 1.0), 0.0)

        return round(float(score), 2)
    except Exception as e:
        print(f"Mood calculation error: {str(e)}")
        return 0.5  # Return neutral mood on error


# 💡 Insight Generator
def generate_insight(features, sentiment_score):
    """Generate insight from features and sentiment with validation"""
    try:
        pitch = float(features.get("pitch", 150))
        energy = float(features.get("energy", 0.05))
        tempo = float(features.get("tempo", 120))
        jitter = float(features.get("jitter", 0))
        sentiment_score = float(sentiment_score)

        # Validate ranges
        pitch = max(min(pitch, 400), 50)
        energy = max(min(energy, 1.0), 0.0)
        tempo = max(min(tempo, 200), 80)
        jitter = max(min(jitter, 100), 0)

        if jitter > 40:
            return "High voice instability detected, possible stress or nervousness"
        elif pitch > 250 and energy > 0.07 and jitter < 10:
            return "Confident and expressive speech detected"
        elif pitch > 250 and energy > 0.07:
            return "High energy and pitch suggest excitement or stress"
        elif tempo > 150:
            return "Fast speech indicates urgency or nervousness"
        elif energy < 0.02:
            return "Low energy suggests fatigue or low mood"
        elif sentiment_score < -0.3:
            return "Negative sentiment detected in speech"
        elif sentiment_score > 0.5:
            return "Positive sentiment detected, indicating a good mood"
        else:
            return "Speech patterns appear stable and normal"
    except Exception as e:
        print(f"Insight generation error: {str(e)}")
        return "Analysis complete"


# 🔥 API Endpoint
@app.route('/analyze', methods=['POST'])
def analyze():
    file_path = None
    try:
        # Validate audio file exists
        if 'audio' not in request.files:
            return jsonify({
                "success": False,
                "error": "No audio file provided"
            }), 400

        audio_file = request.files['audio']

        # Validate file is not empty
        if audio_file.filename == '':
            return jsonify({
                "success": False,
                "error": "No file selected"
            }), 400

        # Validate file size (max 10MB)
        audio_file.seek(0, os.SEEK_END)
        file_size = audio_file.tell()
        audio_file.seek(0)
        
        max_size = 10 * 1024 * 1024  # 10MB
        if file_size > max_size:
            return jsonify({
                "success": False,
                "error": "Audio file too large. Maximum size is 10MB"
            }), 400

        if file_size == 0:
            return jsonify({
                "success": False,
                "error": "Audio file is empty"
            }), 400

        # Create unique temp file path
        import uuid
        file_path = f"temp_{uuid.uuid4().hex}.wav"
        
        try:
            audio_file.save(file_path)
        except Exception as save_error:
            return jsonify({
                "success": False,
                "error": "Failed to save audio file"
            }), 500

        # Validate file was saved
        if not os.path.exists(file_path) or os.path.getsize(file_path) == 0:
            return jsonify({
                "success": False,
                "error": "Failed to process audio file"
            }), 500

        # 🎤 Features extraction with error handling
        try:
            features = extract_features(file_path)
        except Exception as feature_error:
            print(f"Feature extraction error: {str(feature_error)}")
            return jsonify({
                "success": False,
                "error": "Failed to extract audio features. Please ensure the file is a valid audio format."
            }), 400

        # 🎙️ Speech-to-text with error handling
        try:
            text = speech_to_text(file_path)
        except Exception as stt_error:
            print(f"Speech-to-text error: {str(stt_error)}")
            text = ""

        # Fallback if STT fails
        if not text or text.strip() == "":
            text = request.form.get("text", "")
            if not text:
                text = "Audio processed without transcription"

        # 🧠 Sentiment analysis with error handling
        try:
            sentiment = analyzer.polarity_scores(text)
            sentiment_score = float(sentiment['compound'])
        except Exception as sentiment_error:
            print(f"Sentiment analysis error: {str(sentiment_error)}")
            sentiment = {'compound': 0.0, 'pos': 0.0, 'neu': 1.0, 'neg': 0.0}
            sentiment_score = 0.0

        # 🧠 Mood calculation
        try:
            mood_score = calculate_mood(features, sentiment_score)
        except Exception as mood_error:
            print(f"Mood calculation error: {str(mood_error)}")
            mood_score = 0.5

        # 🏷️ Label
        if mood_score < 0.3:
            mood_label = "Low"
        elif mood_score < 0.65:
            mood_label = "Medium"
        else:
            mood_label = "High"

        # 💡 Insight
        try:
            insight = generate_insight(features, sentiment_score)
        except Exception as insight_error:
            print(f"Insight generation error: {str(insight_error)}")
            insight = "Analysis complete"

        # 🧠 Confidence
        try:
            confidence = round(max(0.0, min(1.0, 1 - (features["jitter"] / 100))), 2)
        except Exception:
            confidence = 0.5

        # Cleanup
        if file_path and os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as cleanup_error:
                print(f"Cleanup error: {str(cleanup_error)}")

        return jsonify({
            "success": True,
            "text": text,
            "mood_score": mood_score,
            "normalized_score": round((mood_score * 2) - 1, 2),
            "mood_label": mood_label,
            "insight": insight,
            "confidence": confidence,
            "features": features,
            "sentiment": sentiment,
            "timestamp": datetime.utcnow().isoformat()
        }), 200

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        # Cleanup on error
        if file_path and os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception:
                pass
        
        return jsonify({
            "success": False,
            "error": "An unexpected error occurred during audio analysis. Please try again."
        }), 500


# 🚀 Run Server (Render Compatible)
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)