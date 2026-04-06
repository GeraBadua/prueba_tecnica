import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:4200';
const requestWindowMs = 60 * 1000;
const requestLimitPerWindow = Number(process.env.AI_RATE_LIMIT_PER_MINUTE ?? 20);
const requestCounters = new Map();

app.use(
  cors({
    origin: allowedOrigin,
    methods: ['POST'],
    allowedHeaders: ['Content-Type']
  })
);
app.use(express.json({ limit: '20kb' }));

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.use('/api/ai-description', (req, res, next) => {
  const ip = req.ip ?? req.socket.remoteAddress ?? 'unknown';
  const now = Date.now();
  const current = requestCounters.get(ip);

  if (!current || now > current.resetAt) {
    requestCounters.set(ip, { count: 1, resetAt: now + requestWindowMs });
    next();
    return;
  }

  if (current.count >= requestLimitPerWindow) {
    res.status(429).json({ error: 'Has superado el límite de solicitudes. Intenta de nuevo en un minuto.' });
    return;
  }

  current.count += 1;
  next();
});

app.post('/api/ai-description', async (req, res) => {
  try {
    const { product } = req.body;

    if (!product) {
      return res.status(400).json({ error: 'Producto no enviado.' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(503).json({ error: 'Servicio de IA no configurado en el servidor.' });
    }

    const title = typeof product.title === 'string' ? product.title.trim() : '';
    const category = typeof product.category === 'string' ? product.category.trim() : '';
    const description = typeof product.description === 'string' ? product.description.trim() : '';
    const price = Number(product.price);

    if (!title || !category || !description || Number.isNaN(price)) {
      return res.status(400).json({ error: 'El producto enviado no tiene el formato esperado.' });
    }

    const prompt = `
Genera una descripción breve, atractiva y profesional en español para un catálogo e-commerce.
Máximo 80 palabras.
Sin markdown.
No inventes datos que no estén presentes.

Producto:
- Título: ${title}
- Categoría: ${category}
- Precio: ${price}
- Descripción actual: ${description}
- Rating: ${product.rating?.rate ?? 'N/A'}
- Opiniones: ${product.rating?.count ?? 'N/A'}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const text = response.text?.trim();

    if (!text) {
      return res.status(500).json({ error: 'No se generó texto.' });
    }

    res.json({ text });
  } catch (error) {
    console.error('Error Gemini:', error);
    res.status(500).json({ error: 'No fue posible generar la descripción.' });
  }
});

app.listen(port, () => {
  console.log(`Servidor IA corriendo en http://localhost:${port}`);
  console.log(`CORS permitido para: ${allowedOrigin}`);
});