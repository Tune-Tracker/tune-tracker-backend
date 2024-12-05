const mongoose = require("mongoose");

// 스키마 정의
const monthlyelectSchema = new mongoose.Schema(
  {
    year: Number,          // 연도
    month: Number,         // 월
    totalPowerUsage: Number, // 총 전력 사용량 (예: kWh)
    totalBill: Number,     // 총 청구 금액
    totalHouseCnt: Number, // 총 가구 수
  },
  {
    collection: "monthlyElect", // 컬렉션 이름을 명시적으로 설정
  }
);

// 모델 생성
const MonthlyElect = mongoose.model("MonthlyElect", monthlyelectSchema);

module.exports = MonthlyElect;

