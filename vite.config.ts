import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';
import { defineConfig, Plugin } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

function devApiPlugin(): Plugin {
  let aiClient: GoogleGenAI | null = null;
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
    } catch (e) {
      console.warn('Vite dev server GenAI initialization skipped:', e);
    }
  }

  return {
    name: 'aegis-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url === '/api/assistant' && req.method === 'POST') {
          let bodyStr = '';
          req.on('data', (chunk) => {
            bodyStr += chunk;
          });
          req.on('end', async () => {
            try {
              const parsed = JSON.parse(bodyStr || '{}');
              const { prompt, language = 'en', userLocation = 'Global', contextCategory } = parsed;

              if (!prompt) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                return res.end(JSON.stringify({ error: 'Prompt is required' }));
              }

              if (!aiClient) {
                res.setHeader('Content-Type', 'application/json');
                return res.end(
                  JSON.stringify({
                    reply: null,
                    fallbackRequired: true,
                    message: 'GEMINI_API_KEY not configured on server.',
                  })
                );
              }

              const langInstruction =
                language === 'ne'
                  ? 'Respond directly and clearly in fluent Nepali (नेपाली भाषामा). Use clear bullet points and action-oriented emergency guidance.'
                  : language === 'es'
                  ? 'Respond directly in Spanish (Español) with concise emergency instructions.'
                  : language === 'fr'
                  ? 'Respond directly in French (Français) with concise emergency instructions.'
                  : 'Respond clearly in English with direct, prioritized, actionable emergency steps.';

              const systemInstruction = `You are Aegis AI, the dedicated emergency intelligence companion for the AegisRelief portal.
Guidelines:
1. Always prioritize immediate human life safety instructions first.
2. For earthquake questions in Nepal or South Asia, specifically mention Nepal Emergency Helplines (Police: 100, Ambulance: 102, Fire: 101, NDRRMA: 1155, APF: 1114).
3. Be concise, authoritative, calm, and structured with bold highlights and numbered action checklists.
${langInstruction}`;

              const response = await aiClient.models.generateContent({
                model: 'gemini-3.8-flash',
                contents: `Context: Location=${userLocation}, Category=${contextCategory || 'General Disaster'}. User Inquiry: "${prompt}"`,
                config: {
                  systemInstruction,
                  temperature: 0.3,
                },
              });

              res.setHeader('Content-Type', 'application/json');
              return res.end(
                JSON.stringify({
                  reply: response.text || 'Immediate action: Seek shelter and listen to official broadcasts.',
                  source: 'gemini-3.8-flash',
                })
              );
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              return res.end(JSON.stringify({ error: err.message, fallbackRequired: true }));
            }
          });
          return;
        }

        if (req.url === '/api/health') {
          res.setHeader('Content-Type', 'application/json');
          return res.end(
            JSON.stringify({
              status: 'healthy',
              devServer: true,
              aiConfigured: Boolean(process.env.GEMINI_API_KEY),
            })
          );
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), devApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: Number(process.env.PORT) || 3000,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      host: '0.0.0.0',
      port: 8080,
    },
  };
});
