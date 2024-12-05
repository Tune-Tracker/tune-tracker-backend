const mongoose = require("mongoose");

const monthlyweatherSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
    }, // 연도
    month: {
      type: Number,
      required: true,
    }, // 월
    avgTemp: {
      type: Number,
      required: true,
    }, // 평균 기온
    precipitation: {
      type: Number,
      required: true,
    }, // 강수량
    minTemp: {
      type: Number,
      required: true,
    }, // 최저 기온
    maxTemp: {
      type: Number,
      required: true,
    }, // 최고 기온
  },
  {
    collection: "monthlyWeather", // MongoDB 컬렉션 이름
  }
);

const MonthlyWeather = mongoose.model("MonthlyWeather", monthlyweatherSchema);

module.exports = MonthlyWeather;
