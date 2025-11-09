# API Testing Guide - Bike Health Tracker

This guide provides request bodies and curl commands to test all bike and fuel log APIs.

## Prerequisites

1. **Start the server**: `cd backend && go run cmd/server/main.go`
2. **Create a user and login** to get an access token
3. **Replace `YOUR_ACCESS_TOKEN`** with your actual JWT token in all requests below

---

## 🔐 Step 1: Authentication (Get Access Token)

### Register a User
```bash
curl -X POST http://localhost:8080/api/v1/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234",
    "name": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:8080/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@1234"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "abc123...",
    "user": { ... }
  }
}
```

**Copy the `token` value** and use it as `YOUR_ACCESS_TOKEN` below.

---

## 🏍️ Step 2: Bike APIs

### 1. Register a New Bike (POST /api/v1/bikes)

**Minimal Request (only required fields):**
```bash
curl -X POST http://localhost:8080/api/v1/bikes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "brand": "Honda",
    "model": "Activa 6G",
    "initial_odometer": 0
  }'
```

**Complete Request (all fields):**
```bash
curl -X POST http://localhost:8080/api/v1/bikes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "brand": "Royal Enfield",
    "model": "Classic 350",
    "year": 2023,
    "registration_number": "MH12AB1234",
    "purchase_date": "2023-01-15T00:00:00Z",
    "purchase_price": 185000,
    "initial_odometer": 0,
    "fuel_type": "Petrol",
    "photo_url": "https://example.com/bike.jpg",
    "notes": "My first bike!"
  }'
```

**Request Body Fields:**
```json
{
  "brand": "string (required)",
  "model": "string (required)",
  "year": "integer (optional)",
  "registration_number": "string (optional, unique)",
  "purchase_date": "ISO 8601 datetime (optional)",
  "purchase_price": "number (optional)",
  "initial_odometer": "integer (required, default: 0)",
  "fuel_type": "string (optional)",
  "photo_url": "string (optional)",
  "notes": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "user_id": "...",
    "brand": "Royal Enfield",
    "model": "Classic 350",
    "year": 2023,
    "registration_number": "MH12AB1234",
    "purchase_date": "2023-01-15T00:00:00Z",
    "purchase_price": 185000,
    "initial_odometer": 0,
    "current_odometer": 0,
    "fuel_type": "Petrol",
    "photo_url": "https://example.com/bike.jpg",
    "notes": "My first bike!",
    "created_at": "2024-11-09T10:30:00Z",
    "updated_at": "2024-11-09T10:30:00Z",
    "total_fuel_logs": 0,
    "latest_mileage": null,
    "average_mileage": null
  },
  "message": "Bike registered successfully"
}
```

**Save the `id` from response** - you'll need it for other requests!

---

### 2. List All My Bikes (GET /api/v1/bikes)

```bash
curl -X GET http://localhost:8080/api/v1/bikes \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "bikes": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "brand": "Royal Enfield",
        "model": "Classic 350",
        ...
      }
    ],
    "total": 1
  }
}
```

---

### 3. Get Bike Details (GET /api/v1/bikes/:id)

```bash
curl -X GET http://localhost:8080/api/v1/bikes/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Replace `550e8400-e29b-41d4-a716-446655440000` with your actual bike ID.**

---

### 4. Update Bike (PUT /api/v1/bikes/:id)

**All fields are optional** - only send what you want to update:

```bash
curl -X PUT http://localhost:8080/api/v1/bikes/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "year": 2024,
    "current_odometer": 1500,
    "notes": "Updated notes - bike is running great!"
  }'
```

**Request Body (all optional):**
```json
{
  "brand": "string",
  "model": "string",
  "year": "integer",
  "registration_number": "string",
  "purchase_date": "ISO 8601 datetime",
  "purchase_price": "number",
  "current_odometer": "integer",
  "fuel_type": "string",
  "photo_url": "string",
  "notes": "string"
}
```

---

### 5. Delete Bike (DELETE /api/v1/bikes/:id)

```bash
curl -X DELETE http://localhost:8080/api/v1/bikes/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**⚠️ Important Notes:**
- This is a **soft delete** - the bike is marked as deleted but not removed from database
- All fuel logs for this bike are also soft-deleted (cascade delete)
- You **can reuse the same registration number** after deleting a bike
- Soft-deleted bikes won't appear in list/get queries

---

## ⛽ Step 3: Fuel Log APIs

### 1. Add First Fuel Log (POST /api/v1/bikes/:bike_id/fuel-logs)

**First fuel log (baseline - no mileage calculated):**
```bash
curl -X POST http://localhost:8080/api/v1/bikes/550e8400-e29b-41d4-a716-446655440000/fuel-logs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "date": "2024-11-01T10:00:00Z",
    "odometer_reading": 1000,
    "liters": 5.0,
    "price_per_liter": 105.50
  }'
```

**Request Body Fields:**
```json
{
  "date": "ISO 8601 datetime (required)",
  "odometer_reading": "integer (required)",
  "liters": "number (required)",
  "price_per_liter": "number (required)",
  "fuel_type": "string (optional)",
  "is_full_tank": "boolean (optional, default: true)",
  "location": "string (optional)",
  "notes": "string (optional)"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "bike_id": "550e8400-e29b-41d4-a716-446655440000",
    "date": "2024-11-01T10:00:00Z",
    "odometer_reading": 1000,
    "liters": 5.0,
    "price_per_liter": 105.50,
    "total_cost": 527.50,
    "fuel_type": "",
    "mileage": null,
    "distance_covered": null,
    "is_full_tank": true,
    "location": "",
    "notes": "",
    "created_at": "2024-11-09T10:30:00Z",
    "updated_at": "2024-11-09T10:30:00Z"
  },
  "message": "Fuel log added successfully"
}
```

---

### 2. Add Second Fuel Log (Mileage Calculation Happens!)

```bash
curl -X POST http://localhost:8080/api/v1/bikes/550e8400-e29b-41d4-a716-446655440000/fuel-logs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "date": "2024-11-05T14:30:00Z",
    "odometer_reading": 1200,
    "liters": 4.0,
    "price_per_liter": 106.00,
    "fuel_type": "Petrol",
    "is_full_tank": true,
    "location": "Shell Petrol Pump, Mumbai",
    "notes": "Highway ride"
  }'
```

**What happens:**
- Distance covered = 1200 - 1000 = 200 km
- **First log's mileage** is updated = 200 / 5.0 = **40 km/l**
- Second log has no mileage yet (needs a third log)

---

### 3. Add Third Fuel Log

```bash
curl -X POST http://localhost:8080/api/v1/bikes/550e8400-e29b-41d4-a716-446655440000/fuel-logs \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "date": "2024-11-09T09:00:00Z",
    "odometer_reading": 1380,
    "liters": 4.5,
    "price_per_liter": 107.00,
    "fuel_type": "Petrol",
    "is_full_tank": true,
    "location": "HP Petrol Pump",
    "notes": "City riding"
  }'
```

**What happens:**
- Distance covered = 1380 - 1200 = 180 km
- **Second log's mileage** is updated = 180 / 4.0 = **45 km/l**

---

### 4. List All Fuel Logs (GET /api/v1/bikes/:bike_id/fuel-logs)

```bash
curl -X GET http://localhost:8080/api/v1/bikes/550e8400-e29b-41d4-a716-446655440000/fuel-logs \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fuel_logs": [
      {
        "id": "...",
        "odometer_reading": 1380,
        "mileage": null,
        ...
      },
      {
        "id": "...",
        "odometer_reading": 1200,
        "mileage": 45.0,
        "distance_covered": 180,
        ...
      },
      {
        "id": "...",
        "odometer_reading": 1000,
        "mileage": 40.0,
        "distance_covered": 200,
        ...
      }
    ],
    "total": 3
  }
}
```

---

### 5. Get Fuel Log Details (GET /api/v1/bikes/:bike_id/fuel-logs/:id)

```bash
curl -X GET http://localhost:8080/api/v1/bikes/550e8400-e29b-41d4-a716-446655440000/fuel-logs/FUEL_LOG_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

### 6. Update Fuel Log (PUT /api/v1/bikes/:bike_id/fuel-logs/:id)

**All fields are optional:**

```bash
curl -X PUT http://localhost:8080/api/v1/bikes/550e8400-e29b-41d4-a716-446655440000/fuel-logs/FUEL_LOG_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "liters": 4.2,
    "price_per_liter": 106.50,
    "notes": "Updated: Actually filled 4.2 liters"
  }'
```

**⚠️ Note:** If you update `odometer_reading` or `date`, the mileage chain will be recalculated automatically.

---

### 7. Delete Fuel Log (DELETE /api/v1/bikes/:bike_id/fuel-logs/:id)

```bash
curl -X DELETE http://localhost:8080/api/v1/bikes/550e8400-e29b-41d4-a716-446655440000/fuel-logs/FUEL_LOG_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**⚠️ Note:** Deleting a fuel log will reset the mileage for the next log (if exists).

---

### 8. Get Fuel Statistics (GET /api/v1/bikes/:bike_id/fuel-stats)

```bash
curl -X GET http://localhost:8080/api/v1/bikes/550e8400-e29b-41d4-a716-446655440000/fuel-stats \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "bike_id": "550e8400-e29b-41d4-a716-446655440000",
    "total_fuel_logs": 3,
    "total_liters": 13.5,
    "total_cost": 1434.50,
    "total_distance": 380,
    "average_mileage": 42.5,
    "latest_mileage": 45.0,
    "best_mileage": 45.0,
    "worst_mileage": 40.0,
    "average_cost_per_km": 3.78
  }
}
```

---

## 📝 Complete Testing Flow

Here's a step-by-step testing sequence:

```bash
# 1. Register and login
curl -X POST http://localhost:8080/api/v1/user/register -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"Test@1234","name":"Test User"}'
TOKEN=$(curl -X POST http://localhost:8080/api/v1/user/login -H "Content-Type: application/json" -d '{"email":"test@example.com","password":"Test@1234"}' | jq -r '.data.token')

# 2. Create a bike
BIKE_ID=$(curl -X POST http://localhost:8080/api/v1/bikes -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"brand":"Honda","model":"Activa","initial_odometer":0}' | jq -r '.data.id')

# 3. Add fuel logs
curl -X POST http://localhost:8080/api/v1/bikes/$BIKE_ID/fuel-logs -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"date":"2024-11-01T10:00:00Z","odometer_reading":1000,"liters":5.0,"price_per_liter":105.50}'
curl -X POST http://localhost:8080/api/v1/bikes/$BIKE_ID/fuel-logs -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"date":"2024-11-05T14:00:00Z","odometer_reading":1200,"liters":4.0,"price_per_liter":106.00}'
curl -X POST http://localhost:8080/api/v1/bikes/$BIKE_ID/fuel-logs -H "Content-Type: application/json" -H "Authorization: Bearer $TOKEN" -d '{"date":"2024-11-09T09:00:00Z","odometer_reading":1380,"liters":4.5,"price_per_liter":107.00}'

# 4. Get fuel stats
curl -X GET http://localhost:8080/api/v1/bikes/$BIKE_ID/fuel-stats -H "Authorization: Bearer $TOKEN"

# 5. List all bikes
curl -X GET http://localhost:8080/api/v1/bikes -H "Authorization: Bearer $TOKEN"
```

---

## 🧪 Postman Collection

You can also import this as a Postman collection. Create a new collection with:

1. **Environment Variables:**
   - `base_url`: `http://localhost:8080`
   - `token`: (set after login)
   - `bike_id`: (set after creating bike)

2. **Pre-request Script** (for authenticated requests):
   ```javascript
   pm.request.headers.add({
     key: 'Authorization',
     value: 'Bearer ' + pm.environment.get('token')
   });
   ```

---

## ✅ Expected Results

After running the complete flow:

1. ✅ User created and logged in
2. ✅ Bike registered with initial odometer = 0
3. ✅ First fuel log added (no mileage)
4. ✅ Second fuel log added → First log now shows mileage = 40 km/l
5. ✅ Third fuel log added → Second log now shows mileage = 45 km/l
6. ✅ Fuel stats show average mileage = 42.5 km/l

---

## 🐛 Common Errors

**401 Unauthorized:**
- Token expired or invalid
- Missing `Authorization` header

**400 Bad Request:**
- Invalid JSON format
- Missing required fields
- Validation errors (e.g., odometer < initial_odometer)

**404 Not Found:**
- Bike ID doesn't exist
- Fuel log ID doesn't exist
- Trying to access another user's bike

---

Happy Testing! 🚀

