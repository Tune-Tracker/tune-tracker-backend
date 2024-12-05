const express = require('express');
const MonthlyElect = require('../models/monthlyElect');
const router = express.Router();

// 1. 모든 전력 데이터 가져오기
router.get('/', async (req, res) => {
    try {
        const data = await MonthlyElect.find();
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: '데이터 가져오기 실패', details: err.message });
    }
});

// 2.특정 연도와 월 데이터 가져오기
router.get("/:year/:month", async (req, res) => {
    const { year, month } = req.params;
    try {
      const data = await MonthlyElect.findOne({ year: Number(year), month: Number(month) });
      if (data) {
        res.json(data);
      } else {
        res.status(404).json({ message: "데이터를 찾을 수 없습니다." });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "서버 오류" });
    }
  });

// 3. 특정 기간의 전력 데이터 가져오기
router.get('/range', async (req, res) => {
    const { start, end } = req.query; // YYYY-MM-DD 형식
    if (!start || !end) return res.status(400).json({ error: 'start와 end 쿼리 파라미터가 필요함' });

    try {
        const data = await MonthlyElect.find({
            date: { $gte: start, $lte: end },
        });
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ error: '데이터 조회 실패', details: err.message });
    }
});


module.exports = router;
