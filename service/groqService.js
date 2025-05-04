const axios = require('axios');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY;

async function generateSoalDariGroq(materi) {
  try {
    const prompt = `
Buatkan 5 soal pilihan ganda untuk mahasiswa informatika tentang materi: "${materi}".
Format:
1. [soal]
   A. pilihan A
   B. pilihan B
   C. pilihan C
   D. pilihan D
   Jawaban: [huruf jawaban]
`;

    const response = await axios.post(GROQ_API_URL, {
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: "Anda adalah pembuat soal latihan untuk mahasiswa informatika." },
        { role: "user", content: prompt }
      ]
    }, {
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const rawContent = response.data.choices[0].message.content;
    const soalList = rawContent
      .split(/\n(?=\d+\.\s)/)
      .map(item => item.trim())
      .filter(Boolean);

    return soalList;

  } catch (error) {
    console.error('Error generateSoal:', error.message);
    throw new Error("Gagal membuat soal.");
  }
}

async function jawabPertanyaanGroq(messages) {
  try {
    const response = await axios.post(GROQ_API_URL, {
      model: "llama3-8b-8192",
      messages: messages
    }, {
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error jawabPertanyaan:', error.message);
    throw new Error("Gagal menjawab pertanyaan.");
  }
}

module.exports = { generateSoalDariGroq, jawabPertanyaanGroq };
