const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// تفعيل CORS
app.use(cors());
// قراءة JSON من الطلب
app.use(express.json());

// المسار الرئيسي للتحقق من تيك توك
app.post('/check-tiktok', async (req, res) => {
  const { username } = req.body;
  
  // تأكد من أن username موجود
  if (!username) {
    return res.status(400).json({ exists: false, error: "اسم المستخدم مطلوب" });
  }

  try {
    const response = await axios.head(`https://www.tiktok.com/@${username}`);
    res.json({ exists: response.status === 200 });
  } catch (error) {
    res.json({ exists: false });
  }
});

// مسار تجريبي للتأكد من أن الخادم يعمل
app.get('/', (req, res) => {
  res.send('الخادم يعمل! ✅');
});

// التشغيل على المنفذ الصحيح
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`الخادم يعمل على http://localhost:${PORT}`);
});