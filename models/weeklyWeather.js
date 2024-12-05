const mongoose = require("mongoose");

const weeklyweatherSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    }, // 연도
    city: {
      type: String,
      required: true,
    }, // 지역
    temp: {
      type: Number,
      required: true,
    }, // 평균 기온
    minTemp: {
      type: Number,
      required: true,
    }, // 최저 기온
    maxTemp: {
      type: Number,
      required: true,
    }, // 최고 기온
    cloud: {
      type: String,
      required: true,
    }, // 구름
  },
  {
    collection: "weeklyWeather", // MongoDB 컬렉션 이름
  }
);

const WeeklyWeather = mongoose.model("WeeklyWeather", weeklyweatherSchema);

module.exports = WeeklyWeather;
