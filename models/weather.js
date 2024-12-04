const mongoose = require("mongoose");

const weatherSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  }, // YYYY-MM-DD 형식
  temperature: {
    type: Number,
    required: true,
  }, // 기온
  humidity: {
    type: Number,
  }, // 습도
  condition: {
    type: String,
  }, // 날씨 상태 (예: 맑음, 비)
});

const Weather = mongoose.model("Weather", weatherSchema);

module.exports = Weather;
