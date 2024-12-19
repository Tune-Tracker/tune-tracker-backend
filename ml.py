from dotenv import load_dotenv
import os
import pymongo
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error
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

# 필요한 컬럼 선택
data = data[["averagePowerUsage", "avgTemp", "minTemp", "maxTemp", "precipitation", "month", "avgRhm"]]
data.dropna(inplace=True)  # 결측값 제거

# 월 변수 원-핫 인코딩
data = pd.get_dummies(data, columns=["month"], prefix="month", drop_first=False)

# 상관관계 분석
correlation_matrix = data.corr()
print("Correlation Matrix:")
print(correlation_matrix)

# 상관관계 히트맵 시각화
import seaborn as sns
import matplotlib.pyplot as plt
plt.figure(figsize=(15, 10))  # 크기를 월 변수 증가에 맞게 조정
sns.heatmap(correlation_matrix, annot=True, cmap="coolwarm", fmt=".2f")
plt.title("Feature Correlation Heatmap")
plt.show()

# 독립 변수(X)와 종속 변수(y) 설정
X = data.drop(columns=["averagePowerUsage"])  # "totalPowerUsage"는 종속 변수로 제외
y = data["averagePowerUsage"]

# 데이터 분리
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 모델 학습 및 저장
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)
joblib.dump(model, 'random_forest_model_with_month.pkl')
print("Model saved as 'random_forest_model_with_month.pkl'")
