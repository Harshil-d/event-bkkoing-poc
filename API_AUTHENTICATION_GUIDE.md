# API Authentication Guide

## Overview
This guide explains how to authenticate with the Event Booking API and use protected endpoints.

## Authentication Flow

### 1. Login
First, authenticate to get access and refresh tokens:

**User Login:**
```bash
curl -X POST http://localhost:3001/api/auth/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "your_password"
  }'
```

**Admin Login:**
```bash
curl -X POST http://localhost:3001/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your_password"
  }'
```

**Response:**
```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "fullName": "John Doe",
    "email": "user@example.com",
    "role": "USER"
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 2. Using Access Token
Include the access token in the Authorization header for protected endpoints:

```bash
curl -X GET http://localhost:3001/api/events \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. Refresh Token
When the access token expires, use the refresh token to get a new one:

```bash
curl -X POST http://localhost:3001/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_refresh_token" \
  -d '{
    "refreshToken": "your_refresh_token"
  }'
```

## Protected Endpoints

All endpoints except authentication require a valid access token in the Authorization header.

### Events
- `GET /api/events` - List events (USER, ADMIN)
- `GET /api/events/:id` - Get event details (USER, ADMIN)
- `POST /api/events` - Create event (ADMIN only)
- `PATCH /api/events/:id` - Update event (ADMIN only)
- `DELETE /api/events/:id` - Delete event (ADMIN only)

### Bookings
- `POST /api/bookings` - Create booking (USER only)
- `GET /api/bookings/my` - Get my bookings (USER only)
- `GET /api/bookings` - Get all bookings (ADMIN only)
- `PATCH /api/bookings/:id/cancel` - Cancel booking (USER, ADMIN)

### Dashboard
- `GET /api/dashboard/admin` - Admin dashboard (ADMIN only)
- `GET /api/dashboard/user` - User dashboard (USER only)

## Error Responses

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Insufficient permissions"
}
```

## Frontend Integration

The frontend automatically handles token management:

1. **Login**: Tokens are stored in localStorage
2. **Automatic Token Attachment**: Axios interceptor automatically adds Authorization header
3. **Token Refresh**: Automatic refresh when access token expires
4. **Logout**: Tokens are cleared from localStorage

## Swagger Documentation

Visit `http://localhost:3001/docs` to see the interactive API documentation with authentication examples.

## Troubleshooting

### Common Issues

1. **"Unauthorized" Error**
   - Ensure you're including the `Authorization: Bearer <token>` header
   - Check if the token has expired
   - Verify the token is valid

2. **"Insufficient permissions" Error**
   - Check if your user role has permission for the endpoint
   - Admin endpoints require ADMIN role
   - User endpoints require USER role

3. **Token Expired**
   - Use the refresh token to get a new access token
   - If refresh token is also expired, re-login

### Testing with cURL

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:3001/api/auth/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}' | \
  jq -r '.tokens.accessToken')

# 2. Use token for protected endpoint
curl -X GET http://localhost:3001/api/events \
  -H "Authorization: Bearer $TOKEN"
```

