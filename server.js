// server.js (نسخة محسنة)

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'https://followflow-d31bc.web.app',
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.post('/check-tiktok', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ exists: false, error: "اسم المستخدم مطلوب" });
  }

  try {
    const response = await axios.get(`https://www.tiktok.com/@${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      validateStatus: () => true
    });

    const html = response.data;

    if (response.status === 404) {
      return res.json({ exists: false });
    }

    if (!html || typeof html !== 'string') {
      return res.json({ exists: false });
    }

    // ✅ تحقق من وجود meta description
    const descMatch = html.match(/<meta name="description" content="([^"]+)"/i);
    if (descMatch && descMatch[1]) {
      if (descMatch[1].includes(`@${username}`)) {
        return res.json({ exists: true });
      }
    }

    // fallback على العنوان
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      const title = titleMatch[1].trim();
      if (title.includes(`@${username}`)) {
        return res.json({ exists: true });
      }
    }

    return res.json({ exists: false });

  } catch (error) {
    console.error("خطأ أثناء التحقق:", error.message);
    return res.json({ exists: false });
  }
});

app.get('/', (req, res) => {
  res.send('🚀 الخادم يعمل بنجاح!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ الخادم يعمل على http://localhost:${PORT}`);
});
