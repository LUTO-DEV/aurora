const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

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

let groq;
try {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
    console.log('Groq ready');
} catch (err) {
    console.error('Groq init failed:', err.message);
}

app.get('/', (req, res) => res.json({ status: 'Aurora API running' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// ============================================
// ANALYZE - The main brain
// ============================================
app.post('/api/analyze-design', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt?.trim()) return res.status(400).json({ error: 'Provide a design goal.' });
        if (!groq) return res.status(500).json({ error: 'AI not configured.' });

        const systemPrompt = `You are AURORA, a senior design strategist with 20 years at agencies like Pentagram, IDEO, and Fantasy. You think deeply about WHY design decisions matter — not just what looks good.

When analyzing a design goal, think through these steps:
1. WHO is the user? What do they care about? What are their pain points?
2. WHAT emotion should the design evoke? Why?
3. HOW do color choices connect to psychology and the brand's goals?
4. WHY does the typography choice support readability AND brand personality?
5. WHAT layout pattern best serves the user's journey?

Return ONLY valid JSON. No markdown. No backticks. No explanation outside JSON.

Required structure:
{
  "projectTitle": "Creative but professional project name",
  "summary": "2-3 sentence strategic overview of the design direction and why it works",
  "targetAudience": {
    "primary": "Specific audience description",
    "ageRange": "Age range",
    "psychographics": "Their values, fears, motivations, and digital behavior",
    "painPoints": "What frustrates them about existing solutions",
    "designImplication": "How understanding this audience shapes our design choices"
  },
  "toneAndPersonality": {
    "primary": "Primary tone (one word)",
    "secondary": "Secondary tone (one word)",
    "brandVoice": "How the brand speaks — specific example sentence",
    "emotionalGoal": "What emotion should users feel within the first 5 seconds",
    "reasoning": "Why this tone works for this specific audience and goal"
  },
  "colorPalette": [
    {
      "name": "Primary",
      "hex": "#hexcode",
      "usage": "Where and how to use this color",
      "psychology": "Why this color works — connect to color psychology and the brand goal"
    },
    {
      "name": "Secondary",
      "hex": "#hexcode",
      "usage": "Where and how to use this color",
      "psychology": "Why this color works"
    },
    {
      "name": "Accent",
      "hex": "#hexcode",
      "usage": "Where and how to use this color",
      "psychology": "Why this color works"
    },
    {
      "name": "Background",
      "hex": "#hexcode",
      "usage": "Where and how to use this color",
      "psychology": "Why this color works"
    },
    {
      "name": "Text",
      "hex": "#hexcode",
      "usage": "Where and how to use this color",
      "psychology": "Why this color works"
    }
  ],
  "typography": {
    "headingFont": "Specific Google Font name",
    "bodyFont": "Specific Google Font name",
    "style": "Typography personality and feel",
    "reasoning": "Why these fonts pair well and serve the brand — mention readability, personality, and hierarchy",
    "scale": "Recommended type scale (e.g., 1.25 major third)"
  },
  "layoutStructure": {
    "sections": ["Section 1", "Section 2", "Section 3", "Section 4", "Section 5"],
    "heroStyle": "Specific hero approach and why",
    "ctaStrategy": "CTA placement, wording style, and conversion reasoning",
    "userFlow": "Describe the ideal user journey from landing to conversion",
    "reasoning": "Why this layout structure serves the goal better than alternatives"
  },
  "uxReasoning": "3-4 sentences of deep design reasoning. Connect audience psychology to visual choices. Explain the strategic thinking behind the brief as a whole. This should read like a creative director presenting to a client.",
  "accessibilityNotes": "2-3 specific accessibility considerations for this design",
  "moodKeywords": ["word1", "word2", "word3", "word4", "word5"],
  "designTokens": {
    "borderRadius": "value with px",
    "spacing": "base spacing value with px",
    "shadowStyle": "none, subtle, medium, or dramatic — with reasoning",
    "animationStyle": "none, subtle, smooth, or energetic — with reasoning"
  },
  "competitiveInsight": "One sentence about how this design differentiates from typical designs in this space",
  "imagePrompt": "A detailed prompt starting with: A professional UI design mockup showing..."
}

IMPORTANT:
- Every hex code must be valid 6-character hex
- Color choices must have real psychological reasoning, not generic statements
- Font choices must be real Google Fonts that actually exist
- Layout reasoning must connect to user behavior
- Be opinionated — good design is about strong choices, not safe ones`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Design goal: ${prompt}` }
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0.65,
            max_tokens: 3000,
            response_format: { type: "json_object" }
        });

        const raw = chatCompletion.choices[0]?.message?.content;
        console.log('Response length:', raw?.length);

        let brief;
        try {
            let cleaned = raw.trim().replace(/```json\s*/gi, '').replace(/```\s*/gi, '');
            const f = cleaned.indexOf('{');
            const l = cleaned.lastIndexOf('}');
            if (f !== -1 && l > f) cleaned = cleaned.substring(f, l + 1);
            brief = JSON.parse(cleaned);
        } catch (e) {
            console.error('Parse fail:', e.message);
            brief = buildFallback();
        }

        return res.json({ success: true, brief });

    } catch (error) {
        console.error('Error:', error.message);
        return res.status(500).json({ error: 'Analysis failed: ' + error.message });
    }
});

// ============================================
// GENERATE VISUAL
// ============================================
app.post('/api/generate-visual', async (req, res) => {
    try {
        const { imagePrompt, colorPalette } = req.body;
        if (!imagePrompt) return res.status(400).json({ error: 'No prompt.' });

        if (!groq) {
            return res.json({ success: true, visual: { description: 'AI not configured.', prompt: imagePrompt, colors: colorPalette || [] } });
        }

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: `You are a UI/UX design critic. Given a design mockup prompt, describe what you see in vivid detail across 5-6 sentences. Cover:
1. Overall layout and composition
2. Color usage and visual hierarchy
3. Typography and spacing
4. Key UI elements and their placement
5. The emotional impact and user experience feel
Be specific — mention positions (top-left, centered), sizes (large hero, small caption), and relationships between elements.`
                },
                { role: 'user', content: imagePrompt }
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0.7,
            max_tokens: 600
        });

        const description = completion.choices[0]?.message?.content || 'Visual concept generated.';
        return res.json({ success: true, visual: { description, prompt: imagePrompt, colors: colorPalette || [] } });

    } catch (error) {
        console.error('Visual error:', error.message);
        return res.json({ success: true, visual: { description: 'Mockup ready based on palette.', prompt: req.body.imagePrompt || '', colors: req.body.colorPalette || [] } });
    }
});

function buildFallback() {
    return {
        projectTitle: "Design Brief",
        summary: "Fallback brief — try being more specific in your prompt.",
        targetAudience: { primary: "General audience", ageRange: "18-45", psychographics: "Design-conscious users", painPoints: "Generic experiences", designImplication: "Clean, universal design language" },
        toneAndPersonality: { primary: "Modern", secondary: "Clean", brandVoice: "Clear and direct", emotionalGoal: "Trust and clarity", reasoning: "Safe defaults" },
        colorPalette: [
            { name: "Primary", hex: "#3b82f6", usage: "Buttons and links", psychology: "Blue conveys trust" },
            { name: "Secondary", hex: "#1e293b", usage: "Cards and surfaces", psychology: "Dark tones add depth" },
            { name: "Accent", hex: "#f59e0b", usage: "Highlights", psychology: "Amber draws attention" },
            { name: "Background", hex: "#0f172a", usage: "Page background", psychology: "Dark reduces eye strain" },
            { name: "Text", hex: "#f1f5f9", usage: "Body text", psychology: "High contrast for readability" }
        ],
        typography: { headingFont: "Inter", bodyFont: "Inter", style: "Clean sans-serif", reasoning: "Universal readability", scale: "1.25" },
        layoutStructure: { sections: ["Hero", "Features", "About", "Testimonials", "Footer"], heroStyle: "Centered", ctaStrategy: "Primary button", userFlow: "Linear scroll", reasoning: "Standard pattern" },
        uxReasoning: "Default brief applied. More specific prompts yield better results.",
        accessibilityNotes: "Ensure 4.5:1 contrast ratio. Use semantic HTML. Test with screen readers.",
        moodKeywords: ["modern", "clean", "professional", "minimal", "sharp"],
        designTokens: { borderRadius: "8px", spacing: "16px", shadowStyle: "subtle", animationStyle: "smooth" },
        competitiveInsight: "A clean foundation to build upon.",
        imagePrompt: "A professional UI mockup showing a modern landing page"
    };
}

app.listen(PORT, () => console.log(`Aurora API on port ${PORT}`));