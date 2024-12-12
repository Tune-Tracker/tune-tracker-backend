from dotenv import load_dotenv
import os
import pymongo
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import joblib

# 환경 변수 로드
load_dotenv()

# MongoDB 연결
client = pymongo.MongoClient(os.getenv('MONGO_URI'))
db = client["monthlyData"]
elect_collection = db["monthlyElect"]
weather_collection = db["monthlyWeather"]

# MongoDB에서 데이터 가져오기
elect_data = pd.DataFrame(list(elect_collection.find()))
weather_data = pd.DataFrame(list(weather_collection.find()))

# 데이터 병합
data = pd.merge(elect_data, weather_data, on="month")

# totalBill 예측을 위한 데이터 준비
# totalPowerUsage와 totalBill 컬럼이 elect_data에 존재한다고 가정
data_bill = data[["totalPowerUsage", "totalBill"]].dropna()

X_bill = data_bill[["totalPowerUsage"]]  # 독립변수: 전력사용량
y_bill = data_bill["totalBill"]          # 종속변수: 전력비용

X_train_b, X_test_b, y_train_b, y_test_b = train_test_split(X_bill, y_bill, test_size=0.2, random_state=42)

# 전력비용 예측 모델 학습
bill_model = RandomForestRegressor(n_estimators=100, random_state=42)
bill_model.fit(X_train_b, y_train_b)

# 모델 저장
joblib.dump(bill_model, 'bill_model.pkl')
print("Bill model saved as 'bill_model.pkl'")
