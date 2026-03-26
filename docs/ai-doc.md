# 🧠 AI Voice Mood Analysis Service

This module is the **AI engine** of our hackathon project. It analyzes user voice input to extract acoustic features and generate a **mood score**, **insight**, and **confidence level**.

---

# 🚀 Overview

The AI service processes audio recordings and performs:

* 🎤 **Voice Feature Extraction** (Pitch, Energy, Tempo, Jitter)
* 🧠 **Mood Score Calculation**
* 💬 **Sentiment Analysis (VADER)**
* 💡 **Insight Generation**
* 📊 **Confidence Estimation**

---

# 🏗️ Tech Stack

* **Python**
* **Flask** (API server)
* **Librosa** (audio processing)
* **NumPy**
* **NLTK / VADER** (sentiment analysis)

---

# 📁 Project Structure

```
ai-service/
│
├── app.py
├── requirements.txt
├── temp.wav (runtime only)
└── venv/
```

---

# ⚙️ Setup Instructions

## 1. Navigate to AI folder

```bash
cd ai-service
```

## 2. Create Virtual Environment

```bash
python -m venv venv
```

## 3. Activate Environment

### Windows:

```bash
venv\Scripts\activate
```

### Mac/Linux:

```bash
source venv/bin/activate
```

---

## 4. Install Dependencies

```bash
pip install -r requirements.txt
```

---

## 5. Download VADER Data

```python
import nltk
nltk.download('vader_lexicon')
```

---

## 6. Run Server

```bash
python app.py
```

Server runs at:

```
http://localhost:5001
```

---

# 🔌 API Endpoint

## 📍 POST `/analyze`

### 🔹 Request (form-data)

| Key   | Type | Description                     |
| ----- | ---- | ------------------------------- |
| audio | File | `.wav` audio file               |
| text  | Text | (optional) speech-to-text input |

---

### 🔹 Response

```json
{
  "mood_score": 0.52,
  "normalized_score": 0.04,
  "mood_label": "Medium",
  "insight": "High energy and pitch suggest excitement or stress",
  "confidence": 0.82,
  "features": {
    "pitch": 180,
    "energy": 0.05,
    "tempo": 120,
    "jitter": 20
  },
  "sentiment": {
    "compound": -0.4
  },
  "timestamp": "2026-03-26T12:00:00.000Z"
}
```

---

# 🧠 Feature Explanation

| Feature    | Description                      |
| ---------- | -------------------------------- |
| **Pitch**  | Frequency of voice (tone)        |
| **Energy** | Loudness / intensity             |
| **Tempo**  | Speaking speed                   |
| **Jitter** | Variation in pitch (instability) |

---

# 📊 Mood Score Logic

The mood score is computed using a weighted combination of:

* Acoustic features (pitch, energy, tempo, jitter)
* Sentiment score (VADER)

```
Mood Score Range: 0 → 1
Normalized Score: -1 → +1
```

---

# 💡 Insight System

The system generates human-readable insights such as:

* Stress / anxiety detection
* Fatigue / low energy
* Excitement / high engagement
* Stable emotional state

---

# 🔐 Privacy & Safety

* ❌ Raw audio is NOT stored
* ✅ Audio processed temporarily and deleted
* ✅ Only derived features and scores are returned

---

# 🔗 Integration Guide

## Backend (Node.js)

* Call API: `POST /analyze`
* Store:

  * mood_score
  * timestamp
  * features

## Frontend (React)

* Display:

  * mood_label
  * insight
  * charts (time-series)

---

# 🏆 Highlights

* Real-time audio processing
* Multi-feature emotion analysis
* Explainable AI outputs
* Ready for dashboard & trend detection

---

# 👨‍💻 Author

AI Module developed for Hackathon Project 🚀

---

# 💬 Notes

* Use `.wav` format only
* Ensure microphone input quality for best results
* Sentiment improves when text input is provided

---
