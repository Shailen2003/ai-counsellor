# AI Counsellor - Quick Start Guide

## 🎯 What You Have

A fully structured Next.js application with:
- ✅ Beautiful landing page
- ✅ Signup/Login authentication
- ✅ Database schema (Prisma)
- ✅ AI integration setup (Gemini)
- ✅ 20 university dataset
- ✅ Recommendation logic
- ✅ Dashboard and onboarding placeholders

## 🚀 Get Started in 5 Minutes

### 1. Set Up Database

**Option A: Use Supabase (Easiest - Recommended)**
1. Go to https://supabase.com
2. Create a free account
3. Create a new project
4. Go to Project Settings → Database
5. Copy the connection string
6. Update `.env`:
```env
DATABASE_URL="your-supabase-connection-string"
```

**Option B: Local PostgreSQL**
```bash
# Install PostgreSQL, then:
createdb ai_counsellor
```

### 2. Get Gemini API Key

1. Visit https://makersuite.google.com/app/apikey
2. Create an API key
3. Update `.env`:
```env
GEMINI_API_KEY="your-api-key-here"
```

### 3. Generate Secret

```bash
# On Windows PowerShell:
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Or use any random string generator
```

Update `.env`:
```env
NEXTAUTH_SECRET="your-generated-secret"
```

### 4. Initialize Database

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
```

### 5. Run the App

```bash
npm run dev
```

Visit http://localhost:3000

## ✅ Test the Flow

1. **Landing Page** → Click "Get Started"
2. **Signup** → Create account
3. **Onboarding** → (Placeholder - skip to dashboard)
4. **Dashboard** → See your profile

## 📁 Key Files

- `src/app/page.tsx` - Landing page
- `src/app/signup/page.tsx` - Signup
- `src/app/login/page.tsx` - Login
- `src/app/dashboard/page.tsx` - Dashboard
- `prisma/schema.prisma` - Database schema
- `lib/gemini.ts` - AI integration
- `data/universities.json` - University data

## 🔨 Build Next

Priority order:
1. Complete onboarding wizard
2. Build AI counsellor chat
3. Add university discovery
4. Implement locking mechanism
5. Create application guidance

## 🆘 Troubleshooting

**Database Error?**
- Check DATABASE_URL is correct
- Run `npx prisma generate`

**Auth Not Working?**
- Verify NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your domain

**Gemini Error?**
- Confirm GEMINI_API_KEY is valid
- Check you have API quota

## 📚 Resources

- Prisma Docs: https://www.prisma.io/docs
- NextAuth Docs: https://next-auth.js.org
- Gemini API: https://ai.google.dev/docs

---

**You're ready to build! 🚀**
