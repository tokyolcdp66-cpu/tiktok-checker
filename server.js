// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// ✅ السماح لجميع المواقع (لتجنب مشاكل CORS أثناء التطوير)
// لاحقًا يمكن تحديد origin لموقعك فقط
app.use(cors({
  origin: '*',
  methods: ['POST', 'GET'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// مسار التحقق من حساب تيك توك
app.post('/check-tiktok', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ exists: false, error: "اسم المستخدم مطلوب" });
  }

  try {
    const response = await axios.get(`https://www.tiktok.com/@${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      timeout: 5000,
      validateStatus: () => true
    });

    const html = response.data;

    // إذا كان status 404 الحساب غير موجود
    if (response.status === 404) return res.json({ exists: false });

    // تحقق من meta description أو title
    const descMatch = html.match(/<meta name="description" content="([^"]+)"/i);
    if (descMatch && descMatch[1] && descMatch[1].includes(`@${username}`)) {
      return res.json({ exists: true });
    }

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

// مسار تجريبي
app.get('/', (req, res) => {
  res.send('🚀 الخادم يعمل بنجاح!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ الخادم يعمل على http://localhost:${PORT}`);
});
