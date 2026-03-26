from flask import Flask, request, jsonify
import librosa
import numpy as np
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import os
from datetime import datetime

app = Flask(__name__)

analyzer = SentimentIntensityAnalyzer()


# 🎤 Feature Extraction
def extract_features(file_path):
    y, sr = librosa.load(file_path, sr=None)

    # 🔹 Pitch
    pitches, magnitudes = librosa.piptrack(y=y, sr=sr)
    pitch_values = pitches[pitches > 50]
    pitch_values = pitch_values[pitch_values < 400]

    pitch = float(np.mean(pitch_values)) if pitch_values.size > 0 else 0.0

    # 🔹 Jitter (variation in pitch)
    if pitch_values.size > 1:
        jitter = float(np.mean(np.abs(np.diff(pitch_values))))
    else:
        jitter = 0.0

    # 🔹 Energy
    rms = librosa.feature.rms(y=y)
    energy = float(np.mean(rms))

    # 🔹 Tempo (speech rate proxy)
    duration = librosa.get_duration(y=y, sr=sr)
    tempo = float(60 / duration) if duration > 0 else 0.0

    # 🔹 Soft constraints (avoid flattening)
    pitch = max(pitch, 50)
    tempo = min(max(tempo, 80), 200)

    # 🔹 Round for stability
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


# 🧠 Mood Score Calculation
def calculate_mood(features, sentiment_score):
    pitch = features["pitch"]
    energy = features["energy"]
    tempo = features["tempo"]
    jitter = features["jitter"]
    sentiment_score = float(sentiment_score)

    # Normalize (sensitive)
    pitch_score = min(pitch / 300, 1)
    energy_score = min(energy / 0.1, 1)
    tempo_score = min(tempo / 200, 1)
    jitter_score = 1 - min(jitter / 100, 1)

    score = (
        pitch_score * 0.25 +
        energy_score * 0.25 +
        tempo_score * 0.2 +
        jitter_score * 0.1 +
        sentiment_score * 0.2
    )

    return round(float(score), 2)


# 💡 Insight Generator
def generate_insight(features, sentiment_score):
    pitch = features["pitch"]
    energy = features["energy"]
    tempo = features["tempo"]
    jitter = features["jitter"]

    if jitter > 40:
        return "High voice instability detected, possible stress or nervousness"
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


# 🔥 API Endpoint
@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        # ✅ Validate input
        if 'audio' not in request.files:
            return jsonify({"error": "No audio file provided"}), 400

        audio_file = request.files['audio']

        # Save temp file
        file_path = "temp.wav"
        audio_file.save(file_path)

        # 🎤 Extract features
        features = extract_features(file_path)

        # 📝 Optional text
        text = request.form.get("text", "")

        # 🧠 Sentiment
        sentiment = analyzer.polarity_scores(text)
        sentiment_score = float(sentiment['compound'])

        # 🧠 Mood Score
        mood_score = calculate_mood(features, sentiment_score)

        # 🏷️ Mood Label
        if mood_score < 0.3:
            mood_label = "Low"
        elif mood_score < 0.6:
            mood_label = "Medium"
        else:
            mood_label = "High"

        # 💡 Insight
        insight = generate_insight(features, sentiment_score)

        # 🧠 Confidence Score
        confidence = round(1 - (features["jitter"] / 100), 2)

        # 🧹 Cleanup
        if os.path.exists(file_path):
            os.remove(file_path)

        # 📦 Final Response (LOCKED FORMAT)
        return jsonify({
            "mood_score": mood_score,
            "normalized_score": round((mood_score * 2) - 1, 2),
            "mood_label": mood_label,
            "insight": insight,
            "confidence": confidence,
            "features": features,
            "sentiment": sentiment,
            "timestamp": datetime.utcnow().isoformat()
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 🚀 Run Server
if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5001))
    app.run(host="0.0.0.0", port=port)