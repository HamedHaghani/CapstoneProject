import React, { useState, useEffect } from "react";
import "./MainPage.css";
import CircleButton from "./CircleButton";
import LanguagePicker from "./LanguagePicker";
import HelpButton from "./HelpButton";
import { GetLabel } from "../LanguageManager";
import { useNavigate } from "react-router-dom";
import {
  FaClock,
  FaUser,
  FaMoneyBill,
  FaCalendarAlt,
  FaPause,
  FaPlay,
} from "react-icons/fa";

const MainPage = () => {
  const [currentCulture, setCurrentCulture] = useState("en");
  const [showPopup, setShowPopup] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
  const timer = setTimeout(() => {
    setShowPopup(true); // Show the popup after 2 seconds
  }, 2000);

  return () => clearTimeout(timer); // Cleanup if component unmounts early
}, []);

  const actions = [
    {
      name: "Labels.function.startShift",
      icon: <FaPlay />,
      route: `/badge-entry?action=startShift&culture=${currentCulture}`,
    },
    {
      name: "Labels.function.endShift",
      icon: <FaClock />,
      route: `/badge-entry?action=endShift&culture=${currentCulture}`,
    },
    {
      name: "Labels.function.startBreak",
      icon: <FaPause />,
      route: `/badge-entry?action=startBreak&culture=${currentCulture}`,
    },
    {
      name: "Labels.function.endBreak",
      icon: <FaClock />,
      route: `/badge-entry?action=endBreak&culture=${currentCulture}`,
    },
    {
      name: "Labels.function.viewPayments",
      icon: <FaMoneyBill />,
      route: `/badge-entry?action=viewPayments&culture=${currentCulture}`,
    },
    {
      name: "Labels.function.viewProfile",
      icon: <FaUser />,
      route: `/badge-entry?action=viewProfile&culture=${currentCulture}`,
    },
    {
      name: "Labels.function.viewSchedules",
      icon: <FaCalendarAlt />,
      route: `/badge-entry?action=viewSchedules&culture=${currentCulture}`,
    },
  ];

  const handleLanguageChange = (newCulture) => {
    setCurrentCulture(newCulture);
  };

  const handleManagerRedirect = () => {
    navigate(`/pin?culture=${currentCulture}`);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="main-page">
      <h1 className="title">TaskForce</h1>

      {/* 🚨 Popup Box */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>📢 Welcome to TaskForce!</h2>
            <p>
  To use this app, you'll need a valid employee badge number. You can create new employees via the Manager Panel or use existing ones. Don’t forget to assign a schedule to each employee — without one, they won’t be able to start a shift.
</p>
            <button className="popup-close" onClick={handleClosePopup}>Close</button>
          </div>
        </div>
      )}

      {/* Top Bar */}
      <div className="top-bar">
        <button className="manager-button" onClick={handleManagerRedirect}>
          {GetLabel("Labels.function.manager", currentCulture)}
        </button>
        <LanguagePicker
          currentCulture={currentCulture}
          onLanguageChange={handleLanguageChange}
        />
      </div>

      <HelpButton currentCulture={currentCulture} />

      <div className="button-container">
        <div className="row">
          {actions.slice(0, 4).map((action, index) => (
            <CircleButton
              key={index}
              icon={action.icon}
              label={GetLabel(action.name, currentCulture)}
              onClick={() => navigate(action.route)}
            />
          ))}
        </div>
        <div className="row">
          {actions.slice(4).map((action, index) => (
            <CircleButton
              key={index}
              icon={action.icon}
              label={GetLabel(action.name, currentCulture)}
              onClick={() => navigate(action.route)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
