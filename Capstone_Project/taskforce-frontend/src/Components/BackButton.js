import React from "react";
import { GetLabel } from "../LanguageManager";
import "./BackButton.css";

import {
  FaArrowLeft, // Back arrow icon
} from "react-icons/fa";
export const BackButton = (params) => {
  let { handleBackButton, currentCulture } = params;
  return (
    <button className="back-button-bottom" onClick={handleBackButton}>
      <FaArrowLeft /> {GetLabel("Labels.button.back", currentCulture)}
    </button>
  );
};
