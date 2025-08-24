const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/check-tiktok', async (req, res) => {
  const { username } = req.body;
  try {
    const response = await axios.head(`https://www.tiktok.com/@${username}`);
    res.json({ exists: response.status === 200 });
  } catch (error) {
    res.json({ exists: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`الخادم يعمل على http://localhost:${PORT}`);
});