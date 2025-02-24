import React from "react";
import "./CircleButton.css";

const CircleButton = ({ icon, label, onClick }) => {
  return (
    <div className="button-wrapper" onClick={onClick}>
      <div className="circle">
        <div className="icon">{icon}</div>
      </div>
      <div className="label">{label}</div>
    </div>
  );
};

export default CircleButton;
