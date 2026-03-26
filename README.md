# MOODO - FrostHacks

- Frontend - https://moodo-frosthacks.vercel.app/
- Backend API - https://moodo-frosthacks-i1tq.onrender.com
- AI API - https://moodo-frosthacks.onrender.com/

## 🎯 Privacy-First Audio Mood Tracking

This backend implements a complete privacy-first audio mood tracking pipeline that processes audio through an external AI service while ensuring audio is **never stored in the database or persisted to disk**.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Application                     │
│                  (Records Audio File)                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ POST /mood/process-audio
                         │ (multipart/form-data)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express Server                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 1. Authentication (JWT Middleware)                   │   │
│  │    - Verify token                                    │   │
│  │    - Extract user ID                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 2. Multer (Memory Storage)                           │   │
│  │    - Parse multipart/form-data                       │   │
│  │    - Store audio in memory buffer                    │   │
│  │    - Validate MIME type                              │   │
│  │    - Validate file size (max 5MB)                    │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 3. Controller (processAudio)                         │   │
│  │    - Validate audio file exists                      │   │
│  │    - Call AI service                                 │   │
│  │    - Discard audio buffer                            │   │
│  │    - Transform response                              │   │
│  │    - Store in database                               │   │
│  │    - Analyze trends                                  │   │
│  │    - Detect alerts                                   │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP POST (FormData)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                  External AI Service                        │
│              (Python Flask Application)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 1. Receive audio file                                │   │
│  │ 2. Extract features (pitch, energy, tempo, jitter)   │   │
│  │ 3. Analyze sentiment (VADER)                         │   │
│  │ 4. Calculate mood score                              │   │
│  │ 5. Generate insight                                  │   │
│  │ 6. Delete temp audio file                            │   │
│  │ 7. Return structured response                        │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ JSON Response
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Express Server                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 4. Transform AI Response                             │   │
│  │    - Map mood_score → moodScore                      │   │
│  │    - Map normalized_score → normalizedScore          │   │
│  │    - Map sentiment compound → sentiment label        │   │
│  │    - Extract features                                │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 5. Store in Database                                 │   │
│  │    - Create Mood entry                               │   │
│  │    - Store only structured data                      │   │
│  │    - NO audio stored                                 │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 6. Trend Analysis                                    │   │
│  │    - Fetch last 10 entries                           │   │
│  │    - Calculate trend (upward/downward/stable)        │   │
│  │    - Calculate fluctuation (low/moderate/high)       │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 7. Alert Detection                                   │   │
│  │    - Check declining trend                           │   │
│  │    - Check low mood average                          │   │
│  │    - Check high volatility                           │   │
│  │    - Create alert if needed                          │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ JSON Response
                         ▼
┌─────────────────────────────────────────────────────────────┐
│               Frontend Application                          │
│              (Display Mood & Trends)                        │
└─────────────────────────────────────────────────────────────┘
```

## Responsibilities

- Backend - Afzal
- Frontend - Nitish
- AI/NLP - Amit
- PPT/Testing - Mahabrata