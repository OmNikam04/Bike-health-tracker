# 🧪 API Testing Guide - User Operations

## Prerequisites

Make sure your server is running:
```bash
make run
```

Watch the logs in another terminal:
```bash
make logs
```

---

## 📝 Test Scenarios

### **Test 1: Register a New User** ✅

**Endpoint:** `POST /api/v1/users`  
**Auth Required:** No

```bash
curl -X POST http://localhost:8080/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "message": "User created successfully"
}
```

---

### **Test 2: Try Duplicate Email** ❌

**Endpoint:** `POST /api/v1/users`  
**Auth Required:** No

```bash
curl -X POST http://localhost:8080/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "john@example.com",
    "password": "password456"
  }'
```

**Expected Response (400 Bad Request):**
```json
{
  "error": "creation_failed",
  "message": "user with this email already exists"
}
```

---

### **Test 3: Login with Valid Credentials** 🔐

**Endpoint:** `POST /api/v1/users/login`  
**Auth Required:** No

```bash
curl -X POST http://localhost:8080/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-here",
      "name": "John Doe",
      "email": "john@example.com",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  },
  "message": "Login successful"
}
```

**⚠️ IMPORTANT:** Save the `token` value for the next tests!

---

### **Test 4: Login with Invalid Password** ❌

**Endpoint:** `POST /api/v1/users/login`  
**Auth Required:** No

```bash
curl -X POST http://localhost:8080/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "wrongpassword"
  }'
```

**Expected Response (401 Unauthorized):**
```json
{
  "error": "login_failed",
  "message": "invalid email or password"
}
```

---

### **Test 5: Get User by ID (With Token)** 🔑

**Endpoint:** `GET /api/v1/users/:id`  
**Auth Required:** Yes

```bash
# Replace {USER_ID} with actual user ID from Test 1
# Replace {TOKEN} with token from Test 3

curl http://localhost:8080/api/v1/users/{USER_ID} \
  -H "Authorization: Bearer {TOKEN}"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### **Test 6: Get User Without Token** ❌

**Endpoint:** `GET /api/v1/users/:id`  
**Auth Required:** Yes

```bash
curl http://localhost:8080/api/v1/users/{USER_ID}
```

**Expected Response (401 Unauthorized):**
```json
{
  "error": "unauthorized",
  "message": "Missing authorization token"
}
```

---

### **Test 7: Update User Profile** ✏️

**Endpoint:** `PUT /api/v1/users/:id`  
**Auth Required:** Yes

```bash
# Update name only
curl -X PUT http://localhost:8080/api/v1/users/{USER_ID} \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated"
  }'
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "John Updated",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:05:00Z"
  },
  "message": "User updated successfully"
}
```

---

### **Test 8: Update Password** 🔒

**Endpoint:** `PUT /api/v1/users/:id`  
**Auth Required:** Yes

```bash
curl -X PUT http://localhost:8080/api/v1/users/{USER_ID} \
  -H "Authorization: Bearer {TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "newpassword123"
  }'
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid-here",
    "name": "John Updated",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:10:00Z"
  },
  "message": "User updated successfully"
}
```

---

### **Test 9: List All Users** 📋

**Endpoint:** `GET /api/v1/users`  
**Auth Required:** Yes

```bash
# Default pagination (limit=10, offset=0)
curl http://localhost:8080/api/v1/users \
  -H "Authorization: Bearer {TOKEN}"

# Custom pagination
curl "http://localhost:8080/api/v1/users?limit=5&offset=0" \
  -H "Authorization: Bearer {TOKEN}"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid-1",
        "name": "John Updated",
        "email": "john@example.com",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:10:00Z"
      }
    ],
    "total": 1,
    "limit": 10,
    "offset": 0
  }
}
```

---

### **Test 10: Delete User** 🗑️

**Endpoint:** `DELETE /api/v1/users/:id`  
**Auth Required:** Yes

```bash
curl -X DELETE http://localhost:8080/api/v1/users/{USER_ID} \
  -H "Authorization: Bearer {TOKEN}"
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Note:** This is a soft delete. The user is marked as deleted but not removed from the database.

---

## 🔄 Complete Test Flow

Here's a complete test flow you can run:

```bash
# 1. Register user
RESPONSE=$(curl -s -X POST http://localhost:8080/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}')
echo "Register: $RESPONSE"

# 2. Login
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8080/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}')
echo "Login: $LOGIN_RESPONSE"

# Extract token (requires jq)
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.token')
USER_ID=$(echo $LOGIN_RESPONSE | jq -r '.data.user.id')

echo "Token: $TOKEN"
echo "User ID: $USER_ID"

# 3. Get user
curl -s http://localhost:8080/api/v1/users/$USER_ID \
  -H "Authorization: Bearer $TOKEN" | jq

# 4. Update user
curl -s -X PUT http://localhost:8080/api/v1/users/$USER_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name"}' | jq

# 5. List users
curl -s http://localhost:8080/api/v1/users \
  -H "Authorization: Bearer $TOKEN" | jq

# 6. Delete user
curl -s -X DELETE http://localhost:8080/api/v1/users/$USER_ID \
  -H "Authorization: Bearer $TOKEN" | jq
```

---

## 🛠️ Troubleshooting

### Issue: "Missing authorization token"
**Solution:** Make sure you include the `Authorization: Bearer {TOKEN}` header

### Issue: "Invalid or expired token"
**Solution:** Login again to get a fresh token (tokens expire after 24 hours)

### Issue: "validation_failed"
**Solution:** Check your request body matches the required format

### Issue: "user with this email already exists"
**Solution:** Use a different email or delete the existing user first

---

## 📊 API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/users` | ❌ | Register new user |
| POST | `/api/v1/users/login` | ❌ | Login (get JWT token) |
| GET | `/api/v1/users/:id` | ✅ | Get user by ID |
| PUT | `/api/v1/users/:id` | ✅ | Update user profile |
| DELETE | `/api/v1/users/:id` | ✅ | Delete user (soft delete) |
| GET | `/api/v1/users` | ✅ | List all users (paginated) |

---

**Happy Testing! 🚀**

