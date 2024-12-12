from dotenv import load_dotenv
import os
import pymongo
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score
import joblib

# 환경 변수 로드
load_dotenv()

# MongoDB 연결
client = pymongo.MongoClient(os.getenv('MONGO_URI'))
db = client["monthlyData"]
elect_collection = db["monthlyElect"]
weather_collection = db["monthlyWeather"]

# 데이터 가져오기
elect_data = pd.DataFrame(list(elect_collection.find()))
weather_data = pd.DataFrame(list(weather_collection.find()))

# 데이터 병합
data = pd.merge(elect_data, weather_data, on="month")

# 필요한 컬럼 선택
data = data[["totalPowerUsage", "avgTemp", "minTemp", "maxTemp", "precipitation", "month", "avgRhm"]]
data.dropna(inplace=True)

# 월 변수 원-핫 인코딩
data = pd.get_dummies(data, columns=["month"], prefix="month", drop_first=False)

# 독립변수, 종속변수 설정
X = data.drop(columns=["totalPowerUsage"])
y = data["totalPowerUsage"]

# 데이터 분리
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 모델 로드
model = joblib.load('random_forest_model_with_month.pkl') 
# 혹은 모델을 새로 학습하려면 아래 코드 사용
# model = RandomForestRegressor(n_estimators=100, random_state=42)
# model.fit(X_train, y_train)

# 예측
y_pred = model.predict(X_test)

# 성능지표 계산
mae = mean_absolute_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("Mean Absolute Error (MAE):", mae)
print("R^2 Score:", r2)
