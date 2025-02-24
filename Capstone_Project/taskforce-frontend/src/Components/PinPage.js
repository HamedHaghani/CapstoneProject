import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GetLabel } from "../LanguageManager"; // Import GetLabel function
import { BackButton } from "./BackButton";
import "./PinPage.css"; // Your CSS for styling
import {
  FaArrowLeft, // Back arrow icon
} from "react-icons/fa";
const PinPage = () => {
  const [pin, setPin] = useState("");
  const [currentCulture, setCurrentCulture] = useState("en"); // Default to 'en' (English)
  const navigate = useNavigate();
  const location = useLocation();

  // Update current culture from URL query parameter
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const culture = queryParams.get("culture");
    if (culture) {
      setCurrentCulture(culture); // Set language from query param
    }
  }, [location]);

  const handleButtonClick = (number) => {
    setPin((prevPin) => prevPin + number);
  };

  const handleDelete = () => {
    setPin((prevPin) => prevPin.slice(0, -1)); // Delete last character
  };

  const handleSubmit = () => {
    if (pin === "1234") {
      // Correct PIN - navigate to manager page
      navigate(`/manager?culture=${currentCulture}`); // Include current language in the URL
    } else {
      alert(GetLabel("Labels.pin.incorrectPin", currentCulture)); // Use GetLabel for incorrect PIN message
    }
  };

  const handleBackButton = () => {
    navigate("/"); // Navigate back to the main page
  };

  return (
    <div className="pin-page">
      <h2>{GetLabel("Labels.pin.enterPin", currentCulture)}</h2>

      {/* PIN input display */}
      <div className="pin-display">{pin}</div>

      <div className="number-pad">
        {/* Number buttons */}
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((number) => (
          <button
            key={number}
            onClick={() => handleButtonClick(number)}
            className="number-btn"
          >
            {number}
          </button>
        ))}

        {/* Delete button */}
        <button onClick={handleDelete} className="delete-btn">
          &#9003; {/* Unicode for delete/backspace */}
        </button>
      </div>

      {/* Submit and Back buttons */}
      <div className="action-buttons">
        <button className="submit-btn" onClick={handleSubmit}>
          {GetLabel("Labels.button.submit", currentCulture)}{" "}
          {/* Use GetLabel for submit button */}
        </button>
        <BackButton
          handleBackButton={handleBackButton}
          currentCulture={currentCulture}
        />
      </div>
    </div>
  );
};

export default PinPage;
