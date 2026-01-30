# Troubleshooting Guide

## ✅ Fixed: Module Resolution Error

**Problem**: `Module not found: Can't resolve '@/lib/auth'`

**Solution**: Moved library files from `lib/` to `src/lib/`

All library files are now in the correct location:
- ✅ `src/lib/prisma.ts`
- ✅ `src/lib/gemini.ts`
- ✅ `src/lib/auth.ts`
- ✅ `src/lib/recommendations.ts`

---

## Common Issues & Solutions

### 1. Database Connection Error

**Error**: `Can't reach database server`

**Solutions**:
- Check your `DATABASE_URL` in `.env`
- Verify database is running
- For Supabase: Make sure connection string includes password
- Run: `npx prisma generate`

### 2. Prisma Client Not Generated

**Error**: `@prisma/client` did not initialize yet

**Solution**:
```bash
npx prisma generate
```

### 3. NextAuth Session Error

**Error**: `[next-auth][error][CLIENT_FETCH_ERROR]`

**Solutions**:
- Ensure `NEXTAUTH_SECRET` is set in `.env`
- Verify `NEXTAUTH_URL` matches your domain
- Check database connection

### 4. Gemini API Error

**Error**: `API key not valid`

**Solutions**:
- Get API key from https://makersuite.google.com/app/apikey
- Add to `.env`: `GEMINI_API_KEY="your-key"`
- Restart dev server

### 5. Port Already in Use

**Error**: `Port 3000 is already in use`

**Solution**:
```bash
# Kill the process or use different port
npm run dev -- -p 3001
```

---

## Quick Fixes

### Restart Dev Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Clear Next.js Cache
```bash
rm -rf .next
npm run dev
```

### Reinstall Dependencies
```bash
rm -rf node_modules
npm install
```

### Reset Database
```bash
npx prisma migrate reset
npx prisma db seed
```

---

## Verification Checklist

- [ ] Dev server running without errors
- [ ] Landing page loads at http://localhost:3000
- [ ] Can navigate to /signup
- [ ] Can navigate to /login
- [ ] No console errors in browser
- [ ] Database connection working

---

## Getting Help

1. Check error message carefully
2. Look in browser console (F12)
3. Check terminal output
4. Verify `.env` file has all required values
5. Ensure database is accessible

---

## Current Status

✅ **Module resolution fixed** - All files in correct locations
✅ **TypeScript configured** - Path aliases working
✅ **Project structure correct** - Following Next.js conventions

**Next**: Set up your database and run the app!
