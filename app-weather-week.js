require('dotenv').config();
var request = require('request');
const { MongoClient } = require('mongodb');
const moment = require('moment');

const MONGO_URI = process.env.MONGO_URI;  // MongoDB 연결 URI (IP와 포트 확인 필요)
const DATABASE_NAME = process.env.DATABASE_NAME;  // 사용할 데이터베이스 이름
const COLLECTION_NAME3 = process.env.COLLECTION_NAME3;  // 컬렉션 이름 

// MongoDB 클라이언트 초기화
const client = new MongoClient(MONGO_URI);

async function saveToMongoDB(data) {
    try {
        await client.connect();
        const db = client.db(DATABASE_NAME);
        const collection = db.collection(COLLECTION_NAME3);

        // MongoDB에 데이터 삽입
        if (data.length > 0) {
            const result = await collection.insertMany(data);
            console.log(`${result.insertedCount}개의 문서가 MongoDB에 저장되었습니다.`);
        } else {
            console.log('저장할 데이터가 없습니다.');
        }
    } catch (error) {
        console.error('MongoDB 저장 중 오류 발생:', error);
    } finally {
        await client.close();
    }
}

function classifyCloudiness(cloudValue) {
    if (cloudValue <= 2) {
        return '맑은';
    } else if (cloudValue <= 4) {
        return '약간 흐림';
    } else if (cloudValue <= 6) {
        return '흐림';
    } else if (cloudValue <= 8) {
        return '다소 흐림';
    } else {
        return '매우 흐림';
    }
}

async function fetchWeatherData() {
    const endDate = moment().subtract(2, 'days').format('YYYYMMDD');
    const startDate = moment().subtract(8, 'days').format('YYYYMMDD');

    var url = 'http://apis.data.go.kr/1360000/AsosDalyInfoService/getWthrDataList';
    var serviceKey = process.env.SERVICE_KEY;

    var queryParams = '?' + encodeURIComponent('serviceKey') + '=' + encodeURIComponent(serviceKey);
    queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
    queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('900');
    queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON');
    queryParams += '&' + encodeURIComponent('dataCd') + '=' + encodeURIComponent('ASOS');
    queryParams += '&' + encodeURIComponent('dateCd') + '=' + encodeURIComponent('DAY');
    queryParams += '&' + encodeURIComponent('startDt') + '=' + encodeURIComponent(startDate);
    queryParams += '&' + encodeURIComponent('endDt') + '=' + encodeURIComponent(endDate);
    queryParams += '&' + encodeURIComponent('stnIds') + '=' + encodeURIComponent('159');

    request({
        url: url + queryParams,
        method: 'GET'
    }, async function (error, response, body) {
        if (error) {
            console.error('Error:', error); // 오류 출력
            return;
        }

        if (response && response.statusCode == 200) {
            try {
                var result = JSON.parse(body);

                if (result.response && result.response.body && result.response.body.items && result.response.body.items.item) {
                    var items = result.response.body.items.item;

                    if (!Array.isArray(items)) {
                        items = [items]; // 단일 항목도 배열로 처리
                    }

                    // MongoDB에 저장할 데이터를 구성
                    const formattedData = items.map(item => ({
                        Date: item.tm,
                        city: "부산",
                        temp: parseFloat(item.avgTa),
                        minTemp: parseFloat(item.minTa),
                        maxTemp: parseFloat(item.maxTa),
                        cloud: classifyCloudiness(parseFloat(item.avgTca))
                    }));

                    if (formattedData.length > 0) {
                        console.log(formattedData); // 콘솔에 출력

                        // MongoDB에 데이터 저장
                        await saveToMongoDB(formattedData);
                    } else {
                        console.log('형식화된 데이터가 없습니다. 저장할 데이터가 없습니다.');
                    }
                } else {
                    console.log('API 응답에 저장할 데이터가 없습니다.');
                }
            } catch (e) {
                console.error('JSON Parse Error:', e);
            }
        } else {
            console.error('Request failed with status code:', response ? response.statusCode : 'Unknown');
        }
    });
}

// 매일 데이터를 자동으로 갱신하도록 설정 (하루에 한 번 실행)
setInterval(fetchWeatherData, 24 * 60 * 60 * 1000);

// 스크립트 실행 시 초기 데이터 가져오기
fetchWeatherData();
