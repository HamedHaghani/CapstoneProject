import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GetLabel } from "../LanguageManager";
import { BackButton } from "./BackButton";
import "./BadgeEntryPage.css";
import { API_BASE_URL } from "../config";


// const API_URL = "http://localhost:8080/api"; // Backend API base URL

const API_URL = `${API_BASE_URL}/api`;


const shiftActions = {
  startShift: "/shifts/start",
  endShift: "/shifts/end",
  startBreak: "/shifts/start-break",
  endBreak: "/shifts/end-break",
};

const viewActions = {
  viewProfile: "/employee-viewProfile",
  viewPayments: "/employee-payments",
  viewSchedules: "/employee-viewSchedules",
};

const BadgeEntryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentCulture = searchParams.get("culture") || "en";
  const action = searchParams.get("action") || "default";

  const [badge, setBadge] = useState("");

  const handleBadgeSubmit = async () => {
    if (!badge) {
      alert("Please enter your badge number first!");
      return;
    }

    // 🔍 Redirect for view actions
    if (viewActions[action]) {
      navigate(`${viewActions[action]}?badge=${badge}&culture=${currentCulture}`);
      return;
    }

    // 🔧 Handle shift actions
    let endpoint = shiftActions[action];
    if (!endpoint) {
      alert("Invalid action selected.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ badgeNumber: badge }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText);
      }

      alert(
        `${GetLabel("Labels.function.punchAccepted", currentCulture)}: ${GetLabel(
          "Labels.function." + action,
          currentCulture
        )}`
      );
    } catch (error) {
      const message = error.message;

      // ✅ Custom schedule-based alerts
      if (message.includes("not scheduled")) {
        alert("⛔ You are not scheduled to work at this time. Please check with your manager.");
      } else if (message.includes("No active shift")) {
        alert("❌ You must start a shift before performing this action.");
      } else if (message.includes("Break")) {
        alert("⚠️ Break error: " + message);
      } else {
        alert(message || "An unexpected error occurred");
      }

      console.error("API Error:", error);
    }
  };

  const handleNumberClick = (num) => {
    setBadge((prev) => (prev.length < 10 ? prev + num : prev));
  };

  return (
    <div className="badge-entry-page">
      <h2>{GetLabel("Labels.function.enterBadge", currentCulture)}</h2>
      <div className="badge-display">{badge || "----"}</div>

      <div className="number-pad">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((item) => (
          <button key={item} className="number-btn" onClick={() => handleNumberClick(item)}>
            {item}
          </button>
        ))}
        <button className="clear-btn" onClick={() => setBadge("")}>C</button>
        <button className="backspace-btn" onClick={() => setBadge((prev) => prev.slice(0, -1))}>&#9003;</button>
      </div>

      <button className="submit-btn" onClick={handleBadgeSubmit}>
        {GetLabel("Labels.function.submitBadge", currentCulture)}
      </button>

      <BackButton
  handleBackButton={() => {
    if (window.history.length > 2) {
      navigate(-1); // Go back if there's history
    } else {
      navigate("/main"); // Fallback if no real history
    }
  }}
  currentCulture={currentCulture}
/>

    </div>
  );
};

export default BadgeEntryPage;
