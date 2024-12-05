const express = require('express');
const WeeklyWeather = require('../models/weeklyWeather');
const router = express.Router();

// 1. 전체 날씨 데이터 가져오기
router.get('/', async (req, res) => {
    try {
        const weatherWeekData = await WeeklyWeather.find();
        res.status(200).json(weatherWeekData);
    } catch (err) {
        res.status(500).json({ error: '데이터 가져오기 실패', details: err.message });
    }
});

// 2. 특정 날짜 데이터 가져오기
router.get('/:date', async (req, res) => {
    try {
        const weatherWeekData = await WeeklyWeather.findOne({ date: req.params.date });
        if (!weatherWeekData) return res.status(404).json({ error: '데이터를 찾을 수 없음' });
        res.status(200).json(weatherWeekData);
    } catch (err) {
        res.status(500).json({ error: '데이터 조회 실패', details: err.message });
    }
});

// 3. 특정 기간 데이터 가져오기
router.get('/range', async (req, res) => {
    const { start, end } = req.query; // YYYY-MM-DD 형식
    if (!start || !end) return res.status(400).json({ error: 'start와 end 쿼리 파라미터가 필요함' });

    try {
        const weatherWeekData = await WeeklyWeather.find({
            date: { $gte: start, $lte: end },
        });
        res.status(200).json(weatherWeekData);
    } catch (err) {
        res.status(500).json({ error: '데이터 조회 실패', details: err.message });
    }
});

module.exports = router;
