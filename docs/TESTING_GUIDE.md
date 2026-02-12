# 🚀 Quick Start Guide - Testing Your Application

## ✅ System Status

Your application is **RUNNING** on:

- **Frontend**: <http://localhost:3000>
- **Backend API**: <http://localhost:5000/api>

---

## 🔧 Current Issue

The MongoDB connection string has been fixed, but there may still be a connection issue. Here's how to verify and fix it:

### Step 1: Get Your Correct MongoDB Atlas Connection String

1. Go to **MongoDB Atlas** (<https://cloud.mongodb.com>)
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. **Driver**: Node.js
5. **Version**: 4.1 or later
6. Copy the connection string - it should look like:

   ```
   mongodb+srv://babigonz:<password>@cluster0.XXXXX.mongodb.net/?retryWrites=true&w=majority
   ```

7. Replace `<password>` with your actual password: `Amika$1297`
8. URL-encode special characters: `$` becomes `%24`, so: `Amika%241297`
9. Add the database name: `/housekeeping_onboarding` before the `?`

**Final format should be:**

```
mongodb+srv://babigonz:Amika%241297@cluster0.XXXXX.mongodb.net/housekeeping_onboarding?retryWrites=true&w=majority
```

**Note**: The `XXXXX` part is a unique identifier from MongoDB Atlas. Make sure you copy it exactly from your Atlas dashboard!

### Step 2: Update Your `.env` File

Open `.env` in the root folder and update line 2:

```env
MONGODB_URI=mongodb+srv://babigonz:Amika%241297@cluster0.XXXXX.mongodb.net/housekeeping_onboarding?retryWrites=true&w=majority
```

Replace `XXXXX` with your actual cluster identifier.

### Step 3: Restart the Server

The server should auto-restart with nodemon, but if not:

1. Stop the current server (Ctrl+C in the terminal running `npm run dev`)
2. Run `npm run dev` again

---

## 🧪 Testing in Your Browser

### Test 1: Check if Frontend is Running

1. Open your browser (Chrome, Edge, Firefox, etc.)
2. Go to: **<http://localhost:3000>**
3. You should see the homepage with:
   - "Housekeeping Onboarding System" title
   - "Get Started" button
   - Feature cards

**Screenshot what you see!**

---

### Test 2: Register a New Account

1. Click **"Get Started"** or navigate to **<http://localhost:3000/register>**
2. Fill in the registration form:

   ```
   First Name: Test
   Last Name: User
   Email: test@hotel.com
   Password: test123456
   Confirm Password: test123456
   Role: Trainee
   Department: Housekeeping
   Phone: (optional)
   ```

3. Click **"Create Account"**

**What should happen:**

- ✅ **Success**: You're redirected to `/dashboard` and see your profile
- ❌ **Error**: You see an error message

**If you see an error:**

- Take a screenshot
- Check the browser console (F12 → Console tab)
- Look for error messages

---

### Test 3: Login

If registration worked, try logging out and back in:

1. Click **"Logout"** button on the dashboard
2. Navigate to **<http://localhost:3000/login>**
3. Enter:

   ```
   Email: test@hotel.com
   Password: test123456
   ```

4. Click **"Login"**

**What should happen:**

- ✅ **Success**: Redirected to dashboard
- ❌ **Error**: Error message appears

---

### Test 4: View Modules

1. From the dashboard, click **"View All Modules"** or **"Continue Learning"**
2. OR navigate directly to: **<http://localhost:3000/modules>**

**What you should see:**

- Module list page with filters
- Progress bar (if logged in)
- Message: "No modules found" (because we haven't seeded the database yet)

**This is normal!** We'll add modules next.

---

### Test 5: Create a Module (Admin Only)

1. First, register an **admin** account:
   - Go to <http://localhost:3000/register>
   - Use role: **admin**
   - Email: <admin@hotel.com>
   - Password: admin123456

2. Navigate to: **<http://localhost:3000/modules/new>**

3. Fill in the module form:

   ```
   Title: Test Module
   Description: This is a test module
   Category: Room Cleaning
   Difficulty: Beginner
   Estimated Time: 30
   Points: 10
   Content: <h2>Test Content</h2><p>This is test content.</p>
   ```

4. Add a quiz question:
   - Click "Add Question"
   - Question: "What is 2+2?"
   - Options: "3", "4", "5", "6"
   - Correct Answer: "4"

5. Click **"Create Module"**

**What should happen:**

- ✅ Module created successfully
- Redirected to `/modules`
- You see your new module in the list

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to server" or "Network Error"

**Check:**

1. Is the backend running? Look for terminal with `npm run dev`
2. Test API health: <http://localhost:5000/api/health>
   - Should show: `{"status":"OK","message":"Housekeeping Onboarding API is running"}`

**Fix:**

- Restart the server: `npm run dev` in the project root

---

### Issue: "MongoDB connection error"

**Check:**

1. Open the terminal running the backend
2. Look for error messages about MongoDB
3. Common errors:
   - "MongoServerError: bad auth" → Wrong password
   - "getaddrinfo ENOTFOUND" → Wrong cluster address
   - "MongooseServerSelectionError" → Can't reach MongoDB

**Fix:**

1. Verify your MongoDB Atlas connection string
2. Make sure your IP address is whitelisted in MongoDB Atlas:
   - Go to Atlas → Network Access
   - Add your IP or use `0.0.0.0/0` (allow all) for testing
3. Update `.env` with correct connection string
4. Restart server

---

### Issue: Registration returns 500 error

**Check:**

1. Backend terminal for error messages
2. Browser console (F12) for details

**Common causes:**

- MongoDB not connected
- Missing required fields
- Duplicate email

**Fix:**

- Ensure MongoDB is connected
- Use a unique email for each registration
- Check backend logs for specific error

---

### Issue: "Module not found" or empty module list

**This is expected!** The database is empty.

**Fix:**

1. Create modules manually using the Module Editor (admin account required)
2. OR fix the MongoDB connection and run the seeder:

   ```bash
   npm run seed
   ```

---

## 📸 What to Screenshot

Please take screenshots of:

1. **Homepage** (<http://localhost:3000>)
2. **Registration page** with form filled out
3. **Dashboard** after successful login
4. **Module list page** (<http://localhost:3000/modules>)
5. **Any error messages** you encounter

Share these screenshots so I can help debug any issues!

---

## ✅ Success Checklist

- [ ] Frontend loads at <http://localhost:3000>
- [ ] Backend health check works at <http://localhost:5000/api/health>
- [ ] Can register a new account
- [ ] Can login with registered account
- [ ] Dashboard shows user information
- [ ] Can navigate to modules page
- [ ] Can create a module (as admin)
- [ ] Can view a module
- [ ] Can take a quiz
- [ ] Points and level update after completing quiz

---

## 🆘 Need Help?

If you encounter any issues:

1. **Check the backend terminal** for error messages
2. **Check browser console** (F12 → Console tab)
3. **Take screenshots** of errors
4. **Share the error messages** with me

I'll help you fix any issues!

---

## 🎯 Next Steps After Testing

Once everything works:

1. **Seed the database** with sample modules (if MongoDB connection is fixed)
2. **Customize modules** for your hotel's needs
3. **Add more features**:
   - Badges system
   - Leaderboards
   - Social features
   - AR/VR training

---

**Happy testing! 🚀**
