# 🚀 Local Development Guide (No MongoDB Required)

## Quick Start

You can now run the application **without MongoDB** for local development and testing!

### Start the Application

```powershell
npm run dev:local
```

This will start:

- ✅ Backend API on <http://localhost:5000> (with mock data)
- ✅ Frontend on <http://localhost:3000>

---

## What's Different in Local Mode?

### Mock Database

- Uses in-memory storage (no MongoDB needed)
- Pre-loaded with sample data
- Data resets when server restarts

### Sample Data Included

**Demo User:**

- Email: `demo@example.com`
- Password: `password123`
- Role: Trainee
- Points: 250
- Level: 2

**Sample Modules:**

1. Introduction to Housekeeping (Beginner, 100 points)
2. Room Cleaning Standards (Intermediate, 150 points)
3. Safety Protocols (Beginner, 100 points)

---

## Available Commands

### Local Development (No MongoDB)

```powershell
# Start both frontend and backend with mock data
npm run dev:local

# Start only backend with mock data
npm run dev:backend:local
```

### Production Mode (Requires MongoDB)

```powershell
# Start with real MongoDB connection
npm run dev
```

---

## Testing the Application

### 1. Start the Server

```powershell
npm run dev:local
```

### 2. Open Your Browser

Navigate to: <http://localhost:3000>

### 3. Try These Features

**Login with Demo Account:**

- Go to <http://localhost:3000/login>
- Email: `demo@example.com`
- Password: `password123`

**Register New User:**

- Go to <http://localhost:3000/register>
- Fill in the form
- New users are stored in memory

**Browse Modules:**

- Go to <http://localhost:3000/modules>
- View the 3 sample modules

**Check API Health:**

- Go to <http://localhost:5000/api/health>
- Should show "LOCAL_DEVELOPMENT" mode

---

## Features Available in Local Mode

✅ **Working:**

- User registration (in-memory)
- User login
- JWT authentication
- Protected routes
- Dashboard
- Module browsing
- All frontend features

⚠️ **Limitations:**

- Data doesn't persist (resets on server restart)
- No real database queries
- Limited sample data

---

## When to Use Each Mode

### Use `npm run dev:local` when

- 🎨 Developing frontend features
- 🧪 Testing UI components
- 🚀 Quick prototyping
- 📱 Don't need data persistence

### Use `npm run dev` when

- 💾 Need data persistence
- 🌐 Testing with real database
- 🚀 Preparing for production
- 👥 Multiple users/sessions

---

## Switching to Production Mode

When you're ready to use MongoDB:

1. Fix MongoDB credentials (see [MONGODB_FIX_GUIDE.md](file:///c:/Users/Housekeeping/Downloads/housekeeping-onboarding-system/MONGODB_FIX_GUIDE.md))
2. Run `npm run dev` instead of `npm run dev:local`
3. Seed the database: `cd backend && npm run seed`

---

## Troubleshooting

### Port Already in Use

```powershell
# Kill process on port 5000
Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess -Force

# Kill process on port 3000
Stop-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess -Force
```

### Server Won't Start

- Check if Node.js is installed: `node --version`
- Reinstall dependencies: `npm install`
- Check for errors in terminal

---

## Next Steps

1. **Start developing!** Run `npm run dev:local`
2. **Test features** with the demo account
3. **Build new features** without database setup
4. **Switch to MongoDB** when ready for production

---

**Happy coding!** 🎉
