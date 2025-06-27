import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GetLabel } from "../LanguageManager";
import "./ConfigurationPage.css";
import { BackButton } from "./BackButton";
import { API_BASE_URL } from "../config"; // ✅ Import global base URL

const API_URL = `${API_BASE_URL}/api`; // ✅ Construct full API base path

const ConfigurationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentCulture = searchParams.get("culture") || "en";

  const [configData, setConfigData] = useState({
    payPeriodStartDate: "",
    scheduleType: "",
    minutesBeforeShift: 0,
    adminPassword: "",
    isAdminPasswordChanged: false,
    taxPercentage: "",
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch(`${API_URL}/configuration`);
        if (response.ok) {
          const data = await response.json();
          setConfigData(data);
        }
      } catch (error) {
        console.error("Error fetching configuration:", error);
      }
    };
    fetchConfig();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfigData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (configData.taxPercentage === "" || configData.taxPercentage < 0 || configData.taxPercentage > 1) {
      alert("Tax rate must be between 0 and 1!");
      return;
    }

    const formattedData = {
      ...configData,
      payPeriodStartDate: configData.payPeriodStartDate
        ? new Date(configData.payPeriodStartDate).toISOString().split("T")[0]
        : "",
      taxPercentage: parseFloat(configData.taxPercentage),
    };

    try {
      const response = await fetch(`${API_URL}/configuration/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formattedData),
      });

      if (response.ok) {
        alert(`${GetLabel("Labels.button.save", currentCulture)} success!`);
        navigate(`/manager?culture=${currentCulture}`);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Error saving configuration");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form");
    }
  };

  return (
    <div className="configuration-page">
      <h1 className="title">
        {GetLabel("Labels.function.configuration", currentCulture)}
      </h1>
      <form className="config-form" onSubmit={handleSubmit}>
        <label>
          {GetLabel("Labels.form.payPeriodStartDate", currentCulture)}
          <input
            type="date"
            name="payPeriodStartDate"
            value={configData.payPeriodStartDate}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          {GetLabel("Labels.form.scheduleType", currentCulture)}
          <select
            name="scheduleType"
            value={configData.scheduleType}
            onChange={handleInputChange}
            required
          >
            <option value="" disabled>
              {GetLabel("Labels.form.selectSchedule", currentCulture)}
            </option>
            <option value="biweekly">Biweekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </label>

        <label>
          {GetLabel("Labels.form.taxRate", currentCulture)}
          <input
            type="number"
            name="taxPercentage"
            value={configData.taxPercentage}
            onChange={handleInputChange}
            required
            min="0"
            max="1"
            step="0.01"
          />
        </label>

        <button type="submit" className="submit-button">
          {GetLabel("Labels.button.save", currentCulture)}
        </button>
      </form>
      <BackButton
        handleBackButton={() => navigate(`/manager?culture=${currentCulture}`)}
        currentCulture={currentCulture}
      />
    </div>
  );
};

export default ConfigurationPage;
