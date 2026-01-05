import { useNavigate } from "react-router-dom";
import React, { useContext, useState, useEffect } from "react";
import { Activity, Shield, TrendingUp } from "lucide-react";
import "../styles/HeroSection.css";
import Works from "./Works"
import Modal from "@/global/components/modal/components/Modal";
import Login from "@/pages/auth/components/Login";
import Register from "@/pages/auth/components/Register";
import { AuthContext } from "@/auth/AuthContext";
 
const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);

  // AUTH MODAL
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  // Handle login modal event from Chatbot
  useEffect(() => {
    const handleOpenLoginModal = () => {
      console.log(" Login modal event received from Chatbot");
      setShowAuth(true);
      setIsLogin(true);
    };

    window.addEventListener("openLoginModal", handleOpenLoginModal);
    return () => {
      window.removeEventListener("openLoginModal", handleOpenLoginModal);
    };
  }, []);

  const handleProtectedNavigation = (path: string) => {
    if (!isAuthenticated) {
      setIsLogin(true);
      setShowAuth(true);
    } else {
      navigate(path);
    }
  };

  const features = [
    {
      icon: Activity,
      title: "ML Prediction",
      description: "Advanced machine learning algorithms analyze your health data",
    },
    {
      icon: TrendingUp,
      title: "Health Tracking",
      description: "Monitor your progress with weekly trend analysis",
    },
    {
      icon: Shield,
      title: "Diet Plans",
      description: "Personalized nutrition recommendations for your needs",
    },
  ];
 
  return (
    <section className="hero-section">
      <div className="hero-container text-center">
 
        {/* Badge */}
        <div className="badge-box animate-fade-in">
          <Activity size={18} className="me-2" />
          AI-Powered Diabetes Prediction
        </div>
 
        {/* Title */}
        <h1 className="hero-title animate-slide-up">
          Your Personal <span className="highlight">Diabetes</span> Health Assistant
        </h1>
 
        {/* Description */}
        <p className="hero-description animate-slide-up" style={{ animationDelay: "0.1s" }}>
          Predict diabetes risk with machine learning, get personalized diet plans,
          track your health journey and Track your progress and get assistance from chatbot.
        </p>
 
        {/* Buttons */}
        <div className="hero-buttons animate-slide-up" style={{ animationDelay: "0.2s" }}>
          <button 
            className="btn btn-primary btn-lg me-3"
            onClick={() => handleProtectedNavigation("/predict")}
          >
            Check Your Risk
          </button>
 
          <button 
            className="btn btn-outline-dark btn-lg"
            onClick={() => handleProtectedNavigation("/dashboard")}
          >
            View Dashboard
          </button>
        </div>
 
        <div className="features-section">
  <div className="features-grid mt-5">                            
    {features.map((item, index) => (
      <div
        key={index}
        className="feature-card animate-slide-up"
        style={{ animationDelay: `${0.3 + index * 0.1}s` }}
      >
        <div className="feature-icon">
          <item.icon size={26} />
        </div>
        <h3 className="feature-title">{item.title}</h3>
        <p className="feature-desc">{item.description}</p>
      </div>
    ))}
  </div>
</div>
 
      </div>
      <Works/>

      {/* AUTH MODAL */}
      <Modal isOpen={showAuth} onClose={() => setShowAuth(false)}>
        {isLogin ? (
          <Login
            switchToRegister={() => setIsLogin(false)}
            onSuccess={() => setShowAuth(false)}
          />
        ) : (
          <Register switchToLogin={() => setIsLogin(true)} />
        )}
      </Modal>
    </section>
   
  );
};
export default HeroSection;
 