# ✦ AURORA — AI Design Partner

> "Most AI tools generate visuals. AURORA generates design thinking first."

## 🌌 Vision

AURORA is an AI-powered design partner that helps you **think like a designer** before generating visuals. Instead of jumping straight to image generation, AURORA first analyzes your design goal, creates a structured design brief with strategic reasoning, and then generates a visual concept — just like a real creative director would.

## 🧠 The Problem

Current AI design tools skip the most important part of design: **thinking**. They generate pretty images without understanding context, audience, or strategy. This leads to designs that look good but don't communicate effectively.

## 💡 How It Works

1. **Define Your Goal** — Describe what you're designing and who it's for
2. **AI Design Brief** — AURORA analyzes your goal and creates a structured brief including:
   - Target audience analysis
   - Tone & brand personality
   - Color palette with hex codes and usage reasoning
   - Typography recommendations
   - Layout structure
   - UX reasoning explaining *why* these choices work
3. **Visual Concept** — A generated visual concept with wireframe mockup using your palette

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) + Tailwind CSS v4 |
| Backend | Node.js + Express |
| AI | Groq API (Llama 3.1 — free tier) |
| Styling | Glass morphism, dark theme, custom animations |

## 🚀 Setup

### Prerequisites
- Node.js 18+
- Groq API key (free at https://console.groq.com)

### Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/aurora.git
cd aurora

# Setup backend
cd server
npm install
cp .env.example .env
# Edit .env and add your GROQ_API_KEY

# Setup frontend
cd ../client
npm install