# ✦ Aurora — AI Design Partner

> Most AI tools generate visuals. Aurora generates design thinking first.

## What It Does

Aurora is an AI-powered design partner that analyzes your design goal, creates a strategic design brief, and generates a visual concept — the way a creative director would approach a project.

### Features
- **AI Design Analysis** — Structured briefs with audience, tone, colors, typography, layout
- **Live Visual Mockup** — Dynamic wireframe using your AI-generated color palette
- **Copy Hex Codes** — Click any color to copy
- **Save Projects** — Save and revisit past design briefs
- **Export to PDF** — Download briefs as professional documents
- **Project History** — Sidebar with all saved projects

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React + Vite + Tailwind v3 |
| State | Zustand |
| Backend | Node.js + Express |
| AI | Groq API (Llama 3.1 — free) |
| Export | html2canvas + jsPDF |

## Setup

### Prerequisites
- Node.js 18+
- Free API key from [console.groq.com](https://console.groq.com)

### Install & Run

```bash
git clone https://github.com/YOUR_USERNAME/aurora.git
cd aurora

# Backend
cd server
npm install
cp .env.example .env  # Add your GROQ_API_KEY
node server.js

# Frontend (new terminal)
cd client
npm install
npx vite