from dotenv import load_dotenv
import os
import pymongo
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error
import joblib

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

# 계절 변수 추가 함수
def determine_season(month):
    if month in [12, 1, 2]:
        return 'winter'
    elif month in [3, 4, 5]:
        return 'spring'
    elif month in [6, 7, 8]:
        return 'summer'
    else:
        return 'fall'

# 계절 변수 추가
data['season'] = data['month'].apply(determine_season)

# 필요한 컬럼 선택
data = data[["totalPowerUsage", "avgTemp", "precipitation", "season"]]
data.dropna(inplace=True)

# 계절 변수 원-핫 인코딩
data = pd.get_dummies(data, columns=["season"], drop_first=True)

# 상관관계 분석
correlation_matrix = data.corr()
print("Correlation Matrix:")
print(correlation_matrix)

# 상관관계 히트맵 시각화
import seaborn as sns
import matplotlib.pyplot as plt
plt.figure(figsize=(10, 8))
sns.heatmap(correlation_matrix, annot=True, cmap="coolwarm", fmt=".2f")
plt.title("Feature Correlation Heatmap")
plt.show()

# 독립 변수(X)와 종속 변수(y) 설정
X = data[["avgTemp", "precipitation", "season_spring", "season_summer", "season_winter"]]
y = data["totalPowerUsage"]

# 데이터 분리
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 모델 학습 및 저장
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)
joblib.dump(model, 'random_forest_model_with_season.pkl')
print("Model saved as 'random_forest_model_with_season.pkl'")

# # 모델 불러오기
# loaded_model = joblib.load('random_forest_model_with_season.pkl')
# print("Model loaded successfully!")

# # 예측
# y_pred = loaded_model.predict(X_test)
# mae = mean_absolute_error(y_test, y_pred)
# print(f"Mean Absolute Error: {mae:.2f}")

# # 테스트 데이터와 예측값 출력
# result = pd.DataFrame({
#     "Actual": y_test.values,
#     "Predicted": y_pred
# })
# print(result)

# # 새로운 데이터 예측
# new_data = pd.DataFrame({
#     "temperature": [25],      # 예: 25°C
#     "rainfall": [10],         # 예: 10mm
#     "season_spring": [0],     # 예: 여름(봄 아님)
#     "season_summer": [1],     # 예: 여름
#     "season_winter": [0]      # 예: 겨울 아님
# })
# predicted_usage = loaded_model.predict(new_data)
# print(f"Predicted Power Usage: {predicted_usage[0]:.2f}")
