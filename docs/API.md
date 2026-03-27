# API Reference

**Base URL:** `http://localhost:3000/api`

**Authentication:** All endpoints (except `/health`) require JWT token

```
Header: Authorization: Bearer <token>
```

---

## Auth

### Register

- **POST** `/auth/register`
- **Body:** `{ name, email, password }`
- **Returns:** `{ accessToken }`

### Login

- **POST** `/auth/login`
- **Body:** `{ email, password }`
- **Returns:** `{ accessToken }`

### Logout

- **POST** `/auth/logout`
- **Header:** `Authorization: Bearer <token>`
- **Returns:** `{ message: 'Successfully logged out' }`

### Get Current User

- **GET** `/auth/me`
- **Header:** `Authorization: Bearer <token>`
- **Returns:** `{ success: true, data: { id, name, email, ... } }`

---

## Mood

### Process Audio (Privacy-First)

- **POST** `/mood/process-audio`
- **Header:** `Authorization: Bearer <token>`
- **Body:** FormData with `audio` file (required) and `text` (optional)
- **Returns:** `{ moodScore, normalizedScore, moodLabel, confidence, insight, trend, fluctuation, alert }`
- **Privacy:** Audio is never stored in database or disk. Processed and immediately discarded.

### Analyze Mood

- **POST** `/mood/analyze`
- **Header:** `Authorization: Bearer <token>`
- **Body:** `{ features: { pitch, jitter, speech_rate }, text? }`
- **Returns:** `{ mood, alert }`

### Get History

- **GET** `/mood/history?range=7d&limit=20`
- **Header:** `Authorization: Bearer <token>`
- **Query:** `range` (7d|30d|90d), `limit` (1-100)
- **Returns:** `[mood entries]`

### Get Latest

- **GET** `/mood/latest`
- **Header:** `Authorization: Bearer <token>`
- **Returns:** `{ mood }`

### Get Trend

- **GET** `/mood/trend`
- **Header:** `Authorization: Bearer <token>`
- **Returns:** `{ trend, fluctuation, confidence, message }`

### Get Streak

- **GET** `/mood/streak`
- **Header:** `Authorization: Bearer <token>`
- **Returns:** `{ streak }`
- **Description:** Get user's current daily streak (consecutive days with mood entries)

### Get Dashboard

- **GET** `/mood/dashboard?range=7d`
- **Header:** `Authorization: Bearer <token>`
- **Query:** `range` (7d|30d|90d)
- **Returns:** `{ entries, averageMood, trend, fluctuation, alerts, streak }`

---

## Sentiment

### Analyze Sentiment

- **POST** `/mood/sentiment/analyze`
- **Header:** `Authorization: Bearer <token>`
- **Body:** `{ text }`
- **Returns:** `{ sentimentScore, label, confidence }`

---

## Alerts

### Get Alerts

- **GET** `/mood/alerts`
- **Header:** `Authorization: Bearer <token>`
- **Returns:** `[alerts]`

### Acknowledge Alert

- **PUT** `/mood/alerts/:id/acknowledge`
- **Header:** `Authorization: Bearer <token>`
- **Returns:** `{ alert }`

---

## Health

### Server Status

- **GET** `/health`
- **Returns:** `{ message }`

---

## Status Codes

| Code | Meaning           |
| ---- | ----------------- |
| 200  | Success           |
| 201  | Created           |
| 400  | Bad request       |
| 401  | Unauthorized      |
| 422  | Validation failed |
| 429  | Rate limited      |
| 500  | Server error      |

---

## Privacy & Security

### Privacy Guarantees

- ✅ Audio is NEVER stored in database
- ✅ Audio is NEVER persisted to disk
- ✅ Audio is kept in memory only during processing
- ✅ Only structured mood data is stored
- ✅ No audio logging

### Security Features

- ✅ JWT authentication on all endpoints
- ✅ Rate limiting (100 requests per 15 minutes)
- ✅ Helmet.js security headers
- ✅ XSS protection
- ✅ CORS configured
- ✅ Zod validation on all inputs
