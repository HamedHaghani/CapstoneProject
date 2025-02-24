import React from "react";
import "./LanguagePicker.css";
import { GetLabel } from "../LanguageManager"; // Import your label manager

const LanguagePicker = ({ currentCulture, onLanguageChange }) => {
  const availableLanguages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "ua", name: "Ukranian" },
  ];

  return (
    <div className="language-picker-container-bottom">
      <div className="language-picker-container">
        <label htmlFor="language-select">
          {GetLabel("Labels.function.selectLanguage", currentCulture)}
        </label>
        <select
          id="language-select"
          value={currentCulture}
          onChange={(e) => onLanguageChange(e.target.value)}
        >
          {availableLanguages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default LanguagePicker;
