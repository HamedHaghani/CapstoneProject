

// export default BadgeEntryPage;
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GetLabel } from "../LanguageManager";
import { BackButton } from "./BackButton";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import "./BadgeEntryPage.css";

const shiftActions = ["startShift", "endShift", "startBreak", "endBreak"];
const viewActions = ["viewPayments", "viewProfile", "viewSchedules"];

const BadgeEntryPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentCulture = searchParams.get("culture") || "en";
  const action = searchParams.get("action") || "default";

  const [badge, setBadge] = useState("");
  const [responseType, setResponseType] = useState(null);

  const handleBadgeSubmit = () => {
    if (!badge) return;

    if (viewActions.includes(action)) {
      navigate(`/employee-${action}?badge=${badge}&culture=${currentCulture}`);
      return;
    }

    const response = badge === "1234" ? "good_punch" : "bad_punch";
    setResponseType(response === "good_punch" ? "good" : "bad");
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
          <button
            key={item}
            className="number-btn"
            onClick={() => handleNumberClick(item)}
          >
            {item}
          </button>
        ))}
        <button className="clear-btn" onClick={handleClear}>
          C
        </button>
        <button className="backspace-btn" onClick={handleBackspace}>
          &#9003;
        </button>
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
            <p>
              {responseType === "good"
                ? `${GetLabel(
                    "Labels.function.punchAccepted",
                    currentCulture
                  )}: ${GetLabel("Labels.function." + action, currentCulture)}`
                : `${GetLabel(
                    "Labels.function.punchRejected",
                    currentCulture
                  )}: ${GetLabel("Labels.function." + action, currentCulture)}`}
            </p>
            <button className="close-btn" onClick={closeModal}>
              {GetLabel("Labels.function.close", currentCulture)}
            </button>
          </div>
        </div>
      )}

      <BackButton
        handleBackButton={() => navigate("/")}
        currentCulture={currentCulture}
      />
    </div>
  );
};

export default BadgeEntryPage;
