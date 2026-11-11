import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Server-side Gemini AI Client
  let aiClient: GoogleGenAI | null = null;
  function getGenAIClient(): GoogleGenAI {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY || '';
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });
    }
    return aiClient;
  }

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // AI Forecast & Executive Insights API Endpoint
  app.post('/api/ai/forecast', async (req, res) => {
    try {
      const { requestType, contextData } = req.body;
      const ai = getGenAIClient();

      const systemPrompt = `You are the AI Chief Operations & Analytics Officer for ScaffoldShare Inc., a Philippine construction equipment rental & asset platform.
Analyze the provided scaffolding inventory, regional demand, maintenance logs, and financial KPIs to return a structured response in valid JSON.
All monetary amounts are in Philippine Pesos (PHP ₱). Include Philippine construction domain details (e.g. NCR high-rise expansion, rainy season typhoon prep in Visayas, Davao bypass infrastructure).`;

      const userPrompt = `Request Type: ${requestType || 'Full AI Analysis'}
Context Summary:
- Total Inventory Assets: ${contextData?.totalAssets || 1740}
- Active Utilization Rate: ${contextData?.utilization || '84%'}
- Active Rentals: ${contextData?.activeRentals || 24}
- Monthly Gross Revenue: ₱${contextData?.monthlyRevenue || '1,840,000'}
- Top Regions: NCR, CALABARZON, Metro Cebu, Metro Davao

Task: Generate realistic strategic recommendations, regional demand predictions, dynamic rental pricing tweaks, stock rebalancing suggestions, and predictive maintenance risks for scaffolding frames, catwalks, shoring jacks, and steel planks in the Philippines.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: {
                type: Type.STRING,
                description: 'Executive summary of scaffolding operations and forecast.',
              },
              demandForecast: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    region: { type: Type.STRING },
                    demandIndex: { type: Type.NUMBER },
                    highDemandType: { type: Type.STRING },
                    growthForecast: { type: Type.STRING },
                  },
                },
              },
              pricingRecommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    equipmentType: { type: Type.STRING },
                    currentRate: { type: Type.NUMBER },
                    recommendedRate: { type: Type.NUMBER },
                    rationale: { type: Type.STRING },
                  },
                },
              },
              warehouseRebalance: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    sourceWarehouse: { type: Type.STRING },
                    targetWarehouse: { type: Type.STRING },
                    equipmentType: { type: Type.STRING },
                    quantity: { type: Type.NUMBER },
                    reason: { type: Type.STRING },
                  },
                },
              },
              maintenanceAlerts: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    assetId: { type: Type.STRING },
                    equipmentType: { type: Type.STRING },
                    riskLevel: { type: Type.STRING },
                    predictedFailureDays: { type: Type.NUMBER },
                    action: { type: Type.STRING },
                  },
                },
              },
            },
            required: ['summary', 'demandForecast', 'pricingRecommendations', 'warehouseRebalance', 'maintenanceAlerts'],
          },
        },
      });

      const jsonText = response.text || '{}';
      const parsed = JSON.parse(jsonText);
      res.json({ success: true, data: parsed });
    } catch (error: any) {
      console.error('Gemini AI Forecast API error:', error);
      // Fallback response if API key is not configured or network issues occur
      res.json({
        success: false,
        fallback: true,
        error: error.message || 'AI service unavailable',
        data: {
          summary: 'ScaffoldShare operations remain robust across NCR and Visayas. High demand for Walk-Thru Frames and Shoring Systems in BGC & Cebu Port construction projects.',
          demandForecast: [
            { region: 'NCR (Metro Manila)', demandIndex: 94, highDemandType: 'Scaffold Frame', growthForecast: '+14% MoM (High-Rise Facades)' },
            { region: 'Region IV-A (CALABARZON)', demandIndex: 82, highDemandType: 'Shoring Frame', growthForecast: '+9% MoM (Industrial Parks)' },
            { region: 'Metro Cebu (Visayas)', demandIndex: 88, highDemandType: 'Catwalk Planks', growthForecast: '+12% MoM (Port Expansion)' },
            { region: 'Metro Davao (Mindanao)', demandIndex: 76, highDemandType: 'Base Jacks', growthForecast: '+8% MoM (Bypass Viaducts)' },
          ],
          pricingRecommendations: [
            { equipmentType: 'Scaffold Frame', currentRate: 45, recommendedRate: 50, rationale: 'Utilization at 88% in NCR. Demand exceeds local depot stock.' },
            { equipmentType: 'Shoring Frame', currentRate: 65, recommendedRate: 72, rationale: 'High load capacity frames in high demand for bridge/viaduct projects.' },
            { equipmentType: 'Catwalk', currentRate: 35, recommendedRate: 38, rationale: 'Perforated non-slip planks required for monsoon safety compliance.' },
          ],
          warehouseRebalance: [
            { sourceWarehouse: 'Quezon City Central Depot', targetWarehouse: 'Manila Port Hub (Pier 18 Yard)', equipmentType: 'Scaffold Frame', quantity: 150, reason: 'High demand near BGC and Manila Bay reclamation projects.' },
            { sourceWarehouse: 'Metro Cebu Logistics Yard', targetWarehouse: 'Davao Industrial Hub', equipmentType: 'U Head Jack', quantity: 80, reason: 'Davao bypass tunnel viaduct scaling up shoring assembly.' },
          ],
          maintenanceAlerts: [
            { assetId: 'SBJ-2026-411', equipmentType: 'Base Jack', riskLevel: 'High', predictedFailureDays: 4, action: 'Re-thread and heat treat solid screw rod immediately.' },
            { assetId: 'SSF-2026-101', equipmentType: 'Scaffold Frame', riskLevel: 'Medium', predictedFailureDays: 14, action: 'Inspect locking pin springs after 90 days continuous outdoor rental.' },
          ],
        },
      });
    }
  });

  // Vite Middleware integration for dev / static serve in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ScaffoldShare IMS Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
