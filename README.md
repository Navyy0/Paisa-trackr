


<p align="center">
  <img src="./logo.png" alt="PaisaTrackr Logo" width="200" />
</p>

<h1 align="center">PaisaTrackr 💰</h1>

<p align="center">
  Your personal AI-powered expense manager.
</p>

<p align="center">
  <a href="https://nextjs.org/" target="_blank"><img src="https://img.shields.io/badge/Next.js-15-blue" alt="Next.js" /></a>
  <a href="https://clerk.com/" target="_blank"><img src="https://img.shields.io/badge/Auth-Clerk-orange" alt="Clerk Auth" /></a>
  <a href="https://supabase.com/" target="_blank"><img src="https://img.shields.io/badge/DB-Supabase-green" alt="Supabase" /></a>
  <a href="https://inngest.com/" target="_blank"><img src="https://img.shields.io/badge/Jobs-Inngest-purple" alt="Inngest" /></a>
  <a href="https://tailwindcss.com/" target="_blank"><img src="https://img.shields.io/badge/UI-TailwindCSS-0ea5e9" alt="TailwindCSS" /></a>
  <a href="https://gemini.google.com/" target="_blank"><img src="https://img.shields.io/badge/AI-Gemini-lightblue" alt="Gemini AI" /></a>
</p>

---

## 🚀 Overview

PaisaTrackr is a smart, modern personal finance manager. With a sleek dashboard, transaction insights, budget tracking, and AI chatbot support, it's the ultimate tool for managing money intelligently.

---

## ✨ Features

- 🔐 Clerk-based authentication  
- 💸 Add/edit/delete income and expenses  
- 🧾 AI receipt scanning  
- 📊 Beautiful Recharts visualizations  
- 📅 Monthly summaries & category-wise breakdown  
- 💼 Multiple account support with default toggle  
- 💡 Smart budget insights  
- 🤖 Gemini-powered finance chatbot  
- 📬 Automated monthly email reports via Inngest  

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15 (App Router)](https://nextjs.org/)
- **Database**: [Supabase (PostgreSQL)](https://supabase.com/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Auth**: [Clerk](https://clerk.com/)
- **Scheduler**: [Inngest](https://www.inngest.com/)
- **AI**: [Gemini API](https://gemini.google.com/)
- **UI**: TailwindCSS, Recharts

---

## 📦 Getting Started

```bash
git clone https://github.com/yourusername/paisatrackr.git
cd paisatrackr
npm install
````

### 🧪 Environment Setup

Create a `.env.local` file with:

```env
DATABASE_URL=your_supabase_db_url
CLERK_SECRET_KEY=your_clerk_secret
CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
NEXT_PUBLIC_CLERK_FRONTEND_API=your_clerk_frontend_api
GEMINI_API_KEY=your_google_gemini_api_key
```

### 🔧 Initialize Database

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### ▶️ Start the App

```bash
npm run dev
```

---

## 📁 Project Structure

```
app/
├── (main)/dashboard           # Dashboard page
├── (main)/transaction         # Add/Edit transactions
├── (main)/account             # Account details
├── api/                       # API routes
components/                    # Reusable UI components
lib/                           # Prisma, Clerk, utils
actions/                       # Server-side business logic
public/                        # Static assets
```

---

## 📬 Monthly Reports (Inngest)

PaisaTrackr sends monthly account reports automatically.

* **Cron Schedule**: `0 0 1 * *` (1st of every month)
* **Trigger**: Manually from Inngest dashboard or wait for cron
* **Retries**: 4 (default)
* **Queue Scope**: Per-account (ensures 1 report per user)

---

## 🤖 AI Chatbot Commands

The chatbot supports:

* ➕ Add transaction
* 📄 Scan receipt
* 💰 Show account balance
* 📜 List last 5 transactions
* 📈 Get monthly summary
* 📊 Show category breakdown
* 💡 Smart saving tip
* 🎯 Budget status report

---

## 📌 Design Notes

* 🖤 Theme: Dark Blue & Yellow
* 💻 Fully responsive
* 🧠 Personalized financial advice
* 🔁 Simple logic-based actions folder architecture


