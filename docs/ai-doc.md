# 🧠 AI Voice Mood Analysis Service (Updated)

This module is the **AI engine** of our hackathon project. It processes user voice input to extract acoustic features, convert speech to text, analyze sentiment, and generate a **mood score**, **insight**, and **confidence level**.

---

# 🚀 Overview

The AI service performs the following pipeline:

```text
Audio 🎤 → Feature Extraction → Speech-to-Text → Sentiment Analysis → Mood Score → Insight
```

---

# 🏗️ Tech Stack

* **Python**
* **Flask** (API server)
* **Librosa** (audio processing)
* **NumPy**
* **SpeechRecognition** (speech-to-text)
* **NLTK / VADER** (sentiment analysis)

---

# 📁 Project Structure

```
ai-services/
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
cd ai-services
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

## 5. Install Speech-to-Text Dependencies

```bash
pip install SpeechRecognition pydub
```

---

## 6. Download VADER Data

```python
import nltk
nltk.download('vader_lexicon')
```

---

## 7. Run Server

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

| Key   | Type | Description                  |
| ----- | ---- | ---------------------------- |
| audio | File | `.wav` audio file (required) |
| text  | Text | optional fallback text       |

---

### 🔹 Response

```json
{
  "text": "I feel stressed today",
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
    "compound": -0.4,
    "neg": 0.3,
    "neu": 0.5,
    "pos": 0.2
  },
  "timestamp": "2026-03-26T12:00:00.000Z"
}
```

---

# 🧠 Feature Explanation

| Feature    | Description                          |
| ---------- | ------------------------------------ |
| **Pitch**  | Voice frequency (tone)               |
| **Energy** | Loudness / intensity                 |
| **Tempo**  | Speaking speed                       |
| **Jitter** | Variation in pitch (voice stability) |

---

# 🎙️ Speech-to-Text (Task 5)

* Converts audio input into text using **Google Speech Recognition**
* Works best with:

  * Clear speech
  * Low background noise
  * 3–10 seconds audio

### Fallback Mechanism

If speech recognition fails:

```text
Uses manually provided "text" field from request
```

---

# 💬 Sentiment Analysis (VADER)

We use VADER to analyze emotional tone of transcribed text.

### Output Fields

| Field    | Meaning                      |
| -------- | ---------------------------- |
| compound | Overall sentiment (-1 to +1) |
| pos      | Positive score               |
| neg      | Negative score               |
| neu      | Neutral score                |

---

## ⚠️ Important Note

* Informational speech → Neutral sentiment
* Emotional words required for positive/negative detection

### Examples:

| Input             | Result   |
| ----------------- | -------- |
| "I feel stressed" | Negative |
| "I am happy"      | Positive |
| "I am studying"   | Neutral  |

---

# 📊 Mood Score Logic

Mood score is calculated using:

* Pitch
* Energy
* Tempo
* Jitter
* Sentiment (compound)

```text
Range: 0 → 1
Normalized: -1 → +1
```

---

# 💡 Insight System

Generates human-readable interpretations such as:

* Stress / anxiety detection
* Calm / stable speech
* Excitement / engagement
* Fatigue / low energy

---

# 🧠 Confidence Score

Confidence represents reliability of prediction based on voice stability:

```text
Low jitter → High confidence
High jitter → Low confidence
```

---

# 🔐 Privacy & Safety

* ❌ Raw audio is NOT stored
* ✅ Temporary file is deleted after processing
* ✅ Only derived insights are returned

---

# 🔗 Integration Guide

## Backend (Node.js)

* Call API: `POST /analyze`
* Store:

  * mood_score
  * timestamp
  * features

## Frontend (React)

* Record audio (WAV)
* Send via form-data
* Display:

  * mood_label
  * insight
  * charts

---

# 🏆 Highlights

* Real-time audio processing
* Speech-to-text integration
* Multi-feature emotional analysis
* Explainable AI outputs
* Ready for dashboard & trend detection

---

# 👨‍💻 Author

AI Module developed for Hackathon Project 🚀

---

# 💬 Notes

* Use `.wav` format only
* Ensure clear audio input
* Internet required for speech recognition

---
