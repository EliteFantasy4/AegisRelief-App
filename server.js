import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = Number(process.env.PORT) || 8080;
const HOST = '0.0.0.0';

// Initialize GoogleGenAI server-side with User-Agent telemetry
let aiClient = null;
if (process.env.GEMINI_API_KEY) {
  try {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('GoogleGenAI initialization warning:', err.message);
  }
}

// Emergency AI Assistant API endpoint
app.post('/api/assistant', async (req, res) => {
  const { prompt, language = 'en', userLocation = 'Global', contextCategory } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // If no Gemini key is provided, return structured fallback message
  if (!aiClient) {
    return res.json({
      reply: null,
      fallbackRequired: true,
      message: 'GEMINI_API_KEY not configured. Falling back to local emergency knowledge base.',
    });
  }

  try {
    const langInstruction =
      language === 'ne'
        ? 'Respond directly and clearly in fluent Nepali (नेपाली भाषामा). Use clear bullet points and action-oriented emergency guidance.'
        : language === 'es'
        ? 'Respond directly in Spanish (Español) with concise emergency instructions.'
        : language === 'fr'
        ? 'Respond directly in French (Français) with concise emergency instructions.'
        : 'Respond clearly in English with direct, prioritized, actionable emergency steps.';

    const systemInstruction = `You are Aegis AI, the dedicated emergency intelligence companion for the AegisRelief portal.
Your primary role is to assist citizens, emergency responders, and relief coordinators during crisis events.
Guidelines:
1. Always prioritize immediate human life safety instructions first (e.g. Drop, Cover, Hold On; Turn Around Don't Drown; Evacuate vertically; Shelter-in-Place).
2. For earthquake questions in Nepal or South Asia, specifically mention Nepal Emergency Helplines (Police: 100, Ambulance: 102, Fire: 101, NDRRMA: 1155, APF: 1114).
3. Be concise, authoritative, calm, and structured with bold highlights and numbered action checklists.
4. Never speculate on casualty numbers or spread unverified rumors.
5. Emphasize that the user should listen to local official radio and authorities.
${langInstruction}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Context: Location=${userLocation}, Category=${contextCategory || 'General Disaster'}. User Inquiry: "${prompt}"`,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    const reply = response.text || 'Immediate safety priority: Follow local authority instructions and evacuate if ordered.';
    return res.json({
      reply,
      source: 'gemini-3.8-flash',
    });
  } catch (error) {
    console.error('Gemini API query error:', error.message);
    return res.status(500).json({
      error: 'AI assistant service encountered an error',
      fallbackRequired: true,
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'AegisRelief Global Intelligence',
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Serve Vite build static assets in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log(`[AegisRelief Server] Running on http://${HOST}:${PORT}`);
});
