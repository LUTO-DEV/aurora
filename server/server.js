const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Groq = require('groq-sdk');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// ============================================
// ANALYZE DESIGN ENDPOINT
// ============================================
app.post('/api/analyze-design', async (req, res) => {
    try {
        const { prompt } = req.body;
        if (!prompt || prompt.trim() === '') {
            return res.status(400).json({ error: 'Please provide a design goal.' });
        }

        const systemPrompt = `You are AURORA, a world-class design strategist.

Given a design goal, return a structured JSON design brief.

CRITICAL RULES:
- Return ONLY valid JSON
- No markdown
- No code blocks
- No backticks
- No text before or after the JSON
- Just the raw JSON object

JSON structure:
{
  "projectTitle": "string",
  "summary": "One sentence summary of the design direction",
  "targetAudience": {
    "primary": "string",
    "ageRange": "string",
    "psychographics": "string"
  },
  "toneAndPersonality": {
    "primary": "string",
    "secondary": "string",
    "brandVoice": "string"
  },
  "colorPalette": [
    {"name": "Primary", "hex": "#hexcode", "usage": "string"},
    {"name": "Secondary", "hex": "#hexcode", "usage": "string"},
    {"name": "Accent", "hex": "#hexcode", "usage": "string"},
    {"name": "Background", "hex": "#hexcode", "usage": "string"},
    {"name": "Text", "hex": "#hexcode", "usage": "string"}
  ],
  "typography": {
    "headingFont": "string",
    "bodyFont": "string",
    "style": "string"
  },
  "layoutStructure": {
    "sections": ["string", "string", "string", "string", "string"],
    "heroStyle": "string",
    "ctaStrategy": "string"
  },
  "uxReasoning": "string",
  "moodKeywords": ["string", "string", "string", "string", "string"],
  "imagePrompt": "A detailed visual description starting with: A professional UI mockup showing..."
}`;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Design goal: ${prompt}` }
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0.6,
            max_tokens: 2000,
            response_format: { type: "json_object" }
        });

        const responseText = chatCompletion.choices[0]?.message?.content;
        console.log('Raw AI response:', responseText);

        let designBrief;
        try {
            let cleaned = responseText.trim();
            // Remove any markdown code blocks if they sneak in
            cleaned = cleaned.replace(/```json\s*/gi, '').replace(/```\s*/gi, '');
            // Find first { and last }
            const firstBrace = cleaned.indexOf('{');
            const lastBrace = cleaned.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1) {
                cleaned = cleaned.substring(firstBrace, lastBrace + 1);
            }
            designBrief = JSON.parse(cleaned);
        } catch (parseError) {
            console.error('Parse failed:', parseError.message);
            console.error('Response was:', responseText);
            // Fallback brief so the app doesn't break
            designBrief = {
                projectTitle: "Design Analysis",
                summary: "AI generated a response but it couldn't be parsed. Showing fallback.",
                targetAudience: { primary: "General audience", ageRange: "18-45", psychographics: "Design-conscious users" },
                toneAndPersonality: { primary: "Modern", secondary: "Clean", brandVoice: "Professional and approachable" },
                colorPalette: [
                    { name: "Primary", hex: "#2563eb", usage: "Main actions and headers" },
                    { name: "Secondary", hex: "#1e293b", usage: "Secondary elements" },
                    { name: "Accent", hex: "#f59e0b", usage: "Highlights and CTAs" },
                    { name: "Background", hex: "#0f172a", usage: "Page background" },
                    { name: "Text", hex: "#f1f5f9", usage: "Body text" }
                ],
                typography: { headingFont: "Inter", bodyFont: "Inter", style: "Clean sans-serif" },
                layoutStructure: { sections: ["Hero", "Features", "About", "Testimonials", "Footer"], heroStyle: "Centered with CTA", ctaStrategy: "Bold primary buttons" },
                uxReasoning: "These choices create a clean, professional foundation. Try again for a more specific analysis.",
                moodKeywords: ["modern", "clean", "professional", "minimal", "sharp"],
                imagePrompt: "A professional UI mockup showing a modern landing page"
            };
        }

        res.json({ success: true, brief: designBrief });

    } catch (error) {
        console.error('Server Error:', error.message);
        res.status(500).json({ error: 'Server error: ' + error.message });
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

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                {
                    role: 'system',
                    content: 'Describe the visual design mockup in 3-4 vivid sentences. Be specific about colors, layout, spacing, and visual hierarchy. Return ONLY the description text.'
                },
                { role: 'user', content: imagePrompt }
            ],
            model: 'llama-3.1-8b-instant',
            temperature: 0.7,
            max_tokens: 400
        });

        const description = chatCompletion.choices[0]?.message?.content;
        res.json({ success: true, visual: { description, prompt: imagePrompt, colors: colorPalette || [] } });

    } catch (error) {
        console.error('Visual error:', error.message);
        res.status(500).json({ error: 'Failed to generate visual.' });
    }
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'running' });
});

app.listen(PORT, () => {
    console.log(`AURORA server running on http://localhost:${PORT}`);
});