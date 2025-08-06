# train.py
from sklearn.datasets import load_diabetes
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score
import joblib
import pandas as pd

# Load the dataset
diabetes = load_diabetes(as_frame=True)
df = diabetes.frame

# Split features and target
X = df.drop(columns=['target'])
y = df['target']

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Build the Random Forest model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Predict
y_pred = model.predict(X_test)

# Evaluate
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print("✅ Model trained successfully")
print(f"📉 Mean Squared Error (MSE): {mse:.2f}")
print(f"📈 R^2 Score: {r2:.2f}")

# Save model
joblib.dump(model, 'diabetes_model.pkl')
print("💾 Model saved to diabetes_model.pkl")