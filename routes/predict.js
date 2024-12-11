const axios = require('axios');
const express = require('express');
const router = express.Router();

router.post('/predict', async (req, res) => {
    const { avgTemp, precipitation, avgRhm, season } = req.body;

    try {
        // FastAPI 서버로 예측 요청 보내기
        const response = await axios.post(`${process.env.ML_API_URL}/predict`, {
            avgTemp,
            precipitation,
            avgRhm,
            season
        });

        // FastAPI에서 받은 예측 결과 반환
        res.json({
            predicted_power_usage: response.data.predicted_power_usage
        });
    } catch (error) {
        res.status(500).json({ error: 'Error occurred while making prediction' });
    }
});

module.exports = router;
