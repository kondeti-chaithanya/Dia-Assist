import pandas as pd #raw data to structure dataframe
from sklearn.model_selection import train_test_split # Splits data into training and testing sets/Prevents overfitting
from sklearn.metrics import accuracy_score #calculate accuracy
from xgboost import XGBClassifier 
import joblib #Used to save and load ML models(pickle)
from sklearn.metrics import confusion_matrix, classification_report, roc_auc_score, roc_curve

# Load dataset
data = pd.read_csv(r"D:\Train-data\diabetes_prediction_dataset.csv")

# Convert categorical columns
categorical_cols = ['gender', 'smoking_history']
data = pd.get_dummies(data, columns=categorical_cols, drop_first=True)
#get_dummies:Convert categorical values into numerical format 
#drop_first=True: Avoid dummy variable


# Split, separating features and target variable
X = data.drop("diabetes", axis=1)
y = data["diabetes"]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=427
) # 80% train, 20% test and random_state for reproducibility 

# Train XGBoost model,(hyperparameters)
model = XGBClassifier(
    n_estimators=300, #number of trees
    learning_rate=0.05, #step size shrinkage / Smaller rate = better learning
    max_depth=5, #maximum depth of a tree
    eval_metric="logloss" 
    #Balanced model → avoids overfitting & underfitting
)

#Training the model
model.fit(X_train, y_train)

# making predictions
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred) # Calculate accuracy

# print("XGBoost Accuracy:", accuracy)

# Confusion Matrix
cm = confusion_matrix(y_test, y_pred) #it shows TP, TN, FP, FN
# print("\nConfusion Matrix:")
# print(cm)

# Classification Report (Precision(how accurate +ve predictions), Recall(diabetics called), F1-score)
# print("\nClassification Report:")
# print(classification_report(y_test, y_pred))

# ROC-AUC Score / Shows model reliability
# NOTE: For ROC-AUC we need probabilities
y_prob = model.predict_proba(X_test)[:, 1]
auc = roc_auc_score(y_test, y_prob)
# print("\nROC-AUC Score:", auc)

# Save model
joblib.dump(model, "xgboost_diabetes.pkl")
print("Model saved as xgboost_diabetes.pkl")
