import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

app.post('/api/ai-description', async (req, res) => {
  try {
    const { product } = req.body;

    if (!product) {
      return res.status(400).json({ error: 'Producto no enviado.' });
    }

    const prompt = `
Genera una descripción breve, atractiva y profesional en español para un catálogo e-commerce.
Máximo 80 palabras.
Sin markdown.
No inventes datos que no estén presentes.

Producto:
- Título: ${product.title}
- Categoría: ${product.category}
- Precio: ${product.price}
- Descripción actual: ${product.description}
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
});