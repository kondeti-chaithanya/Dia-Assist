import React from "react";
import "../styles/DietPlanCard.css";
import { CheckCircle2, Flame } from "lucide-react";

export interface Meal {
  name: string;
  calories: number;
  foods: string[];
  time: string;
}

export interface DietPlan {
  id: string;
  name: string;
  description: string;
  category: "low-carb" | "balanced" | "vegetarian";
  meals: Meal[];
  totalCalories: number;
  benefits: string[];
}

interface DietPlanCardProps {
  plan: DietPlan;
  isRecommended?: boolean; 
}

const categoryConfig = {
  "low-carb": {
    icon: Flame,
    label: "Low Carb",
    badgeClass: "badge-low-carb",
  },
  balanced: {
    label: "Balanced",
    badgeClass: "badge-balanced",
  },
  vegetarian: {
    label: "Balanced",
    badgeClass: "badge-vegetarian",
  },
};

const DietPlanCard: React.FC<DietPlanCardProps> = ({ plan }) => {
  const config = categoryConfig[plan.category];

  return (
    <div className="diet-card">
      {/* Header */}
      <div className="diet-card-header">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className={`diet-badge ${config.badgeClass}`}>
            {config.label}
          </span>

          <span className="calories-text">
            {plan.totalCalories} kcal/day
          </span>
        </div>

        <h5 className="diet-title">{plan.name}</h5>
        <p className="diet-description">{plan.description}</p>
      </div>

      {/* Content */}
      <div className="diet-card-body">
        {/* Meals */}
        <div className="mb-4">
          <h6 className="section-title">Daily Meals</h6>

          {plan.meals.map((meal) => (
            <div
              key={`${meal.name}-${meal.time}`}
              className="meal-box"
            >
              <div className="d-flex justify-content-between mb-1">
                <div>
                  <strong>{meal.name}</strong>
                  <span className="meal-time"> ({meal.time})</span>
                </div>
                <span className="meal-cal">
                  {meal.calories} kcal
                </span>
              </div>

              <div className="meal-foods">
                {meal.foods.map((food) => (
                  <span
                    key={food}
                    className="food-badge"
                  >
                    {food}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div>
          <h6 className="section-title">Benefits</h6>
          <ul className="benefits-list">
            {plan.benefits.map((benefit) => (
              <li key={benefit}>
                <CheckCircle2 size={16} />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DietPlanCard;
