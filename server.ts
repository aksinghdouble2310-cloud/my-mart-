import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with telemetry
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Product catalogue summary for context grounding
const CATALOGUE_CONTEXT = `
My Mart Industries Pvt. Ltd. Nepal - Product Catalogue & Wholesale Inventory:
1. Premium Himalayan Basmati Rice (1kg pouch: Rs. 185, 25kg bulk sack: Rs. 4,100, Wholesale: Rs. 3,750/sack, MOQ: 5 sacks)
2. Dhara Shuddh Mustard Oil (1L bottle: Rs. 260, 15L Tin: Rs. 3,650, Wholesale: Rs. 3,350/tin, MOQ: 3 tins)
3. Himalayan Pure Cow Ghee (500g glass jar: Rs. 650, Wholesale 12-jar case: Rs. 6,800, MOQ: 2 cases)
4. Wai Wai Chicken Instant Noodles (75g pack: Rs. 25, Master Carton 30 pcs: Rs. 680, Wholesale: Rs. 620/carton, MOQ: 5 cartons)
5. Wai Wai Quick Veg Masala Noodles (Master Carton 30 pcs: Rs. 660, Wholesale: Rs. 600/carton, MOQ: 5 cartons)
6. Organic Musuro Dal / Red Lentils (1kg: Rs. 190, 30kg sack: Rs. 5,200, Wholesale: Rs. 4,750/sack, MOQ: 2 sacks)
7. Century Meat Masala & Garam Masala (100g: Rs. 85, Wholesale carton 24 units: Rs. 1,750, MOQ: 2 cartons)
8. Tokla Gold Premium Himalayan CTC Tea (500g: Rs. 340, Wholesale 20-pack carton: Rs. 5,800, MOQ: 2 cartons)
9. Roasted Beaten Rice (Chiura) (1kg: Rs. 130, 20kg sack: Rs. 2,300, Wholesale: Rs. 2,050/sack, MOQ: 3 sacks)
10. Hulas Chakki Aata Whole Wheat (5kg: Rs. 390, 50kg Mill Pack: Rs. 3,550, Wholesale: Rs. 3,250/pack, MOQ: 4 packs)
11. Surf Excel Detergent Powder (1kg: Rs. 240, 10kg bucket pack: Rs. 2,150, Wholesale carton: Rs. 1,950, MOQ: 3)
12. Dettol Antiseptic Soap 4-Pack (Pack: Rs. 210, Wholesale 72-unit case: Rs. 3,300, MOQ: 2 cases)
13. Dabur Real Mixed Fruit Juice (1L: Rs. 220, Wholesale Case 12-pack: Rs. 2,280, MOQ: 3 cases)
14. Haldiram's Bhujia Sev (400g: Rs. 280, Wholesale carton 20-units: Rs. 4,800, MOQ: 2 cartons)

Store Policies:
- Retail delivery across Kathmandu Valley (Kathmandu, Lalitpur, Bhaktapur), Pokhara, and Birgunj.
- Free retail delivery on orders above Rs. 1,500.
- Wholesale B2B delivery across all 7 provinces of Nepal.
- Free wholesale freight on orders above Rs. 10,000.
- Payment: eSewa, Khalti, Fonepay QR, Cash on Delivery, Wholesale Invoiced 30-Day Credit (for verified PAN/VAT accounts).
`;

// AI Shopping & Wholesale Assistant API
app.post('/api/gemini/assistant', async (req, res) => {
  try {
    const { message, role, currentCart, conversationHistory } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (ai) {
      const systemInstruction = `You are "MartSaathi", the official AI shopping and wholesale consultant for My Mart Industries Pvt. Ltd. in Nepal.
Your goal is to assist Nepali consumers and B2B kirana storekeepers/business owners.
Ground all advice strictly on the My Mart catalogue below:
${CATALOGUE_CONTEXT}

User Role: ${role === 'wholesale' ? 'B2B Wholesale Buyer / Kirana Store Owner' : 'Retail Consumer'}
Current Cart item count: ${Array.isArray(currentCart) ? currentCart.length : 0}

Guidelines:
1. Speak with polite, helpful Nepali e-commerce warmth (use English with authentic Nepali grocery terms where appropriate: e.g. Chiura, Musuro Dal, Ghee, Basmati, Aata, Kirana, NPR/Rs.).
2. When answering recipe or grocery queries (e.g. for Dal Bhat, Newari Khaja, Momos, Sel Roti, or breakfast), list exact matching items available in My Mart.
3. For wholesale buyers, recommend carton quantities, bulk sack pricing, and highlight minimum order quantities (MOQ) and savings compared to retail.
4. Keep responses concise, well-structured, scannable, without robotic fluff. Never fabricate products not sold in grocery/household essentials.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: `${systemInstruction}\n\nCustomer question: "${message}"` }],
          },
        ],
      });

      return res.json({
        reply: response.text || 'Namaste! How may I assist your grocery or wholesale order today?',
      });
    }

    // High quality contextual fallback if GEMINI_API_KEY is not set
    let fallbackReply = `Namaste! Welcome to My Mart Industries. `;
    const lower = message.toLowerCase();

    if (lower.includes('rice') || lower.includes('chamal') || lower.includes('basmati')) {
      fallbackReply += role === 'wholesale' 
        ? `For your store, our Premium Himalayan Basmati Rice (25kg bulk sack) is Rs. 3,750 (Wholesale MOQ: 5 sacks). This saves Rs. 350 per sack compared to retail.`
        : `We offer Premium Himalayan Aromatic Basmati Rice at Rs. 185 for 1kg pouches, or Rs. 4,100 for the full 25kg family sack with free delivery!`;
    } else if (lower.includes('oil') || lower.includes('tel') || lower.includes('mustard')) {
      fallbackReply += role === 'wholesale'
        ? `Dhara Shuddh Cold-Pressed Mustard Oil 15L Tin is available at Rs. 3,350/tin wholesale (MOQ: 3 tins), packed directly from the factory.`
        : `Dhara Pure Mustard Oil is Rs. 260 per 1L bottle, or Rs. 3,650 for a 15L household tin.`;
    } else if (lower.includes('wai wai') || lower.includes('noodle')) {
      fallbackReply += role === 'wholesale'
        ? `Wai Wai Chicken Master Cartons (30 packets) are Rs. 620/carton (MOQ: 5 cartons). Wai Wai Veg Masala is Rs. 600/carton.`
        : `Wai Wai Chicken Noodles are Rs. 25 per packet, or Rs. 680 for a full carton of 30!`;
    } else if (lower.includes('credit') || lower.includes('pan') || lower.includes('vat')) {
      fallbackReply += `Approved B2B partners in Nepal enjoy up to Rs. 250,000 revolving credit with 30-day invoice terms upon VAT/PAN verification. You can register your business in the Wholesale tab.`;
    } else if (lower.includes('dal') || lower.includes('lentil')) {
      fallbackReply += `Our Organic Himalayan Musuro Dal (Red Lentils) is Rs. 190 per 1kg pouch, or Rs. 4,750 for a 30kg kirana sack wholesale.`;
    } else {
      fallbackReply += `We have fresh arrivals of Himalayan Basmati Rice, Pure Mustard Oil, Wai Wai master cartons, Hulas Aata, and organic pulses. Would you like product recommendations or carton discounts for your order?`;
    }

    return res.json({ reply: fallbackReply });
  } catch (err: any) {
    console.error('Error handling Gemini assistant request:', err);
    return res.status(500).json({
      reply: 'Namaste! We are experiencing high traffic right now. You can browse our live catalogue below or add items directly to your cart.',
    });
  }
});

// Vite middleware in development
const isProduction = process.env.NODE_ENV === 'production';
if (!isProduction) {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`My Mart server running at http://localhost:${PORT}`);
});
