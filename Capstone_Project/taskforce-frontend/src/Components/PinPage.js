import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GetLabel } from "../LanguageManager"; // Import GetLabel function
import { BackButton } from "./BackButton";
import "./PinPage.css"; // Your CSS for styling
import { FaArrowLeft } from "react-icons/fa"; // Back arrow icon (if used elsewhere)

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
      navigate(`/manager?culture=${currentCulture}`);
    } else {
      alert(GetLabel("Labels.pin.incorrectPin", currentCulture)); // Incorrect PIN alert
    }
  };

  const handleBackButton = () => {
    navigate("/"); // Navigate back to the main page
  };

  return (
    <div className="pin-page">
      <h2>{GetLabel("Labels.pin.enterPin", currentCulture)}</h2>

      {/* ✅ Show Manager Pass Code */}
      <p className="manager-pass">Manager Pass: <strong>1234</strong></p>

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
          &#9003;
        </button>
      </div>

      {/* Submit and Back buttons */}
      <div className="action-buttons">
        <button className="submit-btn" onClick={handleSubmit}>
          {GetLabel("Labels.button.submit", currentCulture)}
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
