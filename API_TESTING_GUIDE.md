# API Testing Guide

## Overview
This guide provides comprehensive examples for testing all API endpoints with proper authentication and error handling.

## Prerequisites
1. Backend server running on `http://localhost:3001`
2. Database properly configured and migrated
3. Valid user accounts created

## Authentication Setup

### 1. Create Test Users

**Create Admin User:**
```bash
curl -X POST http://localhost:3001/api/auth/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "AdminPass123!",
    "fullName": "Test Admin"
  }'
```

**Create Regular User:**
```bash
curl -X POST http://localhost:3001/api/auth/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "password": "UserPass123!",
    "fullName": "Test User"
  }'
```

### 2. Login and Get Tokens

**Admin Login:**
```bash
ADMIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "AdminPass123!"
  }')

ADMIN_TOKEN=$(echo $ADMIN_RESPONSE | jq -r '.tokens.accessToken')
echo "Admin Token: $ADMIN_TOKEN"
```

**User Login:**
```bash
USER_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@test.com",
    "password": "UserPass123!"
  }')

USER_TOKEN=$(echo $USER_RESPONSE | jq -r '.tokens.accessToken')
echo "User Token: $USER_TOKEN"
```

## Events API Testing

### 1. Create Event (Admin Only)

```bash
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
```

### 2. List Events (Admin & User)

```bash
# List all events
curl -X GET "http://localhost:3001/api/events?page=1&limit=10" \
  -H "Authorization: Bearer $USER_TOKEN"

# Search events
curl -X GET "http://localhost:3001/api/events?search=tech&page=1&limit=10" \
  -H "Authorization: Bearer $USER_TOKEN"

# Filter by date range
curl -X GET "http://localhost:3001/api/events?dateFrom=2024-06-01&dateTo=2024-06-30" \
  -H "Authorization: Bearer $USER_TOKEN"
```

### 3. Get Event Details

```bash
curl -X GET "http://localhost:3001/api/events/$EVENT_ID" \
  -H "Authorization: Bearer $USER_TOKEN"
```

### 4. Update Event (Admin Only)

```bash
curl -X PATCH "http://localhost:3001/api/events/$EVENT_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "title": "Updated Tech Conference 2024",
    "description": "Updated description for the technology conference",
    "price": 129.99,
    "location": "Updated Convention Center, Hall B"
  }'
```

### 5. Delete Event (Admin Only)

```bash
curl -X DELETE "http://localhost:3001/api/events/$EVENT_ID" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

## Bookings API Testing

### 1. Create Booking (User Only)

```bash
BOOKING_RESPONSE=$(curl -s -X POST http://localhost:3001/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{
    "eventId": "'$EVENT_ID'",
    "seats": 2
  }')

BOOKING_ID=$(echo $BOOKING_RESPONSE | jq -r '.id')
echo "Created Booking ID: $BOOKING_ID"
```

### 2. Get My Bookings (User Only)

```bash
curl -X GET "http://localhost:3001/api/bookings/my?page=1&limit=10" \
  -H "Authorization: Bearer $USER_TOKEN"

# Filter by status
curl -X GET "http://localhost:3001/api/bookings/my?status=CONFIRMED" \
  -H "Authorization: Bearer $USER_TOKEN"
```

### 3. Get All Bookings (Admin Only)

```bash
curl -X GET "http://localhost:3001/api/bookings?page=1&limit=10" \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Filter by status
curl -X GET "http://localhost:3001/api/bookings?status=CONFIRMED" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### 4. Cancel Booking (User & Admin)

```bash
# User cancels their own booking
curl -X PATCH "http://localhost:3001/api/bookings/$BOOKING_ID/cancel" \
  -H "Authorization: Bearer $USER_TOKEN"

# Admin cancels any booking
curl -X PATCH "http://localhost:3001/api/bookings/$BOOKING_ID/cancel" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

## Dashboard API Testing

### 1. Admin Dashboard

```bash
curl -X GET "http://localhost:3001/api/dashboard/admin" \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

### 2. User Dashboard

```bash
curl -X GET "http://localhost:3001/api/dashboard/user" \
  -H "Authorization: Bearer $USER_TOKEN"
```

## Error Testing

### 1. Unauthorized Access

```bash
# Try to access protected endpoint without token
curl -X GET "http://localhost:3001/api/events"
# Expected: 401 Unauthorized

# Try to access with invalid token
curl -X GET "http://localhost:3001/api/events" \
  -H "Authorization: Bearer invalid_token"
# Expected: 401 Unauthorized
```

### 2. Forbidden Access

```bash
# User tries to create event (admin only)
curl -X POST http://localhost:3001/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{
    "title": "Test Event",
    "description": "Test Description",
    "eventDate": "2024-06-15T10:00:00Z",
    "totalSeats": 100,
    "price": 50.00
  }'
# Expected: 403 Forbidden

# User tries to access admin dashboard
curl -X GET "http://localhost:3001/api/dashboard/admin" \
  -H "Authorization: Bearer $USER_TOKEN"
# Expected: 403 Forbidden
```

### 3. Validation Errors

```bash
# Create event with invalid data
curl -X POST http://localhost:3001/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "title": "",
    "description": "Test Description",
    "eventDate": "invalid-date",
    "totalSeats": -1,
    "price": -10.00
  }'
# Expected: 400 Bad Request with validation errors

# Create booking with invalid data
curl -X POST http://localhost:3001/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{
    "eventId": "invalid-uuid",
    "seats": 0
  }'
# Expected: 400 Bad Request with validation errors
```

### 4. Not Found Errors

```bash
# Get non-existent event
curl -X GET "http://localhost:3001/api/events/00000000-0000-0000-0000-000000000000" \
  -H "Authorization: Bearer $USER_TOKEN"
# Expected: 404 Not Found

# Get non-existent booking
curl -X GET "http://localhost:3001/api/bookings/00000000-0000-0000-0000-000000000000" \
  -H "Authorization: Bearer $USER_TOKEN"
# Expected: 404 Not Found
```

## Complete Test Script

Here's a complete test script that runs all the tests:

```bash
#!/bin/bash

# Set colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting API Tests...${NC}"

# 1. Create test users
echo -e "${YELLOW}Creating test users...${NC}"
curl -s -X POST http://localhost:3001/api/auth/admin/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"AdminPass123!","fullName":"Test Admin"}' > /dev/null

curl -s -X POST http://localhost:3001/api/auth/user/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"UserPass123!","fullName":"Test User"}' > /dev/null

# 2. Login and get tokens
echo -e "${YELLOW}Logging in...${NC}"
ADMIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"AdminPass123!"}')

USER_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"UserPass123!"}')

ADMIN_TOKEN=$(echo $ADMIN_RESPONSE | jq -r '.tokens.accessToken')
USER_TOKEN=$(echo $USER_RESPONSE | jq -r '.tokens.accessToken')

if [ "$ADMIN_TOKEN" = "null" ] || [ "$USER_TOKEN" = "null" ]; then
  echo -e "${RED}Login failed!${NC}"
  exit 1
fi

echo -e "${GREEN}Login successful!${NC}"

# 3. Create event
echo -e "${YELLOW}Creating event...${NC}"
EVENT_RESPONSE=$(curl -s -X POST http://localhost:3001/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -d '{
    "title": "Tech Conference 2024",
    "description": "Annual technology conference",
    "eventDate": "2024-06-15T10:00:00Z",
    "totalSeats": 500,
    "price": 99.99,
    "location": "Convention Center"
  }')

EVENT_ID=$(echo $EVENT_RESPONSE | jq -r '.id')
if [ "$EVENT_ID" = "null" ]; then
  echo -e "${RED}Event creation failed!${NC}"
  echo $EVENT_RESPONSE
  exit 1
fi

echo -e "${GREEN}Event created with ID: $EVENT_ID${NC}"

# 4. List events
echo -e "${YELLOW}Testing list events...${NC}"
curl -s -X GET "http://localhost:3001/api/events?page=1&limit=10" \
  -H "Authorization: Bearer $USER_TOKEN" | jq '.data | length'

# 5. Create booking
echo -e "${YELLOW}Creating booking...${NC}"
BOOKING_RESPONSE=$(curl -s -X POST http://localhost:3001/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  -d '{"eventId":"'$EVENT_ID'","seats":2}')

BOOKING_ID=$(echo $BOOKING_RESPONSE | jq -r '.id')
if [ "$BOOKING_ID" = "null" ]; then
  echo -e "${RED}Booking creation failed!${NC}"
  echo $BOOKING_RESPONSE
  exit 1
fi

echo -e "${GREEN}Booking created with ID: $BOOKING_ID${NC}"

# 6. Test dashboard
echo -e "${YELLOW}Testing dashboards...${NC}"
curl -s -X GET "http://localhost:3001/api/dashboard/admin" \
  -H "Authorization: Bearer $ADMIN_TOKEN" | jq '.totalEvents'

curl -s -X GET "http://localhost:3001/api/dashboard/user" \
  -H "Authorization: Bearer $USER_TOKEN" | jq '.totalBookings'

echo -e "${GREEN}All tests completed successfully!${NC}"
```

## Performance Testing

### Load Testing with Apache Bench

```bash
# Test event listing endpoint
ab -n 100 -c 10 -H "Authorization: Bearer $USER_TOKEN" \
  "http://localhost:3001/api/events?page=1&limit=10"

# Test booking creation
ab -n 50 -c 5 -p booking_data.json -T "application/json" \
  -H "Authorization: Bearer $USER_TOKEN" \
  "http://localhost:3001/api/bookings"
```

Where `booking_data.json` contains:
```json
{
  "eventId": "YOUR_EVENT_ID",
  "seats": 1
}
```

## Monitoring and Debugging

### 1. Check Server Logs
```bash
# If using PM2
pm2 logs

# If using npm
npm run start:dev
```

### 2. Database Queries
```bash
# Connect to database and check tables
psql -h localhost -U your_username -d your_database

# Check events table
SELECT * FROM events LIMIT 5;

# Check bookings table
SELECT * FROM bookings LIMIT 5;

# Check users table
SELECT * FROM users LIMIT 5;
```

### 3. Health Check
```bash
# Check if server is running
curl -I http://localhost:3001/api/events

# Check Swagger documentation
open http://localhost:3001/docs
```

## Common Issues and Solutions

### 1. 500 Internal Server Error
- Check database connection
- Verify all required fields are present
- Check server logs for detailed error messages
- Ensure database migrations are up to date

### 2. 401 Unauthorized
- Verify token is valid and not expired
- Check if token is properly formatted in Authorization header
- Ensure user account exists and is active

### 3. 403 Forbidden
- Check user role permissions
- Verify endpoint requires correct role (ADMIN vs USER)
- Ensure user is authenticated

### 4. 400 Bad Request
- Check request body format
- Verify all required fields are provided
- Check data types and validation rules
- Ensure dates are in correct format (ISO 8601)

### 5. 404 Not Found
- Verify resource ID exists
- Check if resource was deleted
- Ensure correct endpoint URL

This guide should help you thoroughly test all API endpoints and identify any issues.
