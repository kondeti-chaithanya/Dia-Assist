import React from "react";

interface Props {
  title: string;
  value: string|number;
  desc: string;
  icon: string;
}

const InfoCard: React.FC<Props> = ({ title, value, desc, icon }) => {
  return (
    <div className="info-card">
      <div className="info-left">
        <h4 className="card-title">{title}</h4>
        <h2 className="card-value">{value}</h2>
        <p className="card-desc">{desc}</p>
      </div>
      <div className="info-icon">{icon}</div>
    </div>
  );
};

export default InfoCard;
