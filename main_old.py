from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import os
import pandas as pd
import pymongo
import joblib
from dotenv import load_dotenv
import json
from bson import ObjectId

# 환경 변수 로드
load_dotenv()

# MongoDB 연결 URI
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    raise ValueError("MONGO_URI is not set in the environment variables.")

# MongoDB 클라이언트 초기화
client = pymongo.MongoClient(MONGO_URI)

# 데이터베이스와 컬렉션 선택
db = client["monthlyData"]
elect_collection = db["monthlyElect"]
weather_collection = db["monthlyWeather"]

# FastAPI 초기화
app = FastAPI()

# 모델 로드
model_path = 'random_forest_model_with_season.pkl'
if os.path.exists(model_path):
    model = joblib.load(model_path)
else:
    raise FileNotFoundError(f"Model file not found: {model_path}")

# Custom JSON Encoder for ObjectId
class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)

# Pydantic 데이터 모델
class PredictionRequest(BaseModel):
    avgTemp: float
    precipitation: float
    season: str

class BulkPredictionRequest(BaseModel):
    data: List[PredictionRequest]

@app.get("/")
async def root():
    return {"message": "Power usage prediction API is running!"}

@app.get("/data-summary")
async def data_summary():
    try:
        # MongoDB에서 데이터 가져오기
        elect_data = list(elect_collection.find())
        weather_data = list(weather_collection.find())

        # 데이터 유효성 검사
        if not elect_data:
            raise HTTPException(status_code=404, detail="Electricity data is empty in the database.")
        if not weather_data:
            raise HTTPException(status_code=404, detail="Weather data is empty in the database.")

        # DataFrame 변환
        elect_df = pd.DataFrame(elect_data)
        weather_df = pd.DataFrame(weather_data)

        # 디버깅: 데이터 구조 확인
        print("Electricity DataFrame Columns:", elect_df.columns.tolist())
        print("Weather DataFrame Columns:", weather_df.columns.tolist())
        print("Electricity Data Sample:\n", elect_df.head())
        print("Weather Data Sample:\n", weather_df.head())

        # 'year'와 'month' 필드 타입 통일
        elect_df["year"] = elect_df["year"].astype(int)
        elect_df["month"] = elect_df["month"].astype(int)
        weather_df["year"] = weather_df["year"].astype(int)
        weather_df["month"] = weather_df["month"].astype(int)

        # 병합: 'year'와 'month'를 기준으로 병합
        merged_data = pd.merge(elect_df, weather_df, on=["year", "month"], how="inner")

        # 디버깅: 병합된 데이터 확인
        print("Merged DataFrame Columns:", merged_data.columns.tolist())
        print("Merged Data Sample:\n", merged_data.head())

        # 병합 후 데이터 샘플 반환
        return {
            "electricity_data_columns": elect_df.columns.tolist(),
            "weather_data_columns": weather_df.columns.tolist(),
            "merged_data_sample": merged_data.head(5).to_dict(orient="records"),
        }
    except KeyError as e:
        print("KeyError encountered:", str(e))
        raise HTTPException(status_code=500, detail=f"KeyError: {str(e)}")
    except Exception as e:
        print("Unexpected error:", str(e))
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")

@app.post("/predict")
async def predict_power_usage(request: PredictionRequest):
    # 계절 인코딩
    seasons = ["spring", "summer", "winter"]
    season_encoded = [1 if request.season == s else 0 for s in seasons]
    
    input_data = pd.DataFrame([[
        request.avgTemp,
        request.precipitation,
        *season_encoded
    ]], columns=["avgTemp", "precipitation", "season_spring", "season_summer", "season_winter"])
    
    # 예측
    try:
        prediction = model.predict(input_data)[0]
        return {"predicted_power_usage": round(prediction, 2)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/bulk-predict")
async def bulk_predict_power_usage(request: BulkPredictionRequest):
    results = []
    for data in request.data:
        try:
            # 각 요청을 단일 예측으로 처리
            result = await predict_power_usage(data)
            results.append(result)
        except Exception as e:
            results.append({"error": str(e)})
    return results
