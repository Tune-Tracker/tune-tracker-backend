require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
const cors = require('cors')
const weatherRoutes = require('./routes/monthlyWeather');
const electRoutes = require('./routes/monthlyElect');
const weatherWeekRoutes = require('./routes/weeklyWeather');
const predictRoutes = require('./routes/predict')
const app = express();

app.use(cors());  // 모든 출처에서의 요청을 허용

// MongoDB 연결
const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB 연결 성공'))
    .catch(err => console.error('MongoDB 연결 실패:', err));

// 미들웨어 설정
//app.use(bodyParser.json());

//express 내장 미들웨어
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//루트 페이지
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));  // public 디렉토리에 index.html
});

// 라우트 설정
app.use('/api/weather', weatherRoutes);
app.use('/api/elect', electRoutes);
app.use('/api/weatherWeek', weatherWeekRoutes);
app.use('/predict', predictRoutes);
// 서버 실행
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중`);
});
