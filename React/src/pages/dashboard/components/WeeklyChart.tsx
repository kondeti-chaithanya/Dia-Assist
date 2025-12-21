import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import api from "@/api/axiosConfig";

interface CheckupData {
  [key: string]: string | number;
}

const COLORS = [
  "#20c997",
  "#f59f00",
  "#ff6b6b",
  "#4c6ef5",
  "#a78bfa",
  "#06b6d4",
];

const WeeklyChart = () => {
  const [data, setData] = useState<CheckupData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [numericKeys, setNumericKeys] = useState<string[]>([]);
  const [xAxisKey, setXAxisKey] = useState<string>("check");

  useEffect(() => {
    api
      .get("api/graph/last-checks") // 🔥 JWT-based, no userId
      .then((res) => {
        console.log("📊 Graph response:", res.data);

        if (!Array.isArray(res.data) || res.data.length === 0) {
          setError("No checkup data available");
          setData([]);
          return;
        }

        setData(res.data);

        const firstRow = res.data[0];

        // detect numeric columns dynamically
        const numKeys = Object.keys(firstRow).filter((key) => {
          const value = firstRow[key];
          return (
            typeof value === "number" &&
            !["id", "userId", "user_id"].includes(key)
          );
        });

        setNumericKeys(numKeys);

        // prefer "check" on X-axis
        setXAxisKey(firstRow["check"] ? "check" : Object.keys(firstRow)[0]);

        setError(null);
      })
      .catch((err) => {
        console.error("❌ Graph fetch error:", err);

        if (err.response?.status === 401) {
          setError("Unauthorized. Please login again.");
        } else {
          setError("Failed to load graph data");
        }

        setData([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading chart...</p>;
  if (error) return <p className="error-message">⚠️ {error}</p>;
  if (!data.length) return <p>No checkup data available</p>;

  return (
    <div style={{ width: "100%", height: 320 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={xAxisKey} />
          <YAxis domain={[0, "auto"]} />
          <Tooltip />
          <Legend />

          {numericKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
              name={
                key === "hba1c"
                  ? "HbA1c"
                  : key === "glucose"
                  ? "Blood Glucose"
                  : key
              }
              dot={{ r: 4 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyChart;
