
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
from xgboost import XGBClassifier
import joblib
from sklearn.metrics import confusion_matrix, classification_report, roc_auc_score, roc_curve

# Load dataset
data = pd.read_csv(r"D:\Train-data\diabetes_prediction_dataset.csv")

# Convert categorical columns
categorical_cols = ['gender', 'smoking_history']
data = pd.get_dummies(data, columns=categorical_cols, drop_first=True)

# Split
X = data.drop("diabetes", axis=1)
y = data["diabetes"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=427
)

# Train XGBoost model,(hyperparameters)
model = XGBClassifier(
    n_estimators=300,
    learning_rate=0.05,
    max_depth=5,
    eval_metric="logloss"
)

model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print("XGBoost Accuracy:", accuracy)

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred)
print("\nConfusion Matrix:")
print(cm)

# Classification Report (Precision, Recall, F1-score)
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

# ROC-AUC Score
# NOTE: For ROC-AUC we need probabilities
y_prob = model.predict_proba(X_test)[:, 1]
auc = roc_auc_score(y_test, y_prob)
print("\nROC-AUC Score:", auc)

# Save model
joblib.dump(model, "xgboost_diabetes.pkl")
print("Model saved as xgboost_diabetes.pkl")
