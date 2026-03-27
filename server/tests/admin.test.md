# Admin API Testing Guide

## Prerequisites
1. Server running on `http://localhost:5000`
2. Admin user created (run `npm run create-admin`)
3. Some test data in the database

## Test Scenarios

### 1. Test Login with Admin User

**Request**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "65f8a1b2c3d4e5f6a7b8c9d0",
      "email": "admin@example.com",
      "role": "admin"
    },
    "redirectTo": "/admin/dashboard"
  }
}
```

✅ **Verify**: `redirectTo` should be `/admin/dashboard` for admin users

---

### 2. Test Login with Regular User

**Request**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

**Expected Response**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "65f8a1b2c3d4e5f6a7b8c9d1",
      "email": "user@example.com",
      "role": "user"
    },
    "redirectTo": "/dashboard"
  }
}
```

✅ **Verify**: `redirectTo` should be `/dashboard` for regular users

---

### 3. Test Admin Summary Endpoint

**Setup**: Save the admin token from step 1
```bash
export ADMIN_TOKEN="your_admin_token_here"
```

**Request**:
```bash
curl -X GET http://localhost:5000/api/admin/summary \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "totalUsers": 150,
    "activeUsers24h": 45,
    "averageMoodScore": 0.32,
    "atRiskUsers": 8
  }
}
```

✅ **Verify**: All numeric values returned, no errors

---

### 4. Test User Growth Endpoint

**Request**:
```bash
curl -X GET "http://localhost:5000/api/admin/user-growth?range=7d" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "data": [
      { "date": "2026-03-21", "count": 5 },
      { "date": "2026-03-22", "count": 8 },
      { "date": "2026-03-23", "count": 3 },
      { "date": "2026-03-24", "count": 12 },
      { "date": "2026-03-25", "count": 7 },
      { "date": "2026-03-26", "count": 9 },
      { "date": "2026-03-27", "count": 11 }
    ],
    "total": 55,
    "average": 7.86,
    "peak": 12,
    "growthPercentage": 120.0
  }
}
```

✅ **Verify**: 
- Array has 7 entries (one per day)
- Dates are consecutive
- All calculations are correct

---

### 5. Test Mood Trend Endpoint

**Request**:
```bash
curl -X GET "http://localhost:5000/api/admin/mood-trend?range=7d" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Expected Response**:
```json
{
  "success": true,
  "data": {
    "data": [
      { "date": "2026-03-21", "avgMood": 0.25 },
      { "date": "2026-03-22", "avgMood": 0.32 },
      { "date": "2026-03-23", "avgMood": 0.28 },
      { "date": "2026-03-24", "avgMood": 0.41 },
      { "date": "2026-03-25", "avgMood": 0.38 },
      { "date": "2026-03-26", "avgMood": 0.45 },
      { "date": "2026-03-27", "avgMood": 0.52 }
    ],
    "overallTrend": "upward"
  }
}
```

✅ **Verify**: 
- Trend is one of: "upward", "downward", "stable"
- avgMood values are between -1 and 1

---

### 6. Test At-Risk Users Endpoint

**Request**:
```bash
curl -X GET http://localhost:5000/api/admin/at-risk-users \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Expected Response**:
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

✅ **Verify**: 
- Each user has averageMood < -0.3 OR trend === "downward"
- userId is valid ObjectId

---

### 7. Test Authorization - Regular User Accessing Admin Route

**Setup**: Save the user token from step 2
```bash
export USER_TOKEN="your_user_token_here"
```

**Request**:
```bash
curl -X GET http://localhost:5000/api/admin/summary \
  -H "Authorization: Bearer $USER_TOKEN"
```

**Expected Response**:
```json
{
  "success": false,
  "message": "Access denied. Admin privileges required."
}
```

✅ **Verify**: Status code 403, access denied message

---

### 8. Test Authorization - No Token

**Request**:
```bash
curl -X GET http://localhost:5000/api/admin/summary
```

**Expected Response**:
```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

✅ **Verify**: Status code 401, no token message

---

### 9. Test Invalid Query Parameter

**Request**:
```bash
curl -X GET "http://localhost:5000/api/admin/user-growth?range=invalid" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Expected Response**:
```json
{
  "success": false,
  "message": "Invalid query parameters",
  "errors": [
    {
      "code": "invalid_string",
      "path": ["range"],
      "message": "Invalid"
    }
  ]
}
```

✅ **Verify**: Status code 400, validation error returned

---

### 10. Test Different Time Ranges

**Request (14 days)**:
```bash
curl -X GET "http://localhost:5000/api/admin/user-growth?range=14d" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

**Request (30 days)**:
```bash
curl -X GET "http://localhost:5000/api/admin/mood-trend?range=30d" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

✅ **Verify**: 
- Response contains correct number of days
- All dates are filled (including zeros for missing data)

---

## Automated Testing Script

Save this as `test-admin-api.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:5000"

echo "🧪 Testing Admin API..."
echo ""

# 1. Login as admin
echo "1️⃣ Login as admin..."
ADMIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}')

ADMIN_TOKEN=$(echo $ADMIN_RESPONSE | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

if [ -z "$ADMIN_TOKEN" ]; then
  echo "❌ Failed to get admin token"
  exit 1
fi

echo "✅ Admin login successful"
echo ""

# 2. Test summary
echo "2️⃣ Testing summary endpoint..."
curl -s -X GET "$BASE_URL/api/admin/summary" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq
echo ""

# 3. Test user growth
echo "3️⃣ Testing user growth endpoint..."
curl -s -X GET "$BASE_URL/api/admin/user-growth?range=7d" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq
echo ""

# 4. Test mood trend
echo "4️⃣ Testing mood trend endpoint..."
curl -s -X GET "$BASE_URL/api/admin/mood-trend?range=7d" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq
echo ""

# 5. Test at-risk users
echo "5️⃣ Testing at-risk users endpoint..."
curl -s -X GET "$BASE_URL/api/admin/at-risk-users" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq
echo ""

echo "✅ All tests completed!"
```

Run with:
```bash
chmod +x test-admin-api.sh
./test-admin-api.sh
```

---

## Performance Testing

### Load Test with Apache Bench

```bash
# Test summary endpoint (100 requests, 10 concurrent)
ab -n 100 -c 10 \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  http://localhost:5000/api/admin/summary
```

**Expected**: 
- All requests should succeed (200 OK)
- Average response time < 100ms (with proper indexes)

---

## Database Verification

### Check Indexes

```javascript
// In MongoDB shell
use your_database_name

// Check User indexes
db.users.getIndexes()
// Should see: createdAt, role

// Check Mood indexes
db.moods.getIndexes()
// Should see: user, createdAt, compound (user + createdAt)
```

### Check User Roles

```javascript
// Count users by role
db.users.aggregate([
  { $group: { _id: "$role", count: { $sum: 1 } } }
])

// Expected output:
// { "_id": "user", "count": 145 }
// { "_id": "admin", "count": 5 }
```

---

## Troubleshooting

### Issue: 401 Unauthorized
- Check if token is valid
- Verify JWT_SECRET matches between login and verification
- Check token expiration

### Issue: 403 Forbidden
- Verify user has `role: "admin"` in database
- Check adminMiddleware is applied correctly

### Issue: Empty data arrays
- Verify there's data in the database for the requested time range
- Check date filtering logic

### Issue: Slow queries
- Run `db.users.getIndexes()` and `db.moods.getIndexes()`
- Ensure indexes are created
- Check MongoDB query execution plan

---

## Success Criteria

✅ All endpoints return 200 OK for admin users
✅ All endpoints return 403 for regular users
✅ Login returns correct `redirectTo` based on role
✅ Data is aggregated correctly
✅ Dates are filled with zeros for missing data
✅ Trend detection works correctly
✅ At-risk users are identified properly
✅ Query validation works
✅ No sensitive data exposed
✅ Performance is acceptable (< 100ms per request)
