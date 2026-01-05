
import React from "react";
import { Activity, TrendingUp, Heart, MessageSquare } from "lucide-react";
import "../styles/Works.css";

const Works: React.FC = () => {
  const steps = [
    {
      step: "01",
      icon: <Activity size={24} />,
      title: "Enter Your Data",
      desc: "Input your health parameters like glucose, BMI, and blood pressure",
    },
    {
      step: "02",
      icon: <TrendingUp size={24} />,
      title: "Get Prediction",
      desc: "Our ML model analyzes your data to predict diabetes risk",
    },
    {
      step: "03",
      icon: <Heart size={24} />,
      title: "Receive Plan",
      desc: "Get personalized diet and lifestyle recommendations",
    },
    {
      step: "04",
      icon: <MessageSquare size={24} />,
      title: "Stay Connected",
      desc: "Track your progress and get assistance from chatbot",
    },
  ];

  return (
    <section className="how-section">
      <div className="container">

        {/* Heading */}
        <h2 className="how-title">How Dia Assist Works</h2>
        <p className="how-subtitle">
          Our AI-powered platform makes diabetes prevention simple and accessible
        </p>

        {/* Cards */}
        <div className="how-grid">
          {steps.map((item, index) => (
            <div className="how-card" key={index}>
              <span className="how-step">{item.step}</span>

              <div className="how-icon">
                {item.icon}
              </div>

              <h4 className="how-card-title">{item.title}</h4>
              <p className="how-card-desc">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Works;


