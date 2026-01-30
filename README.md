# AI Counsellor - Study Abroad Platform

A guided, stage-based platform designed to help students make confident and informed study-abroad decisions using AI-powered counseling.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Gemini API key

### Installation

1. **Clone and install dependencies:**
```bash
cd ai-counsellor
npm install
```

2. **Set up environment variables:**
Edit `.env` file with your credentials:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/ai_counsellor"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-here"
GEMINI_API_KEY="your-gemini-api-key"
```

3. **Set up database:**
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database with universities
npx prisma db seed
```

4. **Run development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
ai-counsellor/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── (auth)/            # Auth pages (login, signup)
│   │   ├── (dashboard)/       # Protected dashboard pages
│   │   ├── api/               # API routes
│   │   └── page.tsx           # Landing page
│   ├── components/            # React components
│   └── lib/                   # Utility libraries
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seeder
├── data/
│   └── universities.json      # University dataset
└── lib/
    ├── prisma.ts              # Prisma client
    ├── gemini.ts              # Gemini AI integration
    ├── auth.ts                # Authentication utilities
    └── recommendations.ts     # Recommendation logic
```

## 🎯 Core Features

### 1. Landing Page ✅
- Modern, gradient design
- Clear value proposition
- Feature highlights
- How it works section

### 2. Authentication
- Email/password signup and login
- Google OAuth (optional)
- Session management with NextAuth.js

### 3. Onboarding
- Multi-step form collecting:
  - Academic background
  - Study goals
  - Budget constraints
  - Exam readiness
- Profile completion gate

### 4. Dashboard
- Profile summary
- Profile strength indicators
- Current stage tracker
- AI-generated to-do list

### 5. AI Counsellor
- Context-aware conversations
- Personalized recommendations
- Action execution (shortlist, lock, create tasks)
- Powered by Google Gemini

### 6. University Discovery
- Filtered recommendations
- Dream/Target/Safe categorization
- Fit analysis and risk assessment
- Shortlisting system

### 7. University Locking
- Commitment mechanism
- Unlocks application guidance
- University-specific strategy

### 8. Application Guidance
- Required documents checklist
- Timeline visualization
- AI-generated tasks
- Progress tracking

## 🗄️ Database Schema

### Key Models:
- **User** - Authentication and user data
- **Profile** - Student profile and onboarding data
- **University** - University information
- **ShortlistedUniversity** - User's shortlisted universities
- **LockedUniversity** - Committed universities
- **Task** - AI-generated to-do items
- **Conversation** - AI counsellor chat history

## 🤖 AI Integration

The AI Counsellor uses Google Gemini API with:
- Context-aware prompts including user profile
- Action parsing for executable commands
- Personalized recommendations
- Task generation

## 📊 University Dataset

Includes 20 curated universities across:
- USA (MIT, Stanford, Berkeley, CMU, etc.)
- UK (Oxford, Edinburgh, Imperial, Manchester)
- Canada (Toronto, UBC, Waterloo, McGill)
- Australia (Melbourne, Sydney)
- Germany (TUM, RWTH Aachen)
- Switzerland (ETH Zurich)
- Singapore (NUS)

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Start production
npm start

# Database commands
npx prisma studio          # Open Prisma Studio
npx prisma migrate dev     # Run migrations
npx prisma db seed         # Seed database
npx prisma generate        # Generate Prisma client
```

### Adding Seed Script to package.json

Add this to your `package.json`:
```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

## 🎨 Design Philosophy

- **Modern & Premium**: Gradient backgrounds, smooth animations, clean UI
- **User-Centric**: Clear navigation, intuitive flows
- **Mobile-Responsive**: Works on all devices
- **Accessible**: Semantic HTML, proper contrast

## 📝 Next Steps

To complete the full application, implement:

1. **Signup/Login Pages** - User registration and authentication UI
2. **Onboarding Wizard** - Multi-step form for profile creation
3. **Dashboard Components** - Profile cards, stage indicators, task lists
4. **AI Counsellor Chat** - Real-time chat interface with Gemini
5. **University Pages** - Discovery, detail views, shortlisting
6. **Application Guidance** - Document checklists, timelines
7. **Profile Management** - Edit profile, recalculate recommendations

## 🚢 Deployment

### Recommended Stack:
- **Frontend**: Vercel
- **Database**: Supabase or Railway (PostgreSQL)
- **Environment Variables**: Set in deployment platform

### Pre-deployment Checklist:
- [ ] Set production DATABASE_URL
- [ ] Generate secure NEXTAUTH_SECRET
- [ ] Add Gemini API key
- [ ] Run database migrations
- [ ] Seed university data
- [ ] Test authentication flow
- [ ] Verify AI counsellor works

## 📄 License

Built for hackathon purposes. 

## 🤝 Contributing

This is a hackathon project. Focus on:
- Working end-to-end flows
- Clear user experience
- AI-powered guidance
- Decision-making support

---

**Built with ❤️ for students pursuing their study-abroad dreams**
