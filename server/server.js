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

app.post('/api/analyze-design', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt?.trim()) return res.status(400).json({ error: 'Provide a design goal.' });
    if (!groq) return res.status(500).json({ error: 'AI not configured.' });

    const systemPrompt = `You are AURORA, a world-class creative director. You don't just pick colors — you craft visual identities that EXPRESS what a brand IS.

Your job: Given a design goal, create a design brief that makes the design FEEL like the product.

CRITICAL THINKING RULES:
- Colors should come FROM the brand's world. A nature app gets earthy greens. A horror game gets dark reds and blacks. A kids' toy brand gets bright playful colors. Don't just pick "nice" colors — pick MEANINGFUL colors.
- The layout should match the CONTENT TYPE. An ecommerce app has product grids. A music app has album art and players. A news site has article cards. A portfolio has full-bleed images.
- Typography should match the PERSONALITY. A luxury brand gets elegant serifs. A tech startup gets clean sans-serifs. A gaming platform gets bold display fonts.
- Think about what IMAGES and VISUAL ELEMENTS would appear. A food delivery app shows food photos. A travel app shows destinations. A fitness app shows workout imagery.

Return ONLY valid JSON. No markdown. No backticks.

IMPORTANT: The "projectType" field determines the mockup layout. Choose the BEST match:
- "landing" = marketing landing page
- "ecommerce" = product shop / store
- "dashboard" = data / analytics / admin
- "social" = social media / feed / community
- "media" = streaming / music / video / content
- "portfolio" = creative / showcase / gallery
- "blog" = articles / news / magazine
- "app" = mobile app / utility / tool
- "saas" = software product / platform

JSON structure:
{
  "projectTitle": "Creative name that captures the brand essence",
  "summary": "2-3 sentences about the design direction. Explain WHY these choices express what the product IS.",
  "projectType": "one of: landing, ecommerce, dashboard, social, media, portfolio, blog, app, saas",
  "targetAudience": {
    "primary": "Specific audience",
    "ageRange": "Age range",
    "psychographics": "Values and behaviors",
    "painPoints": "Their frustrations",
    "designImplication": "How this shapes our visual choices"
  },
  "toneAndPersonality": {
    "primary": "Primary tone word",
    "secondary": "Secondary tone word",
    "brandVoice": "Example sentence in the brand's voice",
    "emotionalGoal": "The feeling users get in 5 seconds",
    "reasoning": "Why this tone expresses what the product is"
  },
  "colorPalette": [
    {
      "name": "Primary",
      "hex": "#hex",
      "usage": "Where to use",
      "reasoning": "Why this specific color expresses the brand — connect to the product's world, not generic color theory"
    },
    {
      "name": "Secondary",
      "hex": "#hex",
      "usage": "Where to use",
      "reasoning": "Why this color"
    },
    {
      "name": "Accent",
      "hex": "#hex",
      "usage": "Where to use",
      "reasoning": "Why this color"
    },
    {
      "name": "Background",
      "hex": "#hex",
      "usage": "Where to use",
      "reasoning": "Why this color"
    },
    {
      "name": "Text",
      "hex": "#hex",
      "usage": "Where to use",
      "reasoning": "Why this color"
    }
  ],
  "typography": {
    "headingFont": "Real Google Font",
    "bodyFont": "Real Google Font",
    "style": "Typography feel",
    "reasoning": "Why these fonts express the brand personality",
    "scale": "Type scale ratio"
  },
  "layoutStructure": {
    "sections": ["Section 1 with description", "Section 2", "Section 3", "Section 4", "Section 5"],
    "heroStyle": "Specific hero approach and why it fits",
    "ctaStrategy": "CTA approach",
    "userFlow": "User journey description",
    "reasoning": "Why this layout serves the content type"
  },
  "visualElements": {
    "heroImage": "What the main hero image/visual should show (be specific to the brand)",
    "supportingImages": ["What image 1 shows", "What image 2 shows", "What image 3 shows"],
    "iconStyle": "Icon style description (outline, filled, custom illustration, etc)",
    "illustrationStyle": "If illustrations are used, what style (flat, 3d, hand-drawn, none)",
    "brandSymbol": "A symbol or visual element that represents the brand (emoji or description)"
  },
  "uxReasoning": "4-5 sentences of deep strategic reasoning. Explain how EVERY visual choice connects back to what the product IS. This should sound like a creative director presenting to a client.",
  "accessibilityNotes": "Specific accessibility considerations",
  "moodKeywords": ["word1", "word2", "word3", "word4", "word5"],
  "designTokens": {
    "borderRadius": "value with px",
    "spacing": "base value with px",
    "shadowStyle": "description",
    "animationStyle": "description"
  },
  "competitiveInsight": "How this design stands out from competitors in this space",
  "imagePrompt": "Detailed image generation prompt"
}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Design goal: ${prompt}` }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.65,
      max_tokens: 3500,
      response_format: { type: "json_object" }
    });

    const raw = chatCompletion.choices[0]?.message?.content;

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

    if (!brief.projectType) brief.projectType = 'landing';
    if (!brief.visualElements) {
      brief.visualElements = {
        heroImage: "Main product or brand visual",
        supportingImages: ["Feature image 1", "Feature image 2", "Feature image 3"],
        iconStyle: "Minimal outline",
        illustrationStyle: "none",
        brandSymbol: "✦"
      };
    }

    return res.json({ success: true, brief });

  } catch (error) {
    console.error('Error:', error.message);
    return res.status(500).json({ error: 'Analysis failed: ' + error.message });
  }
});

app.post('/api/generate-visual', async (req, res) => {
  try {
    const { imagePrompt, colorPalette } = req.body;
    if (!imagePrompt) return res.status(400).json({ error: 'No prompt.' });
    if (!groq) return res.json({ success: true, visual: { description: 'AI not configured.', prompt: imagePrompt, colors: colorPalette || [] } });

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'Describe a mobile app UI mockup in 5-6 vivid sentences. Be specific about layout, colors, spacing, imagery, icons, and overall feel. Focus on mobile design patterns.' },
        { role: 'user', content: imagePrompt }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 600
    });

    const description = completion.choices[0]?.message?.content || 'Visual concept generated.';
    return res.json({ success: true, visual: { description, prompt: imagePrompt, colors: colorPalette || [] } });
  } catch (error) {
    return res.json({ success: true, visual: { description: 'Mockup ready.', prompt: req.body.imagePrompt || '', colors: req.body.colorPalette || [] } });
  }
});

function buildFallback() {
  return {
    projectTitle: "Design Brief", summary: "Fallback brief.", projectType: "landing",
    targetAudience: { primary: "General", ageRange: "18-45", psychographics: "Design-conscious", painPoints: "Generic experiences", designImplication: "Clean universal design" },
    toneAndPersonality: { primary: "Modern", secondary: "Clean", brandVoice: "Clear and direct", emotionalGoal: "Trust", reasoning: "Safe defaults" },
    colorPalette: [
      { name: "Primary", hex: "#3b82f6", usage: "Buttons", reasoning: "Trust and action" },
      { name: "Secondary", hex: "#1e293b", usage: "Cards", reasoning: "Depth" },
      { name: "Accent", hex: "#f59e0b", usage: "Highlights", reasoning: "Attention" },
      { name: "Background", hex: "#0f172a", usage: "Page bg", reasoning: "Focus" },
      { name: "Text", hex: "#f1f5f9", usage: "Body text", reasoning: "Readability" }
    ],
    typography: { headingFont: "Inter", bodyFont: "Inter", style: "Clean", reasoning: "Universal", scale: "1.25" },
    layoutStructure: { sections: ["Hero", "Features", "About", "Testimonials", "Footer"], heroStyle: "Centered", ctaStrategy: "Bold button", userFlow: "Linear", reasoning: "Standard" },
    visualElements: { heroImage: "Product visual", supportingImages: ["Feature 1", "Feature 2", "Feature 3"], iconStyle: "Outline", illustrationStyle: "none", brandSymbol: "✦" },
    uxReasoning: "Default brief. Be more specific for better results.",
    accessibilityNotes: "Ensure 4.5:1 contrast.", moodKeywords: ["modern", "clean", "professional", "minimal", "sharp"],
    designTokens: { borderRadius: "8px", spacing: "16px", shadowStyle: "subtle", animationStyle: "smooth" },
    competitiveInsight: "Clean foundation.", imagePrompt: "A professional mobile UI mockup"
  };
}

app.listen(PORT, () => console.log(`Aurora API on port ${PORT}`));