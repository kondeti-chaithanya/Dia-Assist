
import React from "react";
import "./Footer.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Left Side */}
        <div className="footer-left">
          <div className="footer-logo">
            <span className="logo-icon"> <img
            src="/favicon.png"
            alt="logo"
          /></span>
            <span className="logo-text">Dia Assist</span>
          </div>
        </div>

        {/* Right Side */}
        <div className="footer-right">
          © 2025 Dia Assist. All rights reserved. Not a substitute for medical advice.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
