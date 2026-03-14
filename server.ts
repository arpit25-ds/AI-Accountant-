import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // AI API Route
  app.post("/api/accountant", async (req, res) => {
    try {
      const { base64Image, mimeType } = req.body;
      
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
      
      if (!apiKey) {
        console.error("No API key found in environment variables (GEMINI_API_KEY or API_KEY)");
        return res.status(500).json({ error: "API key is not configured" });
      }

      const ai = new GoogleGenAI({ apiKey });
      const model = "gemini-3-flash-preview";
      
      console.log(`Analyzing receipt with model: ${model}, key length: ${apiKey.length}`);
      
      const response = await ai.models.generateContent({
        model,
        contents: [
          {
            parts: [
              {
                text: `You are an AI Librarian Accountant. Your job is to look at library receipts and tell me if they are for 'Physical Books' or 'Digital Licenses.' 
                Always be 100% accurate with numbers. 
                
                Analyze the provided image and extract:
                1. The vendor/library name.
                2. The items purchased/licensed, their quantities, and individual prices.
                3. The total amount and currency.
                4. Categorize the entire receipt as 'Physical Books', 'Digital Licenses', or 'Mixed'.
                5. Provide a brief summary of the audit.`
              },
              {
                inlineData: {
                  data: base64Image,
                  mimeType: mimeType
                }
              }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              vendorName: { type: Type.STRING },
              category: { 
                type: Type.STRING, 
                enum: ['Physical Books', 'Digital Licenses', 'Mixed', 'Unknown'] 
              },
              items: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    description: { type: Type.STRING },
                    amount: { type: Type.NUMBER },
                    quantity: { type: Type.NUMBER }
                  },
                  required: ['description', 'amount', 'quantity']
                }
              },
              totalAmount: { type: Type.NUMBER },
              currency: { type: Type.STRING },
              summary: { type: Type.STRING },
              confidence: { type: Type.NUMBER }
            },
            required: ['vendorName', 'category', 'items', 'totalAmount', 'currency', 'summary']
          }
        }
      });

      const result = JSON.parse(response.text || '{}');
      res.json(result);
    } catch (error) {
      console.error("AI Analysis Error:", error);
      res.status(500).json({ error: "Failed to analyze receipt" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
