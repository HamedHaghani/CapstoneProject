import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GetLabel } from "../LanguageManager";
import { BackButton } from "./BackButton";
import "./BadgeEntryPage.css";

const API_URL = "http://localhost:8080/api"; // Backend API base URL

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

  // Function to handle API calls based on badge number and action
  const handleBadgeSubmit = async () => {
    if (!badge) {
      alert("Please enter your badge number first!");
      return;
    }

    if (viewActions[action]) {
      // ✅ Corrected: Redirecting to the correct path with badgeNumber and culture
      navigate(`${viewActions[action]}?badge=${badge}&culture=${currentCulture}`);
      return;
    }

    // Handle shift-related actions (Start Shift, End Shift, etc.)
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
        throw new Error(await response.text());
      }

      // ✅ Added alert confirmation after successful shift punch
      alert(
        `${GetLabel("Labels.function.punchAccepted", currentCulture)}: ${GetLabel(
          "Labels.function." + action,
          currentCulture
        )}`
      );
    } catch (error) {
      console.error("API Error:", error);
      alert(error.message || "An error occurred");
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

      <BackButton handleBackButton={() => navigate("/")} currentCulture={currentCulture} />
    </div>
  );
};

export default BadgeEntryPage;
