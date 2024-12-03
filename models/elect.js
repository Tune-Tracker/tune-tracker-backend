const mongoose = require("mongoose");

// 전력 데이터 스키마 정의
const electricitySchema = new mongoose.Schema({
  date: {
    type: String, // 날짜 (YYYY-MM-DD 형식)
    required: true,
  },
  time: {
    type: String, // 시간 (HH:mm 형식)
    required: true,
  },
  consumption: {
    type: Number, // 전력 소비량 (kWh)
    required: true,
  },
  region: {
    type: String, // 지역 이름 (예: 부산, 서울 등)
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now, // 데이터 생성 시간
  },
});

// 모델 생성
const Electricity = mongoose.model("Electricity", electricitySchema);

module.exports = elect;
