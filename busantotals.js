const { MongoClient } = require('mongodb');

const MONGO_URI = '';
const DB_NAME = 'powerUsage';
const COLLECTION_NAME = 'houseAve';
const OUTPUT_COLLECTION = 'busanTotals';

async function aggregateBusanData() {
    const client = new MongoClient(MONGO_URI);

    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);
        const outputCollection = db.collection(OUTPUT_COLLECTION);

        // 2018년 1월부터 2023년 12월까지 데이터 집계
        const pipeline = [
            {
                $match: {
                    metro: "부산광역시" // 부산광역시 데이터만 필터링
                }
            },
            {
                $group: {
                    
                    _id: { year: "$year", month: "$month" }, // 연도와 월별 그룹화
                    totalBill: { $sum: "$bill" }, // bill 합산
                    totalHouseCnt: { $sum: "$houseCnt" }, // houseCnt 합산
                    totalPowerUsage: { $sum: "$powerUsage" } // powerUsage 합산
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 } // 연도와 월 기준으로 정렬
            },
            {
                $project: {
                    year: "$_id.year",
                    month: { $toInt: "$_id.month" }, // month를 정수로 변환하여 1~12로 표현
                    totalBill: 1,
                    totalHouseCnt: 1,
                    totalPowerUsage: 1,
                    _id: 0
                }
            }
        ];

        // 집계 실행
        const result = await collection.aggregate(pipeline).toArray();

        // 결과를 새로운 컬렉션에 저장
        await outputCollection.insertMany(result);

        console.log("부산광역시 데이터를 월별로 합산하고 저장 완료!");
    } catch (error) {
        console.error("오류 발생:", error.message);
    } finally {
        await client.close();
    }
}

aggregateBusanData();
