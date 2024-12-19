const moment = require('moment');
const request = require('request');
const { MongoClient } = require('mongodb');

// DB 저장 함수
async function saveToMongoDB(data, client) {
    try {
        const db = client.db("monthlyData");
        const collection = db.collection("weeklyWeather");

        if (data.length > 0) {
            const bulkOps = data.map(item => ({
                updateOne: {
                    filter: { Date: item.Date, city: item.city }, // 고유 조건
                    update: { $set: item }, // 중복 시 업데이트
                    upsert: true // 데이터가 없으면 삽입
                }
            }));

            const result = await collection.bulkWrite(bulkOps);
            console.log(`업데이트된 문서: ${result.modifiedCount}, 삽입된 문서: ${result.upsertedCount}`);
        } else {
            console.log('저장할 데이터가 없습니다.');
        }
    } catch (error) {
        console.error('MongoDB 저장 중 오류 발생:', error);
    }
}

// 오래된 데이터 삭제 함수
async function deleteOldWeatherData(client) {
    try {
        const db = client.db("monthlyData");
        const collection = db.collection("weeklyWeather");

        // 모든 도시 데이터 관리 (예: city별 데이터 유지)
        const cities = await collection.distinct('city');
        for (const city of cities) {
            const docCount = await collection.countDocuments({ city });
            if (docCount > 7) {
                const excessDocs = await collection
                    .find({ city }) // 도시 필터링
                    .sort({ Date: 1 }) // 오래된 데이터부터 정렬
                    .limit(docCount - 7) // 초과 데이터만 선택
                    .toArray();

                const excessIds = excessDocs.map(doc => doc._id); // 초과 데이터의 _id 가져오기

                const deleteResult = await collection.deleteMany({ _id: { $in: excessIds } }); // 초과 데이터 삭제
                console.log(`도시: ${city}, 삭제된 오래된 문서 수: ${deleteResult.deletedCount}`);
            }
        }
    } catch (error) {
        console.error('오래된 데이터 삭제 중 오류 발생:', error);
    }
}

// 데이터 업데이트 함수
async function fetchWeatherData(client, serviceKey) {
    const endDate = moment().subtract(2, 'days').format('YYYYMMDD'); // startDate, endDate 둘다 어제 날짜로 설정 ==> 1시간 주기로 계속 업데이트
    const startDate = moment().subtract(8, 'days').format('YYYYMMDD'); 

    const url = 'http://apis.data.go.kr/1360000/AsosDalyInfoService/getWthrDataList';

    const queryParams = '?' + encodeURIComponent('serviceKey') + '=' + encodeURIComponent(serviceKey) +
        '&' + encodeURIComponent('pageNo') + '=1' +
        '&' + encodeURIComponent('numOfRows') + '=900' +
        '&' + encodeURIComponent('dataType') + '=JSON' +
        '&' + encodeURIComponent('dataCd') + '=ASOS' +
        '&' + encodeURIComponent('dateCd') + '=DAY' +
        '&' + encodeURIComponent('startDt') + '=' + encodeURIComponent(startDate) +
        '&' + encodeURIComponent('endDt') + '=' + encodeURIComponent(endDate) +
        '&' + encodeURIComponent('stnIds') + '=' + encodeURIComponent('159');

    console.log('API 요청 URL:', url + queryParams);

    request({ url: url + queryParams, method: 'GET' }, async function (error, response, body) {
        if (error) {
            console.error('API 요청 오류:', error);
            return;
        }

        console.log('응답 상태 코드:', response?.statusCode);
        console.log('응답 본문:', body);

        if (response && response.statusCode === 200) {
            try {
                if (body.trim().startsWith('<')) {
                    console.error('API 응답이 HTML 형식입니다. 요청 URL 또는 API 키를 확인하세요.');
                    return;
                }

                const result = JSON.parse(body);

                const items = result.response?.body?.items?.item || [];
                if (items.length === 0) {
                    console.log('API 응답 데이터가 비어 있습니다.');
                    return;
                }

                const formattedData = items.map(item => ({
                    Date: item.tm,
                    city: "부산",
                    temp: parseFloat(item.avgTa),
                    minTemp: parseFloat(item.minTa),
                    maxTemp: parseFloat(item.maxTa),
                    cloud: classifyCloudiness(parseFloat(item.avgTca))
                }));

                if (formattedData.length > 0) {
                    console.log('갱신된 데이터:', formattedData);
                    await saveToMongoDB(formattedData, client);
                }
            } catch (e) {
                console.error('JSON Parse Error:', e);
                console.error('응답 본문:', body);
            }
        } else {
            console.error('API 요청 실패. 상태 코드:', response?.statusCode);
        }
    });
}
 
// 전운량의 크기에 따라 날씨의 흐림 정도 분류
function classifyCloudiness(cloudValue) {
    if (cloudValue <= 2) return '맑음';
    else if (cloudValue <= 4) return '약간 흐림';
    else if (cloudValue <= 6) return '흐림';
    else if (cloudValue <= 8) return '다소 흐림';
    else return '매우 흐림';
}

module.exports = {
    saveToMongoDB,
    fetchWeatherData,
    classifyCloudiness,
    deleteOldWeatherData
};
