# 🚀 SETUP REQUIRED - Follow These Steps!

## ⚠️ Current Status
Your app is running but **needs database setup** to work properly.

---

## 📋 Quick Setup (5 Minutes)

### Step 1: Set Up Database (Choose One Option)

#### Option A: Supabase (Recommended - Easiest)

1. **Go to** https://supabase.com
2. **Sign up** for free account
3. **Create new project**
   - Choose a name
   - Set a database password (save it!)
   - Select region closest to you
4. **Get connection string**
   - Go to Project Settings → Database
   - Find "Connection string" → "URI"
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your actual password
5. **Update `.env` file**
   - Open `.env` in your project
   - Replace the `DATABASE_URL` line with your Supabase connection string

Example:
```env
DATABASE_URL="postgresql://postgres.xxxxx:YourPassword@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
```

#### Option B: Local PostgreSQL

1. **Install PostgreSQL** on your machine
2. **Create database**:
   ```bash
   createdb ai_counsellor
   ```
3. **Update `.env`**:
   ```env
   DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/ai_counsellor"
   ```

---

### Step 2: Get Gemini API Key

1. **Visit** https://makersuite.google.com/app/apikey
2. **Sign in** with Google account
3. **Click** "Create API Key"
4. **Copy** the API key
5. **Update `.env`**:
   ```env
   GEMINI_API_KEY="your-actual-api-key-here"
   ```

---

### Step 3: Generate NextAuth Secret

**Windows PowerShell**:
```powershell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**Or use any random string** (at least 32 characters)

**Update `.env`**:
```env
NEXTAUTH_SECRET="your-generated-secret-here"
```

---

### Step 4: Initialize Database

After updating `.env`, run these commands:

```bash
# Stop the dev server (Ctrl+C in the terminal)

# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# Seed universities data
npx prisma db seed

# Restart dev server
npm run dev
```

---

### Step 5: Test Your App

1. **Visit** http://localhost:3000
2. **Click** "Get Started"
3. **Create account** on signup page
4. **Login** and see dashboard

---

## ✅ Your `.env` Should Look Like This:

```env
# Database - REPLACE WITH YOUR ACTUAL CONNECTION STRING
DATABASE_URL="postgresql://postgres.xxxxx:YourPassword@aws-0-us-west-1.pooler.supabase.com:6543/postgres"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-32-character-random-secret-here"

# Google OAuth (Optional - can leave empty)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Gemini API - REPLACE WITH YOUR ACTUAL API KEY
GEMINI_API_KEY="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
```

---

## 🆘 Troubleshooting

**Still seeing Prisma errors?**
- Make sure DATABASE_URL is correct
- Try: `npx prisma generate` again

**Can't connect to database?**
- Check your password is correct
- Verify database is running
- For Supabase: check project is active

**Gemini API not working?**
- Verify API key is valid
- Check you have quota remaining

---

## 📚 Need More Help?

- See `TROUBLESHOOTING.md` for detailed solutions
- Check `QUICKSTART.md` for alternative setup methods
- Review `README.md` for full documentation

---

## 🎯 After Setup

Once database is configured, you can:
- ✅ Create user accounts
- ✅ Login/logout
- ✅ View dashboard
- 🚧 Complete onboarding (to be built)
- 🚧 Chat with AI counsellor (to be built)
- 🚧 Browse universities (to be built)

**You're almost there! Just need to set up the database.** 🚀
