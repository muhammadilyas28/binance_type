# Admin Dashboard API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## 1. Authentication Endpoints

### 1.1 User Registration
**POST** `/auth/register`

**Request Body:**
```json
{
  "fullName": "string",
  "email": "string",
  "password": "string",
  "role": "user" | "admin"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": "string",
    "fullName": "string",
    "email": "string",
    "role": "string",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

**Validation Rules:**
- `fullName`: Required, min 2 characters, max 50 characters
- `email`: Required, valid email format, unique
- `password`: Required, min 6 characters, max 128 characters
- `role`: Required, must be "user" or "admin"

---

### 1.2 User Login
**POST** `/auth/login`

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "string",
      "fullName": "string",
      "email": "string",
      "role": "string",
      "profilePicture": "string | null",
      "isVerified": "boolean",
      "createdAt": "datetime",
      "updatedAt": "datetime"
    },
    "token": "jwt_token_string",
    "refreshToken": "refresh_token_string"
  }
}
```

---

### 1.3 Refresh Token
**POST** `/auth/refresh`

**Request Body:**
```json
{
  "refreshToken": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "token": "new_jwt_token_string",
    "refreshToken": "new_refresh_token_string"
  }
}
```

---

### 1.4 Logout
**POST** `/auth/logout`

**Request Body:**
```json
{
  "refreshToken": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 2. User Profile Management

### 2.1 Get User Profile
**GET** `/users/profile`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "fullName": "string",
    "email": "string",
    "role": "string",
    "profilePicture": "string | null",
    "isVerified": "boolean",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

---

### 2.2 Update User Profile
**PUT** `/users/profile`

**Request Body:**
```json
{
  "fullName": "string",
  "email": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "string",
    "fullName": "string",
    "email": "string",
    "role": "string",
    "profilePicture": "string | null",
    "isVerified": "boolean",
    "updatedAt": "datetime"
  }
}
```

---

### 2.3 Change Password
**PUT** `/users/change-password`

**Request Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string",
  "confirmPassword": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

**Validation Rules:**
- `currentPassword`: Required, must match existing password
- `newPassword`: Required, min 6 characters, max 128 characters
- `confirmPassword`: Required, must match newPassword

---

### 2.4 Upload Profile Picture
**POST** `/users/profile-picture`

**Request Body:** `multipart/form-data`
```
profilePicture: File (image/jpeg, image/png, image/gif, max 5MB)
```

**Response (200):**
```json
{
  "success": true,
  "message": "Profile picture uploaded successfully",
  "data": {
    "profilePicture": "url_to_uploaded_image"
  }
}
```

---

### 2.5 Remove Profile Picture
**DELETE** `/users/profile-picture`

**Response (200):**
```json
{
  "success": true,
  "message": "Profile picture removed successfully"
}
```

---

## 3. Payment Request Management

### 3.1 Create Payment Request
**POST** `/payment-requests`

**Request Body:**
```json
{
  "amount": "number",
  "description": "string",
  "paymentMethod": "string",
  "expectedDate": "date"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Payment request created successfully",
  "data": {
    "id": "string",
    "userId": "string",
    "userName": "string",
    "amount": "number",
    "description": "string",
    "status": "pending",
    "isVerified": "boolean",
    "paymentMethod": "string",
    "expectedDate": "date",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

---

### 3.2 Get All Payment Requests (Admin)
**GET** `/admin/payment-requests`

**Query Parameters:**
```
?status=all|pending|approved|rejected
?verified=all|verified|unverified
?page=number
?limit=number
?search=string
?sortBy=createdAt|amount|status
?sortOrder=asc|desc
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "string",
        "userId": "string",
        "userName": "string",
        "amount": "number",
        "description": "string",
        "status": "pending|approved|rejected",
        "isVerified": "boolean",
        "paymentMethod": "string",
        "expectedDate": "date",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number",
      "totalPages": "number"
    }
  }
}
```

---

### 3.3 Get User Payment Requests
**GET** `/users/payment-requests`

**Query Parameters:**
```
?status=all|pending|approved|rejected
?page=number
?limit=number
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": "string",
        "amount": "number",
        "description": "string",
        "status": "pending|approved|rejected",
        "isVerified": "boolean",
        "paymentMethod": "string",
        "expectedDate": "date",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number",
      "totalPages": "number"
    }
  }
}
```

---

### 3.4 Get Single Payment Request
**GET** `/payment-requests/:id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": "string",
    "userId": "string",
    "userName": "string",
    "amount": "number",
    "description": "string",
    "status": "pending|approved|rejected",
    "isVerified": "boolean",
    "paymentMethod": "string",
    "expectedDate": "date",
    "createdAt": "datetime",
    "updatedAt": "datetime"
  }
}
```

---

### 3.5 Update Payment Request Status (Admin)
**PUT** `/admin/payment-requests/:id/status`

**Request Body:**
```json
{
  "status": "approved|rejected",
  "reason": "string",
  "adminNotes": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment request status updated successfully",
  "data": {
    "id": "string",
    "status": "approved|rejected",
    "reason": "string",
    "adminNotes": "string",
    "updatedAt": "datetime"
  }
}
```

---

### 3.6 Cancel Payment Request (User)
**PUT** `/payment-requests/:id/cancel`

**Request Body:**
```json
{
  "reason": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Payment request cancelled successfully",
  "data": {
    "id": "string",
    "status": "cancelled",
    "reason": "string",
    "updatedAt": "datetime"
  }
}
```

---

### 3.7 Delete Payment Request
**DELETE** `/payment-requests/:id`

**Response (200):**
```json
{
  "success": true,
  "message": "Payment request deleted successfully"
}
```

---

## 4. Admin Dashboard Statistics

### 4.1 Get Dashboard Stats
**GET** `/admin/dashboard/stats`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalRequests": "number",
    "pendingRequests": "number",
    "approvedRequests": "number",
    "rejectedRequests": "number",
    "totalAmount": "number",
    "pendingAmount": "number",
    "approvedAmount": "number",
    "rejectedAmount": "number",
    "verifiedUsers": "number",
    "unverifiedUsers": "number"
  }
}
```

---

### 4.2 Get Recent Activity
**GET** `/admin/dashboard/recent-activity`

**Query Parameters:**
```
?limit=number (default: 10)
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "type": "payment_request|status_change|user_registration",
      "description": "string",
      "userId": "string",
      "userName": "string",
      "timestamp": "datetime",
      "metadata": "object"
    }
  ]
}
```

---

## 5. User Management (Admin)

### 5.1 Get All Users
**GET** `/admin/users`

**Query Parameters:**
```
?verified=all|verified|unverified
?role=all|user|admin
?search=string
?page=number
?limit=number
?sortBy=createdAt|fullName|email
?sortOrder=asc|desc
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "string",
        "fullName": "string",
        "email": "string",
        "role": "string",
        "isVerified": "boolean",
        "profilePicture": "string | null",
        "createdAt": "datetime",
        "updatedAt": "datetime"
      }
    ],
    "pagination": {
      "page": "number",
      "limit": "number",
      "total": "number",
      "totalPages": "number"
    }
  }
}
```

---

### 5.2 Update User Verification Status
**PUT** `/admin/users/:id/verification`

**Request Body:**
```json
{
  "isVerified": "boolean",
  "reason": "string"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User verification status updated successfully",
  "data": {
    "id": "string",
    "isVerified": "boolean",
    "updatedAt": "datetime"
  }
}
```

---

### 5.3 Change User Role
**PUT** `/admin/users/:id/role`

**Request Body:**
```json
{
  "role": "user|admin"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User role updated successfully",
  "data": {
    "id": "string",
    "role": "string",
    "updatedAt": "datetime"
  }
}
```

---

## 6. Database Schemas

### 6.1 Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fullName VARCHAR(50) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  profilePicture VARCHAR(500),
  isVerified BOOLEAN DEFAULT false,
  refreshToken VARCHAR(500),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 6.2 Payment Requests Table
```sql
CREATE TABLE payment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  status ENUM('pending', 'approved', 'rejected', 'cancelled') DEFAULT 'pending',
  isVerified BOOLEAN DEFAULT false,
  paymentMethod VARCHAR(100),
  expectedDate DATE,
  reason TEXT,
  adminNotes TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

### 6.3 Activity Logs Table
```sql
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID,
  type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  metadata JSON,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
);
```

---

## 7. Error Responses

### 7.1 Standard Error Format
```json
{
  "success": false,
  "error": {
    "code": "string",
    "message": "string",
    "details": "object | null"
  }
}
```

### 7.2 Common Error Codes
- `VALIDATION_ERROR`: Input validation failed
- `AUTHENTICATION_ERROR`: Invalid or missing authentication
- `AUTHORIZATION_ERROR`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `CONFLICT`: Resource already exists
- `INTERNAL_ERROR`: Server error

### 7.3 Example Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": "Invalid email format",
      "password": "Password must be at least 6 characters"
    }
  }
}
```

---

## 8. Rate Limiting

- **Authentication endpoints**: 5 requests per minute per IP
- **Profile updates**: 10 requests per minute per user
- **Payment requests**: 20 requests per minute per user
- **Admin endpoints**: 100 requests per minute per admin

---

## 9. Security Requirements

1. **Password Hashing**: Use bcrypt with salt rounds 12
2. **JWT Tokens**: 
   - Access token expiry: 15 minutes
   - Refresh token expiry: 7 days
3. **Input Validation**: Sanitize all inputs, prevent SQL injection
4. **CORS**: Configure appropriate CORS policies
5. **HTTPS**: Use HTTPS in production
6. **Rate Limiting**: Implement rate limiting for all endpoints

---

## 10. Testing Endpoints

### 10.1 Health Check
**GET** `/health`

**Response (200):**
```json
{
  "status": "healthy",
  "timestamp": "datetime",
  "version": "string"
}
```

---

## Notes for Backend Development

1. **Database**: Use PostgreSQL for production, SQLite for development
2. **File Uploads**: Implement secure file upload with size and type validation
3. **Email Verification**: Implement email verification system for new registrations
4. **Password Reset**: Add password reset functionality via email
5. **Logging**: Implement comprehensive logging for all operations
6. **Testing**: Write unit tests for all endpoints and business logic
7. **Documentation**: Keep API documentation updated with any changes
8. **Monitoring**: Implement health checks and performance monitoring

---

This documentation covers all the essential functionality needed for the admin dashboard system. The backend team can use this as a reference to implement the APIs according to the specified schemas and requirements.
