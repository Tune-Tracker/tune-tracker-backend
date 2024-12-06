from dotenv import load_dotenv
import os
import pymongo
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error
import seaborn as sns
import matplotlib.pyplot as plt

load_dotenv()

# MongoDB 연결
print("Connecting to MongoDB...")
client = pymongo.MongoClient(os.getenv('MONGO_URI'))  # MongoDB URI
db = client["monthlyData"]  # 데이터베이스 이름
elect_collection = db["monthlyElect"]  # 전력 데이터 컬렉션
weather_collection = db["monthlyWeather"]  # 날씨 데이터 컬렉션

# MongoDB에서 데이터 가져오기
print("Fetching data from MongoDB...")
elect_data = pd.DataFrame(list(elect_collection.find()))
weather_data = pd.DataFrame(list(weather_collection.find()))

print(f"Electricity data shape: {elect_data.shape}")
print(f"Weather data shape: {weather_data.shape}")

# 데이터 병합
print("Merging data on 'month' key...")
data = pd.merge(elect_data, weather_data, on="month")

# 병합 후 컬럼 확인
print(f"Columns in merged data: {data.columns.tolist()}")

# 계절 변수 추가
print("Adding season feature...")
def determine_season(month):
    if month in [12, 1, 2]:
        return 'winter'
    elif month in [3, 4, 5]:
        return 'spring'
    elif month in [6, 7, 8]:
        return 'summer'
    else:
        return 'fall'

data['season'] = data['month'].apply(determine_season)

# avgTemp와 precipitation 컬럼을 숫자형으로 변환
data['avgTemp'] = pd.to_numeric(data['avgTemp'], errors='coerce')
data['precipitation'] = pd.to_numeric(data['precipitation'], errors='coerce')

# 결측치 확인 및 처리
print("Checking and dropping missing values...")
if data.isnull().sum().any():
    print(f"Missing values found:\n{data.isnull().sum()}")
data.dropna(inplace=True)
print(f"Final data shape after cleaning: {data.shape}")

# 파생 변수 추가 (기온 * 강수량 상호작용)
print("Adding interaction feature between avgTemp and precipitation...")
if 'avgTemp' in data.columns and 'precipitation' in data.columns:
    data['temp_precip_interaction'] = data['avgTemp'] * data['precipitation']
else:
    raise ValueError("Required columns 'avgTemp' or 'precipitation' are missing!")

# 필요한 컬럼 확인
print("Validating required columns...")
columns_to_include = ["totalPowerUsage", "totalBill", "avgTemp", "precipitation", "temp_precip_interaction"]
if not all(col in data.columns for col in columns_to_include):
    missing_cols = [col for col in columns_to_include if col not in data.columns]
    raise ValueError(f"Missing columns in data: {missing_cols}")

data = data[columns_to_include]

# 상관관계 히트맵
print("Visualizing correlation matrix...")
sns.heatmap(data.corr(), annot=True, cmap="coolwarm")
plt.title("Feature Correlation Heatmap")
plt.show()

# 독립 변수(X)와 종속 변수(y) 설정
X = data[["avgTemp", "precipitation", "totalBill", "temp_precip_interaction"]]  # 추가된 파생 변수 포함
y = data["totalPowerUsage"]  # 전력 사용량

# 데이터 분리 (80% 학습, 20% 테스트)
print("Splitting data into training and testing sets...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 랜덤 포레스트 모델 초기화
print("Initializing Random Forest Regressor...")
model = RandomForestRegressor(n_estimators=100, random_state=42)

# 모델 학습
print("Training the model...")
model.fit(X_train, y_train)

# 예측
print("Making predictions...")
y_pred = model.predict(X_test)

# 성능 평가
print("Evaluating model performance...")
mae = mean_absolute_error(y_test, y_pred)
print(f"Mean Absolute Error (MAE): {mae:.2f}")

# 테스트 데이터와 예측값 출력
result = pd.DataFrame({
    "Actual": y_test.values,
    "Predicted": y_pred
})
print("Predictions:")
print(result)

# 피처 중요도 출력
print("Feature Importance (Relative Importance of Features in Prediction):")
feature_importances = pd.Series(model.feature_importances_, index=X.columns)
print(feature_importances.sort_values(ascending=False))
