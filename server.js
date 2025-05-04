const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // untuk request ke Groq/OpenAI

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Izinkan akses dari domain lain (Vercel, dll)
app.use(bodyParser.json());

// Endpoint untuk menerima pesan dari frontend
app.post('/ask-groq', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages harus array.' });
    }

    // Ganti dengan key & model yang sesuai (misal Groq atau OpenAI)
    const apiKey = process.env.GROQ_API_KEY;
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768', // atau 'gpt-3.5-turbo' jika pakai OpenAI
        messages,
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Groq error:', text);
      return res.status(500).json({ error: 'Gagal mengambil respon dari Groq' });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || 'Tidak ada jawaban.';

    res.json({ reply });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/', (req, res) => {
  res.send('LifePlanCalc AI Backend aktif!');
});

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
