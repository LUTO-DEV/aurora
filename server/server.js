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

    const systemPrompt = `You are AURORA, a world-class creative director with 20 years at top agencies.

Your job: Create a design brief that makes the design FEEL like the product. Colors should come from the brand's world. Layout should match the content.

Return ONLY valid JSON. No markdown. No backticks.

CRITICAL: Choose projectType AND projectSubType carefully:

projectType options:
- "landing" (subtypes: "saas", "agency", "startup", "product", "event", "nonprofit")
- "ecommerce" (subtypes: "fashion", "electronics", "food", "marketplace", "luxury", "handmade")
- "dashboard" (subtypes: "analytics", "finance", "admin", "crm", "health", "project")
- "social" (subtypes: "photo", "video", "community", "dating", "professional", "messaging")
- "media" (subtypes: "music", "video", "podcast", "news", "magazine", "streaming")
- "portfolio" (subtypes: "designer", "photographer", "developer", "artist", "agency", "freelancer")
- "blog" (subtypes: "personal", "tech", "lifestyle", "news", "education", "corporate")
- "app" (subtypes: "fitness", "finance", "productivity", "travel", "weather", "utility")

The subtype determines specific UI elements. A food ecommerce has food photos and menu items. A fitness app has workout cards and progress rings. A music media app has album art and waveforms.

JSON structure:
{
  "projectTitle": "Creative name that captures brand essence",
  "summary": "2-3 sentences about design direction and WHY it expresses the product",
  "projectType": "one of the types above",
  "projectSubType": "one of the subtypes above",
  "targetAudience": {
    "primary": "Specific audience",
    "ageRange": "Age range",
    "psychographics": "Values and behaviors",
    "painPoints": "Their frustrations",
    "designImplication": "How this shapes visual choices"
  },
  "toneAndPersonality": {
    "primary": "Primary tone word",
    "secondary": "Secondary tone word",
    "brandVoice": "Example sentence in brand voice",
    "emotionalGoal": "Feeling users get in 5 seconds",
    "reasoning": "Why this tone expresses the product"
  },
  "colorPalette": [
    {
      "name": "Primary",
      "hex": "#hex",
      "usage": "Specific UI elements to apply this to",
      "reasoning": "Why this color expresses the brand — be specific to the product"
    },
    {
      "name": "Secondary",
      "hex": "#hex",
      "usage": "Specific UI elements",
      "reasoning": "Why this color"
    },
    {
      "name": "Accent",
      "hex": "#hex",
      "usage": "Specific UI elements",
      "reasoning": "Why this color"
    },
    {
      "name": "Background",
      "hex": "#hex",
      "usage": "Specific UI elements",
      "reasoning": "Why this color"
    },
    {
      "name": "Text",
      "hex": "#hex",
      "usage": "Specific UI elements",
      "reasoning": "Why this color"
    }
  ],
  "typography": {
    "headingFont": "Real Google Font name",
    "bodyFont": "Real Google Font name",
    "style": "Typography personality",
    "reasoning": "Why these fonts express the brand",
    "scale": "Type scale ratio"
  },
  "layoutStructure": {
    "sections": ["Section 1", "Section 2", "Section 3", "Section 4", "Section 5"],
    "heroStyle": "Specific hero approach",
    "ctaStrategy": "CTA approach",
    "userFlow": "User journey description",
    "reasoning": "Why this layout"
  },
  "visualElements": {
    "heroImage": "What the hero visual shows (specific to the product)",
    "supportingImages": ["Image 1 description", "Image 2 description", "Image 3 description"],
    "iconStyle": "Icon style (outline, filled, duotone, custom)",
    "illustrationStyle": "Illustration approach or none",
    "brandSymbol": "A single emoji that represents the brand"
  },
  "mockupContent": {
    "heroHeadline": "A short punchy headline (4-6 words) for the hero section",
    "heroSubtext": "One sentence supporting text",
    "ctaText": "CTA button text (2-3 words)",
    "secondaryCta": "Secondary CTA text",
    "featureNames": ["Feature 1 name", "Feature 2 name", "Feature 3 name"],
    "navItems": ["Nav 1", "Nav 2", "Nav 3"],
    "statNumbers": ["10K+", "4.9★", "99%"],
    "statLabels": ["Users", "Rating", "Uptime"]
  },
  "uxReasoning": "4-5 sentences connecting every choice back to the product. Sound like a creative director presenting to a client.",
  "accessibilityNotes": "Specific accessibility considerations",
  "moodKeywords": ["word1", "word2", "word3", "word4", "word5"],
  "designTokens": {
    "borderRadius": "value with px",
    "spacing": "base value with px",
    "shadowStyle": "description with reasoning",
    "animationStyle": "description with reasoning"
  },
  "competitiveInsight": "How this stands out from competitors",
  "imagePrompt": "Detailed image generation prompt"
}

RULES:
- Hex codes must be valid 6-char hex
- Colors must relate to the PRODUCT not generic theory
- Fonts must be real Google Fonts
- mockupContent fields should feel real — like actual copy for the product
- Be opinionated, not safe`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Design goal: ${prompt}` }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.65,
      max_tokens: 4000,
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
    if (!brief.projectSubType) brief.projectSubType = 'startup';
    if (!brief.visualElements) brief.visualElements = { heroImage: "Product visual", supportingImages: ["Feature 1", "Feature 2", "Feature 3"], iconStyle: "Outline", illustrationStyle: "none", brandSymbol: "✦" };
    if (!brief.mockupContent) brief.mockupContent = { heroHeadline: "Build Something Great", heroSubtext: "The tools you need to succeed", ctaText: "Get Started", secondaryCta: "Learn More", featureNames: ["Fast", "Secure", "Simple"], navItems: ["Home", "About", "Pricing"], statNumbers: ["10K+", "4.9★", "99%"], statLabels: ["Users", "Rating", "Uptime"] };

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
        { role: 'system', content: 'Describe a mobile app UI mockup in 5-6 vivid sentences. Cover layout, colors, imagery, and feel. Be specific.' },
        { role: 'user', content: imagePrompt }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 600
    });

    return res.json({ success: true, visual: { description: completion.choices[0]?.message?.content || '', prompt: imagePrompt, colors: colorPalette || [] } });
  } catch (error) {
    return res.json({ success: true, visual: { description: 'Mockup ready.', prompt: req.body.imagePrompt || '', colors: req.body.colorPalette || [] } });
  }
});

function buildFallback() {
  return {
    projectTitle: "Design Brief", summary: "Fallback brief.", projectType: "landing", projectSubType: "startup",
    targetAudience: { primary: "General", ageRange: "18-45", psychographics: "Design-conscious", painPoints: "Generic", designImplication: "Clean design" },
    toneAndPersonality: { primary: "Modern", secondary: "Clean", brandVoice: "Direct", emotionalGoal: "Trust", reasoning: "Defaults" },
    colorPalette: [
      { name: "Primary", hex: "#3b82f6", usage: "Buttons, links", reasoning: "Trust" },
      { name: "Secondary", hex: "#1e293b", usage: "Cards", reasoning: "Depth" },
      { name: "Accent", hex: "#f59e0b", usage: "Highlights", reasoning: "Attention" },
      { name: "Background", hex: "#0f172a", usage: "Page bg", reasoning: "Focus" },
      { name: "Text", hex: "#f1f5f9", usage: "Body text", reasoning: "Readability" }
    ],
    typography: { headingFont: "Inter", bodyFont: "Inter", style: "Clean", reasoning: "Universal", scale: "1.25" },
    layoutStructure: { sections: ["Hero", "Features", "About", "Testimonials", "Footer"], heroStyle: "Centered", ctaStrategy: "Bold", userFlow: "Linear", reasoning: "Standard" },
    visualElements: { heroImage: "Product visual", supportingImages: ["Feature 1", "Feature 2", "Feature 3"], iconStyle: "Outline", illustrationStyle: "none", brandSymbol: "✦" },
    mockupContent: { heroHeadline: "Build Better", heroSubtext: "Tools for success", ctaText: "Start", secondaryCta: "Learn More", featureNames: ["Fast", "Secure", "Simple"], navItems: ["Home", "About", "Pricing"], statNumbers: ["10K+", "4.9★", "99%"], statLabels: ["Users", "Rating", "Uptime"] },
    uxReasoning: "Default brief.", accessibilityNotes: "Ensure contrast.", moodKeywords: ["modern", "clean", "professional", "minimal", "sharp"],
    designTokens: { borderRadius: "8px", spacing: "16px", shadowStyle: "subtle", animationStyle: "smooth" },
    competitiveInsight: "Clean foundation.", imagePrompt: "A professional UI mockup"
  };
}

app.listen(PORT, () => console.log(`Aurora API on port ${PORT}`));