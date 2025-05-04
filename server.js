require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { generateSoalDariGroq, jawabPertanyaanGroq } = require('./service/groqService');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/generate-soal', async (req, res) => {
  const { materi } = req.body;
  if (!materi) return res.status(400).json({ error: "Materi tidak boleh kosong." });

  try {
    const soalList = await generateSoalDariGroq(materi);
    res.json({ soalList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/ask-groq', async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages harus array." });
  }

  try {
    const answer = await jawabPertanyaanGroq(messages);
    res.json({ answer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
console.log('Menggunakan API Key:', process.env.GROQ_API_KEY ? 'TERISI ✅' : 'TIDAK TERISI ❌');
app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));
