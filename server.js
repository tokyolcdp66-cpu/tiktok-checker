// server.js محسّن للتحقق من حسابات TikTok

const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// السماح فقط لموقعك بالوصول
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
    // إعداد Headers لمحاكاة متصفح حقيقي
    const response = await axios.get(`https://www.tiktok.com/@${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.tiktok.com/'
      },
      validateStatus: () => true // قبول جميع حالات الاستجابة
    });

    const html = response.data;

    // إذا لم يتم العثور على الصفحة
    if (response.status === 404 || !html || typeof html !== 'string') {
      return res.json({ exists: false });
    }

    // البحث عن اسم المستخدم داخل meta description
    const descMatch = html.match(/<meta name="description" content="([^"]+)"/i);
    if (descMatch && descMatch[1] && descMatch[1].includes(`@${username}`)) {
      return res.json({ exists: true });
    }

    // fallback على عنوان الصفحة
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1] && titleMatch[1].includes(`@${username}`)) {
      return res.json({ exists: true });
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
