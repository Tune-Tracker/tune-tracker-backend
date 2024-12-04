require('dotenv').config(); // dotenv 로드
const { MongoClient } = require('mongodb');
const axios = require('axios');

// 환경 변수에서 가져오기
const uri = process.env.MONGO_URI; // MongoDB URI
const apiKey = process.env.API_KEY; // API 인증키
const metroCd = process.env.METRO_CD; // 부산광역시 코드

const dbName = "powerUsage"; // 데이터베이스 이름
const collectionName = "houseAve"; // 컬렉션 이름

// KEPCO 데이터 가져오기 함수
async function fetchKepcoData(year, month, metroCd, apiKey) {
  const baseUrl = "https://bigdata.kepco.co.kr/openapi/v1/powerUsage/houseAve.do";
  const params = {
    year,
    month,
    metroCd,
    apiKey,
    returnType: "json",
  };

  try {
    const response = await axios.get(baseUrl, { params });
    if (response.data && response.data.data) {
      return response.data.data;
    } else {
      console.error("데이터를 찾을 수 없습니다:", response.data);
      return [];
    }
  } catch (error) {
    console.error(`API 요청 중 오류 발생 (${year}-${month}):`, error.message);
    return [];
  }
}

// MongoDB에 데이터 저장 함수
async function saveToMongoDB(data, year, month) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const records = data.map((record) => ({ ...record, year, month }));
    if (records.length > 0) {
      await collection.insertMany(records);
      console.log(`${year}-${month} 데이터 저장 완료 (${records.length}건)`);
    }
  } catch (error) {
    console.error("MongoDB 저장 중 오류 발생:", error.message);
  } finally {
    await client.close();
  }
}

// 전체 데이터 수집 및 저장
async function collectAndStoreData() {
  for (let year = 2018; year <= 2023; year++) {
    for (let month = 1; month <= 12; month++) {
      const monthStr = month.toString().padStart(2, "0");
      console.log(`데이터 요청 중: ${year}-${monthStr}`);
      const data = await fetchKepcoData(year.toString(), monthStr, metroCd, apiKey);
      await saveToMongoDB(data, year, monthStr);
    }
  }
  console.log("모든 데이터 저장 완료!");
}

// 실행
collectAndStoreData();
