const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// ✅ تفعيل CORS بدون مسافات
app.use(cors({
  origin: 'https://followflow-d31bc.web.app',
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.post('/check-tiktok', async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ exists: false, error: "اسم المستخدم مطلوب" });

  try {
    const response = await axios.head(`https://www.tiktok.com/@${username}`, {
      validateStatus: null
    });
    res.json({ exists: response.status === 200 });
  } catch (error) {
    res.json({ exists: false });
  }
});

app.get('/', (req, res) => {
  res.send('الخادم يعمل! ✅');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`الخادم يعمل على http://localhost:${PORT}`);
});