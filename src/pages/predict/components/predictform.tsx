import React, { useState } from "react";
import { Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../styles/predictform.css";
import api from "@/api/axiosConfig";

const Predict: React.FC = () => {
  const navigate = useNavigate();

  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [HbA1c_level, setHbA1cLevel] = useState("");
  const [blood_glucose_level, setBloodGlucoseLevel] = useState("");
  const [hypertension, setHypertension] = useState("");
  const [bmi, setBmi] = useState("");
  const [smoking_history, setSmokingHistory] = useState("");
  const [heart_disease, setHeartDisease] = useState("");

  const [predictionResult, setPredictionResult] = useState<string | null>(null);
  const [predictionValue, setPredictionValue] = useState<number | null>(null);
  const [whyThisResult, setWhyThisResult] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!age) newErrors.age = "Age is required";
    else if (Number(age) <= 0 || Number(age) > 120)
      newErrors.age = "Enter valid age (1–120)";

    if (!smoking_history) newErrors.smoking_history = "Please select smoking history";
    if (!heart_disease) newErrors.heart_disease = "Please select heart disease";
    if (!hypertension) newErrors.hypertension = "Please select hypertension";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setPredictionResult(null);
    setPredictionValue(null);

    const payload = {
      age: Number(age),
      gender: gender.toLowerCase(),
      smoking_history: smoking_history === "yes" ? "current" : "never",
      bmi: Number(bmi),
      HbA1c_level: Number(HbA1c_level),
      blood_glucose_level: Number(blood_glucose_level),
      hypertension: hypertension === "yes" ? 1 : 0,
      heart_disease: heart_disease === "yes" ? 1 : 0,
      other_diseases: [],
    };

    try {
      const response = await api.post("/prediction", payload);

      const predValue = Number(response.data.prediction);

      setPredictionResult(response.data.message);
      setPredictionValue(predValue);
      setWhyThisResult(response.data.why_this_result || null);

      localStorage.setItem("predictionData", JSON.stringify(response.data));
    } catch (error: any) {
      setPredictionResult("Prediction failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prediction-page">
      <h1 className="page-title">Diabetes Risk Prediction</h1>
      <p className="page-subtitle">
        Enter your health parameters to get an AI-powered diabetes risk assessment
      </p>

      <div className="prediction-card">
        <div className="card-header">
          <div className="icon-circle">
            <Activity size={28} />
          </div>
          <h2>Health Assessment</h2>
          <p>Enter your health parameters for diabetes risk prediction</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Gender */}
          <div className="form-row">
            <label htmlFor="gender" className="form-label">
              Gender :
            </label>
            <select
              id="gender"
              className="form-input"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
            >
              <option value="" disabled>Select</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
            </select>
          </div>

          {/* Age */}
          <div className="form-row">
            <label htmlFor="age" className="form-label">
              Age :
            </label>
            <input
              id="age"
              type="number"
              className="form-input"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              required
            />
            {errors.age && <span className="error-text">{errors.age}</span>}
          </div>

          {/* HbA1c */}
          <div className="form-row">
            <label htmlFor="hba1c" className="form-label">
              HBA1C (%) :
            </label>
            <input
              id="hba1c"
              type="number"
              className="form-input"
              value={HbA1c_level}
              onChange={(e) => setHbA1cLevel(e.target.value)}
              required
            />
          </div>

          {/* Glucose */}
          <div className="form-row">
            <label htmlFor="glucose" className="form-label">
              Glucose Level (mg/dL) :
            </label>
            <input
              id="glucose"
              type="number"
              className="form-input"
              value={blood_glucose_level}
              onChange={(e) => setBloodGlucoseLevel(e.target.value)}
              required
            />
          </div>

          {/* Smoking */}
          <div className="form-row">
            <label className="form-label">Smoking History :</label>
            <div className="simple-buttons">
              <button
                type="button"
                className={smoking_history === "yes" ? "active" : ""}
                onClick={() => setSmokingHistory("yes")}
              >
                Yes
              </button>
              <button
                type="button"
                className={smoking_history === "no" ? "active" : ""}
                onClick={() => setSmokingHistory("no")}
              >
                No
              </button>
            </div>
            {errors.smoking_history && (
              <span className="error-text">{errors.smoking_history}</span>
            )}
          </div>

          {/* Heart Disease */}
          <div className="form-row">
            <label className="form-label">Heart Disease :</label>
            <div className="simple-buttons">
              <button
                type="button"
                className={heart_disease === "yes" ? "active" : ""}
                onClick={() => setHeartDisease("yes")}
              >
                Yes
              </button>
              <button
                type="button"
                className={heart_disease === "no" ? "active" : ""}
                onClick={() => setHeartDisease("no")}
              >
                No
              </button>
            </div>
            {errors.heart_disease && (
              <span className="error-text">{errors.heart_disease}</span>
            )}
          </div>

          {/* Hypertension */}
          <div className="form-row">
            <label className="form-label">Hypertension :</label>
            <div className="simple-buttons">
              <button
                type="button"
                className={hypertension === "yes" ? "active" : ""}
                onClick={() => setHypertension("yes")}
              >
                Yes
              </button>
              <button
                type="button"
                className={hypertension === "no" ? "active" : ""}
                onClick={() => setHypertension("no")}
              >
                No
              </button>
            </div>
            {errors.hypertension && (
              <span className="error-text">{errors.hypertension}</span>
            )}
          </div>

          {/* BMI */}
          <div className="form-row">
            <label htmlFor="bmi" className="form-label">
              BMI :
            </label>
            <input
              id="bmi"
              type="number"
              className="form-input"
              value={bmi}
              onChange={(e) => setBmi(e.target.value)}
              required
            />
          </div>

          <button className="predict-btn" type="submit" disabled={loading}>
            <Activity size={18} />
            {loading ? " Predicting..." : " Get Prediction"}
          </button>

          {predictionValue !== null && (
            <div className="prediction-result">
              <h3>Prediction Result</h3>

              <p>
                <b>
                  {predictionValue === 1 ? "🔴 Diabetic" : "🟢 Non-Diabetic"}
                </b>
              </p>

              {predictionResult && (
                <p>
                  <strong>Message:</strong> {predictionResult}
                </p>
              )}

              <button
                type="button"
                className="view-diet-btn"
                onClick={() => navigate("/diet")}
              >
                View Diet Plans
              </button>

              {whyThisResult && (
                <div className="why-this-result">
                  <strong>Why this result?</strong>
                  <p>{whyThisResult}</p>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Predict;
