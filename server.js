require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { generateSoalDariGroq, jawabPertanyaanGroq } = require('./service/groqService');

const app = express();
const PORT = process.env.PORT || 3001;

// Konfigurasi CORS – sesuaikan dengan frontend kamu
const corsOptions = {
  origin: 'https://lifeplan-nine.vercel.app', // Ganti sesuai domain frontend kamu
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));
app.use(express.json());

// Route default: cek server aktif
app.get('/', (req, res) => {
  res.send('✅ Backend aktif dan berjalan!');
});

// Route: generate soal
app.post('/generate-soal', async (req, res) => {
  const { materi } = req.body;
  if (!materi) return res.status(400).json({ error: "Materi tidak boleh kosong." });

  try {
    const soalList = await generateSoalDariGroq(materi);
    res.json({ soalList });
  } catch (error) {
    console.error('Error generateSoal:', error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});

// Route: jawaban AI
app.post('/ask-groq', async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages harus array." });
  }

  try {
    const answer = await jawabPertanyaanGroq(messages);
    res.json({ answer });
  } catch (error) {
    console.error('Error jawabPertanyaan:', error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});

// Cek apakah API Key terisi
console.log('Menggunakan API Key:', process.env.GROQ_API_KEY ? 'TERISI ✅' : 'TIDAK TERISI ❌');

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
