const axios = require('axios');
const { MongoClient } = require('mongodb');

// KEPCO 데이터 가져오기 함수
async function fetchKepcoData(year, month, metroCd, apiKey) {
  const baseUrl = "https://bigdata.kepco.co.kr/openapi/v1/powerUsage/houseAve.do";
  const params = {
    year,       // 조회 연도
    month,      // 조회 월
    metroCd,    // 시도 코드 (26: 부산광역시)
    apiKey,     // API 인증키
    returnType: "json" // 응답 형식
  };

  try {
    // API 요청
    const response = await axios.get(baseUrl, { params });

    // 데이터 반환
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
  const uri = "mongodb://localhost:27017"; // MongoDB URI
  const dbName = "powerUsage"; // 데이터베이스 이름
  const collectionName = "houseAve"; // 컬렉션 이름

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // 데이터 저장
    const records = data.map(record => ({ ...record, year, month }));
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
async function collectAndStoreData(apiKey, metroCd) {
  for (let year = 2018; year <= 2023; year++) {
    for (let month = 1; month <= 12; month++) {
      const monthStr = month.toString().padStart(2, "0"); // 월을 두 자리로 변환 (예: 01, 02)
      console.log(`데이터 요청 중: ${year}-${monthStr}`);
      const data = await fetchKepcoData(year.toString(), monthStr, metroCd, apiKey);
      await saveToMongoDB(data, year, monthStr);
    }
  }
  console.log("모든 데이터 저장 완료!");
}

// 실행 (매개변수 입력)
const apiKey = "w91q1Mt17op6V2ew95vhFzxMGJFGvv8e57vC7lQ0";  // 발급받은 API 인증키
const metroCd = "26";   // 부산광역시 코드

collectAndStoreData(apiKey, metroCd);
