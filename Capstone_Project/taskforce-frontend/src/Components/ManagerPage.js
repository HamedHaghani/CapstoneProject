import React, { useState, useEffect } from "react";
import "./ManagerPage.css";
import CircleButton from "./CircleButton";
import LanguagePicker from "./LanguagePicker"; // Import the LanguagePicker component
import { GetLabel } from "../LanguageManager";
import {
  FaCalendarAlt,
  FaMoneyBill,
  FaUsers,
  FaClock,
  FaTools,
  FaUser,
  FaArrowLeft, // Back arrow icon
} from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { BackButton } from "./BackButton";

const ManagerPage = () => {
  const [currentCulture, setCurrentCulture] = useState("en");
  const location = useLocation();
  const navigate = useNavigate();

  // Update the current language from query parameter
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const lang = queryParams.get("culture");
    if (lang) {
      setCurrentCulture(lang); // Set language from query param
    }
  }, [location]);

  const actions = [
    {
      name: "Labels.function.manageSchedules",
      icon: <FaCalendarAlt />,
      route: `/manage-schedules?action=schedules&culture=${currentCulture}`,
    },
    {
      name: "Labels.function.viewEmployees",
      icon: <FaUsers />,
      route: `/employee-list?culture=${currentCulture}`,
    },
    {
      name: "Labels.function.viewPayments",
      icon: <FaMoneyBill />,
      route: `/manage-payment?action=payment&culture=${currentCulture}`,
    },
    {
      name: "Labels.function.hoursWorked",
      icon: <FaClock />,
      route: `/hours-worked?culture=${currentCulture}`,
    },
    {
      name: "Labels.function.manageEmployees",
      icon: <FaTools />,
      route: `/manage-employees?culture=${currentCulture}`,
    },
    {
      name: "Labels.function.PastPunches",
      icon: <FaUser />,
      route: `/employee-punch-list?action=punches&culture=${currentCulture}`,
    },
    {
      name: "Labels.function.settings",
      icon: <FaTools />,
      route: `/config-page?culture=${currentCulture}`,
    },
  ];

  const handleLanguageChange = (newCulture) => {
    setCurrentCulture(newCulture); // Update the state
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("culture", newCulture);
    navigate(`${location.pathname}?${searchParams.toString()}`); // Update the URL
  };

  const handleBackButton = () => {
    navigate("/"); // Navigate to main page
  };

  return (
    <div className="manager-page">
      <h1 className="title">
        {GetLabel("Labels.page.manager", currentCulture)}
      </h1>

      {/* Top Bar with Language Picker */}
      <div className="top-bar">
        {/* Use the LanguagePicker component */}
        <LanguagePicker
          currentCulture={currentCulture}
          onLanguageChange={handleLanguageChange}
        />
      </div>

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

      <BackButton
        handleBackButton={handleBackButton}
        currentCulture={currentCulture}
      />
    </div>
  );
};

export default ManagerPage;
