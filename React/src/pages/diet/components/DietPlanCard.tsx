import React from "react";
import "./DietPlanCard.css"
import {
  CheckCircle2,
  Flame,
  Leaf,
  Apple,
} from "lucide-react";
import "./DietPlanCard.css";

export interface Meal {
  name: string;
  calories: number;
  foods: string[];
  time: string;
}

export  interface DietPlan {
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
    icon: Apple,
    label: "Balanced",
    badgeClass: "badge-balanced",
  },
  vegetarian: {
    icon: Leaf,
    label: "Vegetarian",
    badgeClass: "badge-vegetarian",
  },
};

const DietPlanCard: React.FC<DietPlanCardProps> = ({
  plan,
  isRecommended,
}) => {
  const config = categoryConfig[plan.category];
  const Icon = config.icon;

  return (
    <div className={`diet-card ${isRecommended ? "recommended" : ""}`}>
      {/* Recommended Banner */}
      {isRecommended && (
        <div className="recommended-banner">
          Recommended for You
        </div>
      )}

      {/* Header */}
      <div className="diet-card-header">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className={`diet-badge ${config.badgeClass}`}>
            <Icon size={14} className="me-1" />
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

          {plan.meals.map((meal, index) => (
            <div key={index} className="meal-box">
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
                {meal.foods.map((food, i) => (
                  <span key={i} className="food-badge">
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
            {plan.benefits.map((benefit, index) => (
              <li key={index}>
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
