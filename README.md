# KodeIn 🚀

KodeIn is a premium, interactive Python learning platform designed with gamification at its core. It provides a structured curriculum for mastering Python through hands-on practice, real-time code execution, 1v1 competitive coding battles, and a comprehensive progression system.

## ✨ Features

- **Interactive Curriculum (Course Map)**: A beautifully designed learning path that guides users through Python concepts unit by unit.
- **In-Browser Code Execution**: Write and run Python code directly in the browser. Powered by **Pyodide** for instant local evaluation and the **Piston API** for secure server-side validation.
- **Gamification System**: Earn XP, maintain daily streaks, and level up as you complete challenges.
- **1v1 Battle Arena**: Challenge other users in real-time coding battles using Server-Sent Events (SSE). First to solve the algorithm wins!
- **Global Leaderboard**: Compete with students worldwide for the top spot based on your XP.
- **Modern UI/UX**: Built with a "Clean Premium" aesthetic, featuring glassmorphism, dynamic theme syncing (Light/Dark mode), and micro-animations.
- **Mobile Responsive**: Seamless dashboard navigation on mobile (Note: writing code in the practice/battle modules requires a desktop environment for optimal UX).

## 🛠 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **ORM**: [Prisma](https://www.prisma.io/) (`@prisma/adapter-pg`)
- **Authentication**: [NextAuth.js v5](https://authjs.dev/) (Auth.js Beta) with JWT Session Strategy
- **Code Execution**: [Pyodide](https://pyodide.org/) (Client) & [Piston](https://github.com/engineer-man/piston) (Server)
- **Editor**: [Monaco Editor](https://microsoft.github.io/monaco-editor/)

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running.

### 1. Clone the repository
```bash
git clone https://github.com/farzah14/KodeIn.git
cd KodeIn
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set up Environment Variables
Create a `.env` file in the root directory and configure the variables (see [.env.example](file:///d:/KodeIn/.env.example) for details):

```env
# Database Configuration (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/kodein?schema=public"

# NextAuth Configuration
AUTH_URL="http://localhost:3000"
AUTH_SECRET="your-32-byte-hex-auth-secret"

# OAuth Providers (Optional pairs - set both, or neither)
AUTH_GITHUB_ID="your-github-id"
AUTH_GITHUB_SECRET="your-github-secret"
AUTH_GOOGLE_ID="your-google-id"
AUTH_GOOGLE_SECRET="your-google-secret"

# Resend Email (Required)
RESEND_API_KEY="re_yourApiKey"
EMAIL_FROM="noreply@yourdomain.com"

# Code Execution Backend (Required)
PISTON_BASE_URL="http://localhost:2000"
PISTON_AUTH_TOKEN="your-piston-token"
```

### 4. Setup Prisma Database
Generate the Prisma client and push the schema to your Supabase instance:
```bash
npx prisma generate
npx prisma db push
```

### 5. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📂 Project Structure

- `/src/app` - Next.js App Router (Pages & API Routes)
- `/src/components` - Reusable React components (UI, Topbar, Course Map)
- `/src/lib` - Core logic, configuration, and state stores (Prisma, ProgressStore, i18n, Battle challenges)
- `/prisma` - Database schema definition (`schema.prisma`)

## 🌐 Localization
KodeIn currently supports English (`en`) and Indonesian (`id`) out of the box. Locales are managed safely via context to prevent hydration mismatches.

## 🛡 License
This project is proprietary and built specifically for the KodeIn educational platform.
