import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GetLabel } from "../LanguageManager";
import { BackButton } from "./BackButton";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "./BadgeEntryPage.css";

const API_URL = "http://localhost:8080/api/shifts"; // Backend API base URL

const BadgeEntryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentCulture = searchParams.get("culture") || "en";
  const action = searchParams.get("action") || "default";

  const [badge, setBadge] = useState("");
  const [responseType, setResponseType] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");

  // Mapping actions to backend endpoints
  const shiftActions = {
    startShift: "/start",
    endShift: "/end",
    startBreak: "/start-break",
    endBreak: "/end-break",
  };

  // Function to handle API calls based on badge number and action
  const handleBadgeSubmit = async () => {
    if (!badge) {
      setResponseMessage("Please enter your badge number first! ❌");
      setResponseType("bad");
      return;
    }

    // Check if the action is valid
    const endpoint = shiftActions[action];
    if (!endpoint) {
      setResponseMessage("Invalid action selected ❌");
      setResponseType("bad");
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

      // Success response
      setResponseType("good");
      setResponseMessage(
        `${GetLabel("Labels.function.punchAccepted", currentCulture)}: ${GetLabel(
          "Labels.function." + action,
          currentCulture
        )}`
      );
    } catch (error) {
      console.error("API Error:", error);
      setResponseType("bad");
      setResponseMessage(error.message || "An error occurred ❌");
    }
  };

  const handleNumberClick = (num) => {
    setBadge((prev) => (prev.length < 10 ? prev + num : prev));
  };

  const handleClear = () => setBadge("");
  const handleBackspace = () => setBadge((prev) => prev.slice(0, -1));
  const closeModal = () => setResponseType(null);

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
        <button className="clear-btn" onClick={handleClear}>C</button>
        <button className="backspace-btn" onClick={handleBackspace}>&#9003;</button>
      </div>

      <button className="submit-btn" onClick={handleBadgeSubmit}>
        {GetLabel("Labels.function.submitBadge", currentCulture)}
      </button>

      {responseType && (
        <div className="modal-overlay">
          <div className={`modal ${responseType}`}>
            {responseType === "good" ? (
              <FaCheckCircle className="modal-icon success" />
            ) : (
              <FaTimesCircle className="modal-icon error" />
            )}
            <p>{responseMessage}</p>
            <button className="close-btn" onClick={closeModal}>
              {GetLabel("Labels.function.close", currentCulture)}
            </button>
          </div>
        </div>
      )}

      <BackButton handleBackButton={() => navigate("/")} currentCulture={currentCulture} />
    </div>
  );
};

export default BadgeEntryPage;
