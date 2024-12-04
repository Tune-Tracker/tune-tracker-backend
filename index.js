const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const weatherRoutes = require('./routes/weather');

const app = express();

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/weatherdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB 연결 성공'))
    .catch(err => console.error('MongoDB 연결 실패:', err));

// 미들웨어 설정
app.use(bodyParser.json());

// 라우트 설정
app.use('/api/weather', weatherRoutes);

// 서버 실행
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중`);
});
