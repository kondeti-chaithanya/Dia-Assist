import React, { useEffect, useState } from "react";
import "../styles/Dashboard.css";
import StatsCard from "./StatsCard";
import { useNavigate } from "react-router-dom";
import WeeklyChart from "./WeeklyChart";
import api from "@/api/axiosConfig";
 
interface HistoryItem {
  date: string;
  bloodGlucose: number;
  hba1c: number;
}
 
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
 
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    api
      .get("/prediction/history")
      .then((res) => {
        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];
 
        const mapped = data.map((item: any) => ({
          date: item.date,
          bloodGlucose:
            item.bloodGlucose ??
            item.blood_glucose ??
            item.blood_glucose_level ??
            0,
          hba1c:
            item.hba1c ??
            item.HbA1c_level ??
            item.hba1cLevel ??
            0,
        }));
 
        // sort old → new
        mapped.sort(
          (a: HistoryItem, b: HistoryItem) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );
 
 
        setHistory(mapped);
      })
      .catch((err) => {
        console.error("Dashboard history fetch failed", err);
      })
      .finally(() => setLoading(false));
  }, []);
 
  const latest = history.length > 0 ? history[history.length - 1] : null;
 
  return (
    <div className="dashboard-container">
      <h1 className="dash-title">Dashboard</h1>
      <h4 className="dash-subtitle">
        Track your health metrics and diabetes risk over time 
      </h4>

      <section className="last-checkups-section">
  <div className="last-checkups-header">
    <div className="last-icon">📈</div>

    <div className="last-checkups-text">
      <h2><b>Last Checkup </b></h2>
      <p> <b>Overview of your recent health metrics</b></p>
    </div>
  </div>
      {/* ===== STATS CARDS ===== */}
      <div className="cards-row">
        <StatsCard
          title="HBA1C Level"
          value={loading ? "--" : latest ? latest.hba1c.toString() : "--"}
          desc=""
          icon="📉"
        />
 
        <StatsCard
          title="Glucose Level"
          value={
            loading
              ? "--"
              : latest
                ? `${latest.bloodGlucose} mg/dL`
                : "--"
          }
          desc=""
          icon="💚"
        />
 
        <StatsCard
          title="Last Checkup"
          value={
            loading
              ? "--"
              : latest
                ? new Date(latest.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })
                : "--"
          }
          desc=""
          icon="📅"
        />
 
        <StatsCard
          title="Total Assessments"
          value={loading ? "--" : history.length.toString()}
          desc=""
          icon="📈"
        />
      </div>
        </section>
 
      {/* ===== MIDDLE ROW ===== */}
      <div className="middle-row">
        <div className="trend-box">
          <h2>Weekly Health Trends</h2>
          <p>Track your risk score and glucose levels over the past week</p>
          <WeeklyChart />
        </div>
 
        <div className="quick-actions">
          <h2>Quick Actions</h2>
 
          <button onClick={() => navigate("/predict")} className="action-btn">
           <b> New Prediction → </b>
          </button>
 
          <button onClick={() => navigate("/diet")} className="action-btn">
           <b> View Diet Plans →</b>
          </button>
 
          <button onClick={() => navigate("/history")} className="action-btn">
           <b> View History →</b>
          </button>
        </div>
      </div>
    </div>
  );
};
 
export default Dashboard;