require('dotenv').config();
var request = require('request');
const { MongoClient } = require('mongodb');

const connect = process.env.MONGO_URI;  // MongoDB 연결 URI (IP와 포트 확인 필요)
const DBNAME = process.env.DATABASE_NAME;  // 사용할 데이터베이스 이름
const COL = process.env.COLLECTION_NAME;  // 컬렉션 이름 

// MongoDB 클라이언트 초기화
const client = new MongoClient(MONGO_URI);

async function saveToMongoDB(data) {
    try {
        await client.connect();
        const db = client.db(DATABASE_NAME);
        const collection = db.collection(COLLECTION_NAME);

        // MongoDB에 데이터 삽입
        const result = await collection.insertMany(data);
        console.log(`${result.insertedCount}개의 문서가 MongoDB에 저장되었습니다.`);
    } catch (error) {
        console.error('MongoDB 저장 중 오류 발생:', error);
    } finally {
        await client.close();
    }
}

var url = 'http://apis.data.go.kr/1360000/AsosDalyInfoService/getWthrDataList';
var serviceKey = process.env.SERVICE_KEY;

var queryParams = '?' + encodeURIComponent('serviceKey') + '=' + encodeURIComponent(serviceKey);
queryParams += '&' + encodeURIComponent('pageNo') + '=' + encodeURIComponent('1');
queryParams += '&' + encodeURIComponent('numOfRows') + '=' + encodeURIComponent('900');
queryParams += '&' + encodeURIComponent('dataType') + '=' + encodeURIComponent('JSON');
queryParams += '&' + encodeURIComponent('dataCd') + '=' + encodeURIComponent('ASOS');
queryParams += '&' + encodeURIComponent('dateCd') + '=' + encodeURIComponent('DAY');
queryParams += '&' + encodeURIComponent('startDt') + '=' + encodeURIComponent('20230101');
queryParams += '&' + encodeURIComponent('endDt') + '=' + encodeURIComponent('20231231');
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

                // 데이터를 월별로 그룹화
                const monthlyData = items.reduce((acc, item) => {
                    const date = new Date(item.tm);
                    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`; // ex: "2023-1" for January 2023
                    // 일별 데이터를 달 단위로 묶어서 평균을 출력(평균온도, 강수량, 최저기온, 최고기온...)
                    if (!acc[monthKey]) {
                        acc[monthKey] = {
                            count: 0,
                            totalAvgTemp: 0,
                            totalPrecipitation: 0,
                            totalMinTemp: 0,
                            totalMaxTemp: 0,
                        };
                    }

                    acc[monthKey].count += 1;
                    acc[monthKey].totalAvgTemp += parseFloat(item.avgTa) || 0;
                    acc[monthKey].totalPrecipitation += parseFloat(item.sumRn) || 0;
                    acc[monthKey].totalMinTemp += parseFloat(item.minTa) || 0;
                    acc[monthKey].totalMaxTemp += parseFloat(item.maxTa) || 0;

                    return acc;
                }, {});

                // 월별 평균 계산 및 year/month 필드 분리
                const formattedData = Object.entries(monthlyData).map(([month, data]) => {
                    const [year, monthNum] = month.split('-'); // 월 데이터 분리
                    return {
                        year: parseInt(year),
                        month: parseInt(monthNum),
                        AvgTemp: (data.totalAvgTemp / data.count).toFixed(2),
                        Precipitation: (data.totalPrecipitation / data.count).toFixed(2),
                        MinTemp: (data.totalMinTemp / data.count).toFixed(2),
                        MaxTemp: (data.totalMaxTemp / data.count).toFixed(2),
                    };
                });

                console.log(formattedData); // 콘솔에 출력

                // 출력된 데이터들을 MongoDB에 저장
                await saveToMongoDB(formattedData);
            }
        } catch (e) {
            console.error('JSON Parse Error:', e);
        }
    } else {
        console.error('Request failed with status code:', response ? response.statusCode : 'Unknown');
    }
});
