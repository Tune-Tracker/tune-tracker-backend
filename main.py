import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import os

# FastAPI 초기화
app = FastAPI()

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 요청을 허용할 출처
    allow_credentials=True,
    allow_methods=["*"],  # 모든 메소드 허용 (GET, POST 등)
    allow_headers=["*"],  # 모든 헤더 허용
)

# 로깅 설정
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# 모델 로드
model_path = 'random_forest_model_with_month.pkl'
if os.path.exists(model_path):
    model = joblib.load(model_path)
else:
    raise FileNotFoundError(f"Model file not found: {model_path}")

# Pydantic 데이터 모델
class PredictionRequest(BaseModel):
    avgTemp: float
    minTemp: float
    maxTemp: float
    precipitation: float
    avgRhm: float
    month: int  # 월 정보 추가 (1~12)

class BillPredictionRequest(BaseModel):
    usage: float

# 모델 로드 (앱 시작 시)
bill_model = joblib.load('bill_model.pkl')

@app.post("/predictbill")
async def predict_bill_from_usage(request: BillPredictionRequest):
    # 입력데이터 DataFrame화
    input_df = pd.DataFrame([[request.usage]], columns=["averagePowerUsage"])
    logger.debug(f"Input data for bill prediction: {input_df}")

    # 예측
    try:
        predicted_bill = bill_model.predict(input_df)[0]
        logger.debug(f"Predicted Bill: {predicted_bill}")
        return {"predicted_bill": round(predicted_bill, 2)}
    except Exception as e:
        logger.error(f"Error during bill prediction: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Bill Prediction failed: {str(e)}")
    
@app.get("/")
async def root():
    return {"message": "Power usage prediction API is running!"}

@app.post("/predict")
async def predict_power_usage(request: PredictionRequest):
    # 월 원-핫 인코딩
    months = [f"month_{i}" for i in range(1, 13)]
    month_encoded = [1 if request.month == i else 0 for i in range(1, 13)]
    
    # 입력 데이터 준비
    input_data = pd.DataFrame([[
        request.avgTemp,
        request.minTemp,
        request.maxTemp,
        request.precipitation,
        request.avgRhm,
        *month_encoded
    ]], columns=["avgTemp", "minTemp", "maxTemp", "precipitation", "avgRhm", *months])
    
    # 입력 데이터 로깅
    logger.debug(f"Input data: {input_data}")
    
    # 예측
    try:
        prediction = model.predict(input_data)[0]
        logger.debug(f"Prediction: {prediction}")
        return {"predicted_power_usage": round(prediction, 2)}
    except Exception as e:
        logger.error(f"Error during prediction: {str(e)}")  # 예외를 로그로 출력
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
