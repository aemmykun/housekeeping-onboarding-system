# 🔐 Authentication System Documentation

## ✅ What's Been Implemented

Your Housekeeping Onboarding System now has a **complete authentication system** with:

### Backend (API)

- ✅ User registration with validation
- ✅ User login with JWT tokens
- ✅ Password hashing with bcrypt
- ✅ Protected routes with middleware
- ✅ Role-based authorization
- ✅ Profile management
- ✅ Logout functionality

### Frontend (React)

- ✅ Login page with Material-UI
- ✅ Registration page with form validation
- ✅ Auth Context for global state management
- ✅ Protected routes
- ✅ Dashboard with user profile
- ✅ Password visibility toggle
- ✅ Error handling and loading states

---

## 🚀 How to Use

### 1. Access the Application

Open your browser and navigate to:

```text
http://localhost:3000
```

### 2. Register a New Account

1. Click **"Get Started"** on the homepage
2. Or navigate to: `http://localhost:3000/register`
3. Fill in the registration form:
   - First Name
   - Last Name
   - Email
   - Password (min 6 characters)
   - Confirm Password
   - Role (Trainee, Mentor, or Supervisor)
   - Department
   - Phone (optional)
4. Click **"Create Account"**
5. You'll be automatically logged in and redirected to the dashboard

### 3. Login to Existing Account

1. Navigate to: `http://localhost:3000/login`
2. Enter your email and password
3. Click **"Sign In"**
4. You'll be redirected to your dashboard

### 4. View Dashboard

After logging in, you'll see:

- Your profile information
- Statistics (modules completed, points, level, badges)
- Learning journey overview
- Logout button

---

## 📡 API Endpoints

### Public Endpoints (No Authentication Required)

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "trainee",
  "department": "Housekeeping",
  "phone": "123-456-7890"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Registration successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "trainee",
    "department": "Housekeeping",
    "points": 0,
    "level": 1,
    "badges": []
  }
}
```

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

### Protected Endpoints (Require Authentication)

All protected endpoints require the JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

#### Get Current User Profile

```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Update Profile

```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "123-456-7890",
  "emergencyContact": {
    "name": "Jane Doe",
    "phone": "098-765-4321",
    "relationship": "Spouse"
  }
}
```

#### Logout

```http
POST /api/auth/logout
Authorization: Bearer <token>
```

---

## 🧪 Testing the API with PowerShell

### Test Registration

```powershell
$body = @{
    firstName = "Test"
    lastName = "User"
    email = "test@example.com"
    password = "password123"
    role = "trainee"
    department = "Housekeeping"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:5000/api/auth/register" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

### Test Login

```powershell
$body = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"

# Save token for next requests
$token = $response.token
```

### Test Protected Endpoint

```powershell
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/me" `
    -Method GET `
    -Headers @{Authorization = "Bearer $token"}
```

---

## 🔒 Security Features

### Password Security

- ✅ Passwords hashed with bcrypt (10 salt rounds)
- ✅ Minimum 6 character requirement
- ✅ Passwords never returned in API responses
- ✅ Password confirmation on registration

### Token Security

- ✅ JWT tokens with 7-day expiration
- ✅ Tokens stored in localStorage (client-side)
- ✅ Automatic token validation on protected routes
- ✅ Token includes user ID, email, and role

### Authorization

- ✅ Role-based access control (trainee, mentor, supervisor, admin)
- ✅ Middleware for protecting routes
- ✅ Account deactivation support

---

## 📁 File Structure

```text
housekeeping-onboarding-system/
├── backend/
│   ├── controllers/
│   │   └── authController.js      ← Auth logic (register, login, profile)
│   ├── middleware/
│   │   └── auth.js                ← JWT verification & authorization
│   ├── models/
│   │   └── User.js                ← User schema with auth methods
│   ├── routes/
│   │   └── auth.js                ← Auth API routes
│   └── server.js                  ← Updated with auth routes
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Auth/
    │   │   │   ├── Login.jsx      ← Login form
    │   │   │   ├── Register.jsx   ← Registration form
    │   │   │   └── ProtectedRoute.jsx ← Route guard
    │   │   └── Dashboard/
    │   │       └── Dashboard.jsx  ← User dashboard
    │   ├── contexts/
    │   │   └── AuthContext.js     ← Auth state management
    │   └── App.js                 ← Updated with routes
    └── .env                       ← API URL configuration
```

---

## 🎨 Frontend Features

### Login Page (`/login`)

- Email and password fields
- Password visibility toggle
- Form validation
- Error messages
- Loading states
- Link to registration

### Registration Page (`/register`)

- Multi-field form with validation
- Password confirmation
- Role and department selection
- Responsive grid layout
- Error handling

### Dashboard (`/dashboard`)

- User profile display
- Statistics cards (modules, points, level, badges)
- Logout functionality
- Protected route (requires authentication)

### Auth Context

- Global authentication state
- Login/logout functions
- User data management
- Automatic token handling
- Error state management

---

## 🔄 Authentication Flow

### Registration Flow

1. User fills registration form
2. Frontend validates input
3. POST request to `/api/auth/register`
4. Backend validates and creates user
5. Password is hashed with bcrypt
6. JWT token is generated
7. Token and user data returned
8. Token stored in localStorage
9. User redirected to dashboard

### Login Flow

1. User enters credentials
2. POST request to `/api/auth/login`
3. Backend finds user and verifies password
4. JWT token generated
5. Last login timestamp updated
6. Token and user data returned
7. Token stored in localStorage
8. User redirected to dashboard

### Protected Route Access

1. User navigates to protected route
2. ProtectedRoute component checks auth state
3. If not authenticated, redirect to login
4. If authenticated, render component
5. All API requests include JWT token in header

---

## 🐛 Troubleshooting

### "Invalid email or password"

- Check that email is correct (case-insensitive)
- Verify password is correct
- Ensure account exists (register first)

### "Token expired"

- Tokens expire after 7 days
- Login again to get a new token

### "Not authorized"

- Check that token is included in request
- Verify token hasn't expired
- Ensure account is active

### CORS Errors

- Backend CORS is configured for `http://localhost:3000`
- Check that frontend is running on port 3000
- Verify `FRONTEND_URL` in backend `.env`

### MongoDB Connection Issues

- Verify MongoDB Atlas connection string in `.env`
- Check network access in MongoDB Atlas
- Ensure database user credentials are correct

---

## 🎯 Next Steps

Now that authentication is complete, you can:

1. **Create Learning Modules**
   - Build module CRUD operations
   - Add quiz functionality
   - Track module completion

2. **Implement Gamification**
   - Award points for completing modules
   - Create badge system
   - Build leaderboard

3. **Add Social Features**
   - User profiles
   - Mentorship matching
   - Discussion forums

4. **Enhance Dashboard**
   - Progress charts
   - Recent activity
   - Upcoming modules

---

## 📞 Support

For issues or questions:

- Check this documentation
- Review code comments
- Test API endpoints with PowerShell
- Check browser console for errors
- Verify backend logs in terminal

---

### Authentication System Status: ✅ COMPLETE

Built with ❤️ for the hospitality industry
