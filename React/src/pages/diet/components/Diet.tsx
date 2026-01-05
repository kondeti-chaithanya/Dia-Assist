import React, { useEffect, useState } from "react";
import DietPlanCard from "./DietPlanCard";
import "../styles/Diet.css";
import { mapBackendDietToUI } from "@/util/mapDietPlan";
 
const Diet: React.FC = () => {
  const [dietPlans, setDietPlans] = useState<any>(null);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    const storedData = localStorage.getItem("predictionData");
 
    if (storedData) {
      const parsed = JSON.parse(storedData);
      console.log(" Stored Prediction Data:", parsed);
 
      // Convert prediction safely to number
      const predictionValue = Number(parsed.prediction);
      console.log(
        " Prediction Value:",
        predictionValue,
        "Type:",
        typeof predictionValue
      );
 
      setPrediction(predictionValue);
 
      // Map diet plans when backend provided them (support both Diabetic and Non-Diabetic responses)
      if (parsed.diet_plan) {
        const mappedPlans = mapBackendDietToUI(parsed.diet_plan);
        console.log(" Mapped Diet Plans:", mappedPlans);
        setDietPlans(mappedPlans);
      } else {
        setDietPlans(null);
      }
    } else {
      console.log(" No prediction data found in localStorage");
    }
 
    setLoading(false);
  }, []);
 
  if (loading) {
    return <p className="text-center">Loading...</p>;
  }
 
  return (
    <div className="diet-page">
      <main className="container py-5">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="diet-title">Personalized Diet Plans</h1>
          <p className="diet-subtitle">
            Nutrition recommendations tailored to support healthy blood sugar
            levels and overall wellness
          </p>
        </div>
 
        {/* MAIN CONTENT (Same place for Diabetic & Non-Diabetic) */}
        <div className="diet-cards-wrapper">
          {/* (Removed Non-Diabetic celebratory message — diet plans will show if provided) */}
 
          {/* Show diet plan cards when backend provided them (works for both Diabetic & Non-Diabetic responses) */}
          {dietPlans && (
            <>
              <DietPlanCard plan={dietPlans.vegPlan} isRecommended={prediction === 1} />
              <DietPlanCard plan={dietPlans.nonVegPlan} />
            </>
          )}
 
          {/* No Prediction */}
          {prediction === null && (
            <p className="text-center">
              No prediction found. Please generate a prediction first.
            </p>
          )}
        </div>
 
        {/* Tips Section */}
        <div className="tips-section mt-5">
          <h2 className="text-center tips-title mb-4">
            General Nutrition Tips for Diabetes Prevention
          </h2>
 
          <div className="row g-4" style={{ rowGap: "24px", columnGap: "24px" }}>
            {[
              {
                title: "Choose Complex Carbs",
                description:
                  "Opt for whole grains, legumes, and vegetables over refined carbohydrates.",
              },
              {
                title: "Control Portions",
                description:
                  "Use smaller plates and be mindful of serving sizes.",
              },
              {
                title: "Stay Hydrated",
                description:
                  "Drink plenty of water and limit sugary beverages.",
              },
              {
                title: "Include Fiber",
                description:
                  "Aim for 25–30g of fiber daily from fruits and vegetables.",
              },
              {
                title: "Limit Added Sugars",
                description:
                  "Reduce foods with added sugars and sweetened drinks.",
              },
              {
                title: "Eat Regular Meals",
                description:
                  "Consistent meal timings help regulate blood sugar.",
              },
            ].map((tip, index) => (
              <div className="col-md-6 col-lg-4" key={index}>
                <div className="tip-card">
                  <h5 className="tip-title">{tip.title}</h5>
                  <p className="tip-text">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};
 
export default Diet;
 