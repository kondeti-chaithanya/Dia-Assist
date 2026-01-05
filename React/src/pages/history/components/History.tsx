
import { useEffect, useState } from "react";
import api from "@/api/axiosConfig";
import "../styles/History.css";

interface HistoryItem {
  date: string;
  result: string;
  bloodGlucose: number;
  bmi: number;
  hba1c: number;
}

const History = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get("/prediction/history")
     .then((res) => {
  console.log(" Raw History Response:", res.data);
  
  // Handle if response is wrapped in a data property
  const dataArray = Array.isArray(res.data) ? res.data : res.data?.data || [];
  
  console.log(" Data Array:", dataArray);
  
  const mapped = dataArray.map((item: any) => ({
    date: item.date,          // LocalDateTime
    result: item.result,           // "1" or "0"

    //  SAFE FIELD MAPPING (covers all cases)
    bloodGlucose:
      item.bloodGlucose ??
      item.blood_glucose ??
      item.blood_glucose_level ??
      0,

    bmi: item.bmi ?? 0,

    hba1c:
      item.hba1c ??
      item.HbA1c_level ??
      item.hba1cLevel ??
      0,
  }));

  console.log(" Mapped History:", mapped);
  setHistory(mapped);
})

      .catch((err) => {
        console.error(" History fetch failed:", err);
        console.error(" Error response:", err.response?.data);
        console.error(" Error status:", err.response?.status);
        setError("Failed to load history: " + (err.response?.data?.message ||
          
          err.message));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="history-container"><p>Loading history...</p></div>;

  if (error) return <div className="history-container"><p className="error-message">⚠️ {error}</p></div>;

  return (
    <div className="history-container">
      <h2>Prediction History</h2>
      <p className="sub-text">Your past diabetes predictions</p>

      {history.length === 0 ? (
        <p className="no-data"> No history found. Make a prediction to start tracking!</p>
      ) : (
        <div className="table-box">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Result</th>
                <th>Glucose</th>
                <th>BMI</th>
                <th>HbA1c</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item, index) => {
                const isDiabetic = item.result === "1";

                return (
                  <tr key={index}>
                    <td>
                      {new Date(item.date).toLocaleDateString()}
                      <div className="time">
                        {new Date(item.date).toLocaleTimeString()}
                      </div>
                    </td>

                    <td>
                      <span
                        className={`risk ${isDiabetic ? "high" : "low"
                          }`}
                      >
                        {isDiabetic ? "Diabetic" : "Non-Diabetic"}
                      </span>
                    </td>

                    <td>{item.bloodGlucose}</td>
                    <td>{item.bmi}</td>
                    <td>{item.hba1c}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default History;


