# Admin Dashboard API Documentation

## Overview
This document describes the admin dashboard backend APIs with role-based access control and analytics endpoints.

## Authentication & Authorization

### Role-Based Access Control
- **User Roles**: `user` (default) | `admin`
- **Admin Routes**: All `/api/admin/*` routes require:
  1. Valid JWT token (via `authMiddleware`)
  2. Admin role (via `adminMiddleware`)

### Login Flow
**Endpoint**: `POST /api/auth/login`

**Request**:
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "jwt_token_here",
    "user": {
      "id": "user_id",
      "email": "admin@example.com",
      "role": "admin"
    },
    "redirectTo": "/admin/dashboard"
  }
}
```

**Redirect Logic**:
- `role === "admin"` → `redirectTo: "/admin/dashboard"`
- `role === "user"` → `redirectTo: "/dashboard"`

---

## Admin Analytics APIs

### 1. Summary Cards
**Endpoint**: `GET /api/admin/summary`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "totalUsers": 1250,
    "activeUsers24h": 342,
    "averageMoodScore": 0.45,
    "atRiskUsers": 23
  }
}
```

**Metrics**:
- `totalUsers`: Total registered users
- `activeUsers24h`: Users with mood entries in last 24 hours
- `averageMoodScore`: Average mood score over last 7 days (range: -1 to +1)
- `atRiskUsers`: Users with downward trend or avg mood < -0.3

---

### 2. User Registration Trend
**Endpoint**: `GET /api/admin/user-growth?range=7d`

**Query Parameters**:
- `range` (optional): Time range in days (format: `7d`, `14d`, `30d`). Default: `7d`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "data": [
      { "date": "2026-03-21", "count": 12 },
      { "date": "2026-03-22", "count": 15 },
      { "date": "2026-03-23", "count": 8 },
      { "date": "2026-03-24", "count": 20 },
      { "date": "2026-03-25", "count": 18 },
      { "date": "2026-03-26", "count": 14 },
      { "date": "2026-03-27", "count": 22 }
    ],
    "total": 109,
    "average": 15.57,
    "peak": 22,
    "growthPercentage": 83.33
  }
}
```

**Calculations**:
- `total`: Sum of all registrations
- `average`: Mean registrations per day
- `peak`: Maximum registrations in a single day
- `growthPercentage`: `((lastDay - firstDay) / firstDay) * 100`

---

### 3. Mood Trend
**Endpoint**: `GET /api/admin/mood-trend?range=7d`

**Query Parameters**:
- `range` (optional): Time range in days (format: `7d`, `14d`, `30d`). Default: `7d`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response**:
```json
{
  "success": true,
  "data": {
    "data": [
      { "date": "2026-03-21", "avgMood": 0.32 },
      { "date": "2026-03-22", "avgMood": 0.45 },
      { "date": "2026-03-23", "avgMood": 0.38 },
      { "date": "2026-03-24", "avgMood": 0.52 },
      { "date": "2026-03-25", "avgMood": 0.48 },
      { "date": "2026-03-26", "avgMood": 0.55 },
      { "date": "2026-03-27", "avgMood": 0.61 }
    ],
    "overallTrend": "upward"
  }
}
```

**Trend Detection**:
- `upward`: Positive slope in mood scores
- `downward`: Negative slope in mood scores
- `stable`: Minimal change in mood scores

---

### 4. At-Risk Users
**Endpoint**: `GET /api/admin/at-risk-users`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "userId": "65f8a1b2c3d4e5f6a7b8c9d0",
      "averageMood": -0.42,
      "trend": "downward"
    },
    {
      "userId": "65f8a1b2c3d4e5f6a7b8c9d1",
      "averageMood": -0.35,
      "trend": "stable"
    }
  ]
}
```

**At-Risk Criteria**:
A user is considered at-risk if:
1. Last 5 mood entries show a downward trend (strictly decreasing), OR
2. Average mood score < -0.3

**Trend Detection Logic**:
- `downward`: Strictly decreasing values in last 5 entries
- `upward`: Strictly increasing values in last 5 entries
- `stable`: Otherwise (uses linear regression for non-strict patterns)

---

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid query parameters",
  "errors": [
    {
      "code": "invalid_string",
      "path": ["range"],
      "message": "Invalid format"
    }
  ]
}
```

---

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: "user" | "admin",
  refreshToken: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Mood Entries Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User),
  moodScore: Number (-1 to +1),
  normalizedScore: Number,
  moodLabel: "Low" | "Medium" | "High",
  insight: String,
  confidenceScore: Number,
  sentiment: Object,
  text: String,
  source: "voice" | "text",
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes
- `User.role`: Index for role-based queries
- `User.createdAt`: Index for date-based queries
- `Mood.user`: Index for user-specific queries
- `Mood.createdAt`: Index for date-based queries
- `Mood.user + createdAt`: Compound index for efficient filtering

---

## Performance Optimizations

1. **MongoDB Aggregation Pipelines**: All analytics use aggregation for efficiency
2. **Database Indexes**: Optimized indexes on frequently queried fields
3. **Minimal DB Calls**: Single aggregation queries instead of loops
4. **Frontend-Ready Data**: All calculations done on backend

---

## Security Features

1. **JWT Authentication**: All admin routes require valid tokens
2. **Role-Based Authorization**: Admin middleware checks user role
3. **Input Validation**: Zod schemas validate query parameters
4. **No Sensitive Data Exposure**: Password and refresh tokens excluded from responses
5. **Rate Limiting**: Configured via express-rate-limit (if enabled)
6. **XSS Protection**: express-xss-sanitizer middleware
7. **Security Headers**: Helmet middleware

---

## Testing Admin APIs

### Create Admin User
Use the provided script to create an admin user:
```bash
cd server
node scripts/createAdmin.js
```

### Test with cURL

**Login as Admin**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

**Get Summary**:
```bash
curl -X GET http://localhost:5000/api/admin/summary \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Get User Growth**:
```bash
curl -X GET "http://localhost:5000/api/admin/user-growth?range=7d" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Get Mood Trend**:
```bash
curl -X GET "http://localhost:5000/api/admin/mood-trend?range=7d" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Get At-Risk Users**:
```bash
curl -X GET http://localhost:5000/api/admin/at-risk-users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```
