from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import os

# FastAPI 초기화
app = FastAPI()

# 모델 로드
model_path = 'random_forest_model_with_season.pkl'
if os.path.exists(model_path):
    model = joblib.load(model_path)
else:
    raise FileNotFoundError(f"Model file not found: {model_path}")

# Pydantic 데이터 모델
class PredictionRequest(BaseModel):
    avgTemp: float
    precipitation: float
    avgRhm: float  # 습도 추가
    season: str

@app.get("/")
async def root():
    return {"message": "Power usage prediction API is running!"}

@app.post("/predict")
async def predict_power_usage(request: PredictionRequest):
    # 계절 인코딩
    seasons = ["spring", "summer", "fall" "winter"]
    season_encoded = [1 if request.season == s else 0 for s in seasons]
    
    input_data = pd.DataFrame([[
        request.avgTemp,
        request.precipitation,
        request.avgRhm,  # 습도 값 추가
        *season_encoded
    ]], columns=["avgTemp", "precipitation", "avgRhm", "season_spring", "season_summer", "seanson_fall" "season_winter"])
    
    # 예측
    try:
        prediction = model.predict(input_data)[0]
        return {"predicted_power_usage": round(prediction, 2)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
