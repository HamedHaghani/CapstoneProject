import React, { useState } from "react";
import PropTypes from "prop-types";
import { GetLabel } from "../LanguageManager"; // Import the label manager
import "./HelpButton.css"; // Import the CSS
import {
  FaQuestionCircle, // Back arrow icon
} from "react-icons/fa";

const HelpButton = ({ currentCulture }) => {
  const [isHelpVisible, setHelpVisible] = useState(false);

  const toggleHelpScreen = () => {
    setHelpVisible(!isHelpVisible);
  };

  return (
    <>
      {/* Help Button */}
      <button
        className="help-button-top"
        onClick={toggleHelpScreen}
        aria-label={GetLabel("Labels.button.back", currentCulture)}
      >
        {GetLabel("Labels.help.button", currentCulture)} <FaQuestionCircle />
      </button>

      {/* Help Overlay */}
      {isHelpVisible && (
        <div className="help-overlay">
          <div className="help-content">
            <h2>{GetLabel("Labels.help.title", currentCulture)}</h2>
            <ul>
              <li>
                <strong>
                  {GetLabel("Labels.help.question1.title", currentCulture)}
                </strong>
                <p>
                  {GetLabel("Labels.help.question1.answer", currentCulture)}
                </p>
              </li>
              <li>
                <strong>
                  {GetLabel("Labels.help.question2.title", currentCulture)}
                </strong>
                <p>
                  {GetLabel("Labels.help.question2.answer", currentCulture)}
                </p>
              </li>
              <li>
                <strong>
                  {GetLabel("Labels.help.question3.title", currentCulture)}
                </strong>
                <p>
                  {GetLabel("Labels.help.question3.answer", currentCulture)}
                </p>
              </li>
            </ul>
            <button className="close-button" onClick={toggleHelpScreen}>
              {GetLabel("Labels.button.back", currentCulture)}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

HelpButton.propTypes = {
  currentCulture: PropTypes.string.isRequired, // Ensure the currentCulture prop is passed
};

export default HelpButton;
