const mongoose = require("mongoose");

// 전력 데이터 스키마 정의
const electricitySchema = new mongoose.Schema({
  year: {
    type: Number, // 연도 (YYYY 형식)
    required: true,
  },
  month: {
    type: Number, // 월 (1~12 형식)
    required: true,
  },
  totalBill: {
    type: Number, // 청구서 합계 (원 단위)
    required: true,
  },
  totalHouseCnt: {
    type: Number, // 가구 수 합계
    required: true,
  },
  totalPowerUsage: {
    type: Number, // 전력 사용량 합계 (kWh)
    required: true,
  },
});

// 모델 생성
const elect = mongoose.model("elect", electSchema);

module.exports = elect;
