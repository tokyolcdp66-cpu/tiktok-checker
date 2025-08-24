// server.js - تحقق من وجود حساب TikTok
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// ✅ تفعيل CORS لجميع المصادر (يمكن تغييره لاحقاً)
app.use(cors());
app.use(express.json());

// المسار للتحقق من حساب TikTok
app.post('/check-tiktok', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ exists: false, error: "اسم المستخدم مطلوب" });
  }

  try {
    const response = await axios.get(`https://www.tiktok.com/@${username}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      validateStatus: () => true // لتفادي رفض الحالة 404
    });

    const html = response.data;

    // إذا كان الرابط 404 → الحساب غير موجود
    if (response.status === 404) return res.json({ exists: false });

    if (!html || typeof html !== 'string') return res.json({ exists: false });

    // تحقق من meta description إذا فيه اسم المستخدم
    const descMatch = html.match(/<meta name="description" content="([^"]+)"/i);
    if (descMatch && descMatch[1]) {
      if (descMatch[1].includes(`@${username}`)) return res.json({ exists: true });
    }

    // fallback على العنوان
    const titleMatch = html.match(/<title>(.*?)<\/title>/i);
    if (titleMatch && titleMatch[1]) {
      const title = titleMatch[1].trim();
      if (title.includes(`@${username}`)) return res.json({ exists: true });
    }

    // إذا لم تتحقق الشروط → الحساب غير موجود
    return res.json({ exists: false });

  } catch (error) {
    console.error("خطأ أثناء التحقق:", error.message);
    return res.json({ exists: false });
  }
});

// مسار تجريبي للتأكد من تشغيل السيرفر
app.get('/', (req, res) => {
  res.send('🚀 الخادم يعمل بنجاح!');
});

// التشغيل على المنفذ
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ الخادم يعمل على http://localhost:${PORT}`);
});
