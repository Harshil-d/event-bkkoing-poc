# API Request Examples

## Overview
This document provides comprehensive request examples for all API endpoints with proper authentication and data formats.

## Authentication Endpoints

### 1. Admin Login
**POST** `/api/auth/admin/login`

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "AdminPass123!"
}
```

**Response:**
```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "fullName": "Admin User",
    "email": "admin@example.com",
    "role": "ADMIN"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. User Login
**POST** `/api/auth/user/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "UserPass123!"
}
```

### 3. User Registration
**POST** `/api/auth/user/register`

**Request Body:**
```json
{
  "email": "newuser@example.com",
  "password": "UserPass123!",
  "fullName": "John Doe"
}
```

### 4. Admin Registration
**POST** `/api/auth/admin/register`

**Request Body:**
```json
{
  "email": "newadmin@example.com",
  "password": "AdminPass123!",
  "fullName": "Admin User"
}
```

### 5. Refresh Token
**POST** `/api/auth/refresh-token`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Events API

### 1. List Events
**GET** `/api/events`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search in title and description
- `dateFrom` (optional): Filter events from this date (ISO 8601)
- `dateTo` (optional): Filter events to this date (ISO 8601)

**Example Requests:**
```bash
# Basic listing
GET /api/events?page=1&limit=10

# Search events
GET /api/events?search=tech conference&page=1&limit=10

# Filter by date range
GET /api/events?dateFrom=2024-06-01T00:00:00Z&dateTo=2024-06-30T23:59:59Z

# Combined filters
GET /api/events?search=conference&dateFrom=2024-06-01T00:00:00Z&page=1&limit=5
```

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### 2. Get Event Details
**GET** `/api/events/{id}`

**Example:**
```bash
GET /api/events/123e4567-e89b-12d3-a456-426614174000
```

**Headers:**
```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

### 3. Create Event (Admin Only)
**POST** `/api/events`

**Request Body:**
```json
{
  "title": "Tech Conference 2024",
  "description": "Annual technology conference featuring the latest innovations in software development, AI, and cloud computing. Join industry leaders for networking and knowledge sharing.",
  "eventDate": "2024-06-15T10:00:00Z",
  "totalSeats": 500,
  "price": 99.99,
  "location": "Convention Center, Hall A"
}
```

**Headers:**
```
Authorization: Bearer ADMIN_ACCESS_TOKEN
Content-Type: application/json
```

### 4. Update Event (Admin Only)
**PATCH** `/api/events/{id}`

**Request Body (all fields optional):**
```json
{
  "title": "Updated Tech Conference 2024",
  "description": "Updated description for the technology conference with new speakers and agenda.",
  "eventDate": "2024-06-20T09:00:00Z",
  "totalSeats": 600,
  "price": 129.99,
  "location": "Updated Convention Center, Hall B"
}
```

**Headers:**
```
Authorization: Bearer ADMIN_ACCESS_TOKEN
Content-Type: application/json
```

### 5. Delete Event (Admin Only)
**DELETE** `/api/events/{id}`

**Example:**
```bash
DELETE /api/events/123e4567-e89b-12d3-a456-426614174000
```

**Headers:**
```
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

## Bookings API

### 1. Create Booking (User Only)
**POST** `/api/bookings`

**Request Body:**
```json
{
  "eventId": "123e4567-e89b-12d3-a456-426614174000",
  "seats": 2
}
```

**Headers:**
```
Authorization: Bearer USER_ACCESS_TOKEN
Content-Type: application/json
```

### 2. Get My Bookings (User Only)
**GET** `/api/bookings/my`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by booking status (CONFIRMED, CANCELLED)

**Example Requests:**
```bash
# Get all my bookings
GET /api/bookings/my?page=1&limit=10

# Get only confirmed bookings
GET /api/bookings/my?status=CONFIRMED&page=1&limit=10

# Get cancelled bookings
GET /api/bookings/my?status=CANCELLED
```

**Headers:**
```
Authorization: Bearer USER_ACCESS_TOKEN
```

### 3. Get All Bookings (Admin Only)
**GET** `/api/bookings`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by booking status (CONFIRMED, CANCELLED)

**Example Requests:**
```bash
# Get all bookings
GET /api/bookings?page=1&limit=10

# Get only confirmed bookings
GET /api/bookings?status=CONFIRMED&page=1&limit=10
```

**Headers:**
```
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

### 4. Cancel Booking (User & Admin)
**PATCH** `/api/bookings/{id}/cancel`

**Example:**
```bash
PATCH /api/bookings/123e4567-e89b-12d3-a456-426614174000/cancel
```

**Headers:**
```
Authorization: Bearer USER_OR_ADMIN_ACCESS_TOKEN
```

## Dashboard API

### 1. Admin Dashboard
**GET** `/api/dashboard/admin`

**Headers:**
```
Authorization: Bearer ADMIN_ACCESS_TOKEN
```

### 2. User Dashboard
**GET** `/api/dashboard/user`

**Headers:**
```
Authorization: Bearer USER_ACCESS_TOKEN
```

## Complete cURL Examples

### 1. Complete Authentication Flow
```bash
# 1. Register a new user
curl -X POST http://localhost:3001/api/auth/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "UserPass123!",
    "fullName": "Test User"
  }'

# 2. Login to get token
USER_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "UserPass123!"
  }')

USER_TOKEN=$(echo $USER_RESPONSE | jq -r '.tokens.accessToken')
echo "User Token: $USER_TOKEN"
```

### 2. Complete Event Management Flow
```bash
# 1. Register admin
curl -X POST http://localhost:3001/api/auth/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "AdminPass123!",
    "fullName": "Admin User"
  }'

# 2. Admin login
ADMIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "AdminPass123!"
  }')

ADMIN_TOKEN=$(echo $ADMIN_RESPONSE | jq -r '.tokens.accessToken')

# 3. Create event
EVENT_RESPONSE=$(curl -s -X POST http://localhost:3001/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "title": "Tech Conference 2024",
    "description": "Annual technology conference featuring the latest innovations in software development, AI, and cloud computing.",
    "eventDate": "2024-06-15T10:00:00Z",
    "totalSeats": 500,
    "price": 99.99,
    "location": "Convention Center, Hall A"
  }')

EVENT_ID=$(echo $EVENT_RESPONSE | jq -r '.id')
echo "Created Event ID: $EVENT_ID"

# 4. List events
curl -X GET "http://localhost:3001/api/events?page=1&limit=10" \
  -H "Authorization: Bearer $USER_TOKEN"

# 5. Get event details
curl -X GET "http://localhost:3001/api/events/$EVENT_ID" \
  -H "Authorization: Bearer $USER_TOKEN"
```

### 3. Complete Booking Flow
```bash
# 1. Create booking
BOOKING_RESPONSE=$(curl -s -X POST http://localhost:3001/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{
    "eventId": "'$EVENT_ID'",
    "seats": 2
  }')

BOOKING_ID=$(echo $BOOKING_RESPONSE | jq -r '.id')
echo "Created Booking ID: $BOOKING_ID"

# 2. Get my bookings
curl -X GET "http://localhost:3001/api/bookings/my?page=1&limit=10" \
  -H "Authorization: Bearer $USER_TOKEN"

# 3. Cancel booking
curl -X PATCH "http://localhost:3001/api/bookings/$BOOKING_ID/cancel" \
  -H "Authorization: Bearer $USER_TOKEN"
```

## Error Response Examples

### 1. Validation Error (400 Bad Request)
```json
{
  "statusCode": 400,
  "message": [
    "title should not be empty",
    "eventDate must be a valid ISO 8601 date string",
    "totalSeats must be a positive number"
  ],
  "error": "Bad Request"
}
```

### 2. Unauthorized (401 Unauthorized)
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 3. Forbidden (403 Forbidden)
```json
{
  "statusCode": 403,
  "message": "Insufficient permissions"
}
```

### 4. Not Found (404 Not Found)
```json
{
  "statusCode": 404,
  "message": "Event not found"
}
```

### 5. Internal Server Error (500 Internal Server Error)
```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

## Data Validation Rules

### Event Creation/Update
- `title`: Required, string, max 255 characters
- `description`: Required, string
- `eventDate`: Required, valid ISO 8601 date string
- `totalSeats`: Required, positive integer
- `price`: Required, non-negative number
- `location`: Optional, string, max 255 characters

### Booking Creation
- `eventId`: Required, valid UUID
- `seats`: Required, positive integer

### Authentication
- `email`: Required, valid email format
- `password`: Required, string
- `fullName`: Required, string

## Testing with Postman

### 1. Import Collection
Create a Postman collection with the following structure:
- **Authentication**
  - Admin Login
  - User Login
  - User Register
  - Admin Register
  - Refresh Token

- **Events**
  - List Events
  - Get Event Details
  - Create Event
  - Update Event
  - Delete Event

- **Bookings**
  - Create Booking
  - Get My Bookings
  - Get All Bookings (Admin)
  - Cancel Booking

- **Dashboard**
  - Admin Dashboard
  - User Dashboard

### 2. Environment Variables
Set up environment variables:
- `baseUrl`: `http://localhost:3001/api`
- `adminToken`: Set after admin login
- `userToken`: Set after user login
- `eventId`: Set after creating an event
- `bookingId`: Set after creating a booking

### 3. Pre-request Scripts
Add pre-request scripts to automatically set authorization headers:
```javascript
if (pm.environment.get("adminToken")) {
    pm.request.headers.add({
        key: "Authorization",
        value: "Bearer " + pm.environment.get("adminToken")
    });
}
```

This comprehensive guide provides all the request examples needed to test and integrate with the Event Booking API.


