require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const weatherRoutes = require('./routes/monthlyWeather');
const electRoutes = require('./routes/monthlyElect')
const app = express();

// MongoDB 연결
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB 연결 성공'))
    .catch(err => console.error('MongoDB 연결 실패:', err));

// 미들웨어 설정
//app.use(bodyParser.json());

//express 내장 미들웨어
app.use(express.json());

// 라우트 설정
app.use('/api/weather', weatherRoutes);
app.use('/api/elect',electRoutes)

// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중`);
});
