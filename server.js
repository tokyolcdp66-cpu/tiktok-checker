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

  if (!username) {
    return res.status(400).json({ exists: false, error: "اسم المستخدم مطلوب" });
  }

  try {
    const response = await axios.get(`https://www.tiktok.com/@${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36'
      },
      validateStatus: (status) => status >= 200 && status < 500
    });

    const html = response.data;

    if (response.status === 404 || response.status === 400) {
      return res.json({ exists: false });
    }

    if (!html || typeof html !== 'string') {
      return res.json({ exists: false });
    }

    // تحقق من وجود علامات تدل على حساب حقيقي
    if (
      html.includes('seo-title') ||
      html.includes('og:title') ||
      html.includes('application/ld+json')
    ) {
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      if (titleMatch && titleMatch[1]) {
        const title = titleMatch[1].trim();
        if (
          title.includes('Page Not Found') ||
          title.includes('TikTok - Make Your Day') ||
          title === 'TikTok'
        ) {
          return res.json({ exists: false });
        }
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