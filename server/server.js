const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');
const path = require('path');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS - allow your Render frontend URL and localhost
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:4173',
        process.env.FRONTEND_URL || '*'
    ],
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());

// Initialize Groq
let groq;
try {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    console.log('Groq client initialized');
} catch (err) {
    console.error('Failed to init Groq:', err.message);
}

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'Aurora API is running', time: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// ============================================
// ANALYZE DESIGN
// ============================================
app.post('/api/analyze-design', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || prompt.trim() === '') {
            return res.status(400).json({ error: 'Please provide a design goal.' });
        }

        if (!groq) {
            return res.status(500).json({ error: 'AI service not configured. Check GROQ_API_KEY.' });
        }

        const systemPrompt = `You are AURORA, a world-class design strategist and creative director.

Given a design goal, create a comprehensive design brief.

RULES:
- Return ONLY valid JSON, nothing else
- No markdown, no backticks, no explanation
- Just the raw JSON object

Required JSON structure:
{
  "projectTitle": "Creative project name",
  "summary": "One sentence design direction summary",
  "targetAudience": {
    "primary": "Main audience description",
    "ageRange": "Age range like 18-35",
    "psychographics": "Values, interests, behaviors"
  },
  "toneAndPersonality": {
    "primary": "Main tone word",
    "secondary": "Secondary tone word",
    "brandVoice": "One sentence brand voice description"
  },
  "colorPalette": [
    {"name": "Primary", "hex": "#hexcode", "usage": "Where to use"},
    {"name": "Secondary", "hex": "#hexcode", "usage": "Where to use"},
    {"name": "Accent", "hex": "#hexcode", "usage": "Where to use"},
    {"name": "Background", "hex": "#hexcode", "usage": "Where to use"},
    {"name": "Text", "hex": "#hexcode", "usage": "Where to use"}
  ],
  "typography": {
    "headingFont": "Font name",
    "bodyFont": "Font name",
    "style": "Typography description"
  },
  "layoutStructure": {
    "sections": ["Hero", "Features", "About", "Testimonials", "CTA"],
    "heroStyle": "Hero section approach",
    "ctaStrategy": "CTA approach description"
  },
  "uxReasoning": "2-3 sentences explaining why these choices work",
  "moodKeywords": ["word1", "word2", "word3", "word4", "word5"],
  "designTokens": {
    "borderRadius": "8px",
    "spacing": "16px",
    "shadowStyle": "subtle or dramatic",
    "animationStyle": "smooth or snappy or none"
  },
  "imagePrompt": "A detailed prompt starting with: A professional UI design mockup showing..."
}`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Design goal: ${prompt}` }
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0.6,
            max_tokens: 2500,
            response_format: { type: "json_object" }
        });

        const raw = chatCompletion.choices[0]?.message?.content;
        console.log('AI raw response length:', raw?.length);

        let designBrief;
        try {
            let cleaned = raw.trim();
            cleaned = cleaned.replace(/```json\s*/gi, '').replace(/```\s*/gi, '');
            const first = cleaned.indexOf('{');
            const last = cleaned.lastIndexOf('}');
            if (first !== -1 && last !== -1 && last > first) {
                cleaned = cleaned.substring(first, last + 1);
            }
            designBrief = JSON.parse(cleaned);
        } catch (parseErr) {
            console.error('JSON parse failed:', parseErr.message);
            console.error('Raw:', raw?.substring(0, 200));
            // Fallback
            designBrief = {
                projectTitle: "Design Brief",
                summary: "Generated brief (AI returned non-standard format, showing defaults)",
                targetAudience: { primary: "General audience", ageRange: "18-45", psychographics: "Design-conscious users" },
                toneAndPersonality: { primary: "Modern", secondary: "Clean", brandVoice: "Professional and clear" },
                colorPalette: [
                    { name: "Primary", hex: "#3b82f6", usage: "Buttons, links, key actions" },
                    { name: "Secondary", hex: "#1e293b", usage: "Cards, secondary surfaces" },
                    { name: "Accent", hex: "#f59e0b", usage: "Highlights, notifications" },
                    { name: "Background", hex: "#0f172a", usage: "Page background" },
                    { name: "Text", hex: "#f1f5f9", usage: "Body and heading text" }
                ],
                typography: { headingFont: "Inter", bodyFont: "Inter", style: "Clean modern sans-serif" },
                layoutStructure: { sections: ["Hero", "Features", "About", "Testimonials", "Footer"], heroStyle: "Centered with prominent CTA", ctaStrategy: "Bold contrasting buttons" },
                uxReasoning: "Clean defaults applied. Try being more specific in your prompt for better results.",
                moodKeywords: ["modern", "clean", "professional", "minimal", "sharp"],
                designTokens: { borderRadius: "8px", spacing: "16px", shadowStyle: "subtle", animationStyle: "smooth" },
                imagePrompt: "A professional UI mockup showing a modern landing page with clean typography"
            };
        }

        return res.json({ success: true, brief: designBrief });

    } catch (error) {
        console.error('Analyze error:', error.message);
        return res.status(500).json({ error: 'Analysis failed: ' + error.message });
    }
});

// ============================================
// GENERATE VISUAL DESCRIPTION
// ============================================
app.post('/api/generate-visual', async (req, res) => {
    try {
        const { imagePrompt, colorPalette } = req.body;

        if (!imagePrompt) {
            return res.status(400).json({ error: 'No image prompt provided.' });
        }

        if (!groq) {
            return res.json({
                success: true,
                visual: {
                    description: 'Visual description unavailable — AI not configured.',
                    prompt: imagePrompt,
                    colors: colorPalette || []
                }
            });
        }

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'You describe UI design mockups in vivid detail. Given an image prompt, describe what the design looks like in 4-5 specific sentences. Talk about layout, colors, spacing, visual hierarchy, and overall feel. Return ONLY the description.'
                },
                { role: 'user', content: imagePrompt }
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0.7,
            max_tokens: 500
        });

        const description = chatCompletion.choices[0]?.message?.content || 'Visual concept generated.';

        return res.json({
            success: true,
            visual: { description, prompt: imagePrompt, colors: colorPalette || [] }
        });

    } catch (error) {
        console.error('Visual error:', error.message);
        return res.json({
            success: true,
            visual: {
                description: 'Could not generate description, but your mockup is ready based on the color palette.',
                prompt: req.body.imagePrompt || '',
                colors: req.body.colorPalette || []
            }
        });
    }
});

app.listen(PORT, () => {
    console.log(`Aurora API running on port ${PORT}`);
});