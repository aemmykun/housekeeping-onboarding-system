# 🔧 MongoDB Connection Fix Guide

## Current Issue

Your MongoDB connection is failing with **error code 8000** (authentication failed).

```text
Error Code: 8000
Message: bad auth : authentication failed
```

---

## Step-by-Step Fix

### 1. Log into MongoDB Atlas

1. Go to <https://cloud.mongodb.com>
2. Sign in with your account
3. Select your project (if you have multiple)

### 2. Verify Database User

1. Click **"Database Access"** in the left sidebar
2. Look for user: `aemmykun`
3. Check if the user exists and is active

**If user doesn't exist or is deleted:**

- Click **"Add New Database User"**
- Username: `aemmykun`
- Password: Create a new secure password
- Database User Privileges: **"Read and write to any database"**
- Click **"Add User"**

**If user exists:**

- Click **"Edit"** next to the user
- Click **"Edit Password"**
- Set a new password (remember it!)
- Click **"Update User"**

### 3. Check Network Access

1. Click **"Network Access"** in the left sidebar
2. Check if your current IP is whitelisted

**For Development (Recommended):**

- Click **"Add IP Address"**
- Click **"Allow Access from Anywhere"**
- This adds `0.0.0.0/0` to the whitelist
- Click **"Confirm"**

**For Production:**

- Add only your specific IP addresses

### 4. Get Correct Connection String

1. Click **"Database"** in the left sidebar
2. Click **"Connect"** on your cluster (`babigonz`)
3. Choose **"Connect your application"**
4. Copy the connection string

It should look like:

```text
mongodb+srv://aemmykun:<password>@babigonz.dsf9byy.mongodb.net/?retryWrites=true&w=majority&appName=Babigonz
```

### 5. Update `.env` File

1. Open `.env` in the project root
2. Update the `MONGODB_URI` line:

```env
MONGODB_URI="mongodb+srv://aemmykun:YOUR_NEW_PASSWORD@babigonz.dsf9byy.mongodb.net/housekeeping_onboarding?retryWrites=true&w=majority&appName=Babigonz"
```

**Important:**

- Replace `YOUR_NEW_PASSWORD` with your actual password
- If password contains special characters, URL-encode them:
  - `@` → `%40`
  - `$` → `%24`
  - `#` → `%23`
  - `%` → `%25`
  - `&` → `%26`

**Example:**
If password is `Pass@123$`, use:

```text
mongodb+srv://aemmykun:Pass%40123%24@babigonz...
```

### 6. Test the Connection

Run the test script:

```powershell
cd backend
node test-mongo.js
```

**Expected output:**

```text
✅ MongoDB Connected: babigonz-shard-00-02.dsf9byy.mongodb.net
📊 Database: housekeeping_onboarding
```

---

## Quick Test Commands

### Test from Backend Directory

```powershell
cd backend
node test-mongo.js
```

### Test from Root Directory

```powershell
node -e "require('dotenv').config(); const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI).then(() => { console.log('✅ Connected!'); process.exit(0); }).catch(err => { console.error('❌ Failed:', err.message); process.exit(1); });"
```

---

## Common Issues

### Issue: "IP not whitelisted"

**Solution:** Add `0.0.0.0/0` to Network Access in MongoDB Atlas

### Issue: "User not found"

**Solution:** Create the database user in Database Access

### Issue: "Invalid connection string"

**Solution:** Ensure password is URL-encoded and database name is included

### Issue: "Network timeout"

**Solution:** Check your internet connection and MongoDB Atlas status

---

## Verification Checklist

- [ ] MongoDB Atlas account accessible
- [ ] Database user `aemmykun` exists
- [ ] User has "Read and write" permissions
- [ ] Network access allows your IP (or 0.0.0.0/0)
- [ ] Password is correct and URL-encoded
- [ ] `.env` file updated with correct credentials
- [ ] Test connection successful

---

## After Fixing

Once MongoDB is connected, you can:

1. **Seed the database:**

   ```powershell
   cd backend
   npm run seed
   ```

2. **Start the application:**

   ```powershell
   # From project root
   npm run dev
   ```

3. **Test registration:**
   - Frontend: <http://localhost:3000/register>
   - Backend: <http://localhost:5000/api/auth/register>

---

**Need Help?** Check the [AUTHENTICATION.md](file:///c:/Users/Housekeeping/Downloads/housekeeping-onboarding-system/docs/AUTHENTICATION.md) documentation for more details.
