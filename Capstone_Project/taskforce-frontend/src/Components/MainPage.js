import React, { useState } from "react";
import "./MainPage.css";
import CircleButton from "./CircleButton";
import LanguagePicker from "./LanguagePicker"; // Import the LanguagePicker
import { GetLabel } from "../LanguageManager";
import HelpButton from "./HelpButton"; // Import the HelpButton

import {
  FaClock,
  FaUser,
  FaMoneyBill,
  FaCalendarAlt,
  FaPause,
  FaPlay,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const MainPage = () => {
  const [currentCulture, setCurrentCulture] = useState("en"); // State for current language
  const navigate = useNavigate(); // Initialize navigate

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
    setCurrentCulture(newCulture); // Update state when language changes
  };

  const handleManagerRedirect = () => {
    // Pass the current culture as a query parameter when navigating to the PinPage
    navigate(`/pin?culture=${currentCulture}`); // Navigate with culture parameter
  };

  return (
    <div className="main-page">
      <h1 className="title">TaskForce</h1>

      {/* Top Bar with Language Picker and Manager Button */}
      <div className="top-bar">
        {/* Use the LanguagePicker component */}

        {/* Manager Button */}
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
              onClick={() => navigate(`${action.route}`)}
            />
          ))}
        </div>
        <div className="row">
          {actions.slice(4).map((action, index) => (
            <CircleButton
              key={index}
              icon={action.icon}
              label={GetLabel(action.name, currentCulture)}
              onClick={() => navigate(`${action.route}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainPage;
