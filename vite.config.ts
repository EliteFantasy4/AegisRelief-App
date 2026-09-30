import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { defineConfig, Plugin } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

// Plugin to ensure GitHub Pages serves index.html on 404 for SPA routing
function githubPagesSpaPlugin(): Plugin {
  return {
    name: 'github-pages-spa',
    closeBundle() {
      try {
        const distDir = path.resolve(__dirname, 'dist');
        const distIndex = path.resolve(distDir, 'index.html');
        const dist404 = path.resolve(distDir, '404.html');
        if (fs.existsSync(distIndex)) {
          fs.copyFileSync(distIndex, dist404);
        }
      } catch (e) {
        console.warn('Could not copy index.html to 404.html:', e);
      }
    },
  };
}

function devApiPlugin(): Plugin {
  let aiClient: GoogleGenAI | null = null;
  const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      aiClient = new GoogleGenAI({
        apiKey,
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
        const url = req.url || '';
        const isAssistant = url === '/api/assistant' || url.startsWith('/AegisRelief-App/api/assistant');
        const isHealth = url === '/api/health' || url.startsWith('/AegisRelief-App/api/health');

        if (isAssistant && req.method === 'POST') {
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
                model: 'gemini-2.5-flash',
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
                  source: 'gemini-live',
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

        if (isHealth) {
          res.setHeader('Content-Type', 'application/json');
          return res.end(
            JSON.stringify({
              status: 'healthy',
              devServer: true,
              aiConfigured: Boolean(apiKey),
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
    base: '/AegisRelief-App/',
    plugins: [react(), tailwindcss(), devApiPlugin(), githubPagesSpaPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: Number(process.env.PORT) || 8080,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      host: '0.0.0.0',
      port: 8080,
    },
  };
});
