const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors()); // ให้ Backend ยอมรับการเชื่อมต่อจาก Frontend
app.use(express.json()); // รองรับ JSON request

// สร้าง API เรียกใช้งาน
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from Backend!' });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
