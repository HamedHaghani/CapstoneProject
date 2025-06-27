import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GetLabel } from "../LanguageManager";
import { BackButton } from "./BackButton";
import "./WorkedHoursPage.css";

const API_BASE_URL = "https://taskforce-backend.onrender.com/api";

const WorkedHoursPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const culture = searchParams.get("culture") || "en";

  const [employees, setEmployees] = useState([]);
  const [payPeriods, setPayPeriods] = useState([]);
  const [selectedPayPeriod, setSelectedPayPeriod] = useState("");

  // Fetch available pay periods
  useEffect(() => {
    const fetchPayPeriods = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/configuration/payperiods`);
        if (response.ok) {
          const data = await response.json();
          setPayPeriods(data);
          if (data.length > 0) {
            setSelectedPayPeriod(data[0]); // Set default pay period
          }
        } else {
          console.error("Failed to fetch pay periods:", response.status);
        }
      } catch (error) {
        console.error("Error fetching pay periods:", error);
      }
    };

    fetchPayPeriods();
  }, []);

  // Fetch employees' worked hours based on the selected pay period
  useEffect(() => {
    if (!selectedPayPeriod) return;

    const fetchEmployeeHours = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/employees/hours/${selectedPayPeriod}`
        );
        if (response.ok) {
          const data = await response.json();
          setEmployees(data);
        } else {
          console.error("Failed to fetch employee hours:", response.status);
        }
      } catch (error) {
        console.error("Error fetching employee hours:", error);
      }
    };

    fetchEmployeeHours();
  }, [selectedPayPeriod]);

  // Navigate back
  const handleBack = () => {
    navigate(`/manager?culture=${culture}`);
  };

  return (
    <div className="worked-hours-page">
      <h1>{GetLabel("Labels.page.workedHours", culture)}</h1>

      {/* Dropdown for selecting the pay period */}
      <div className="pay-period-selection">
        <label>{GetLabel("Labels.form.selectPayPeriod", culture)}:</label>
        <select
          value={selectedPayPeriod}
          onChange={(e) => setSelectedPayPeriod(e.target.value)}
        >
          {payPeriods.map((period, index) => (
            <option key={index} value={period}>
              {period}
            </option>
          ))}
        </select>
      </div>

      <div className="employee-cards-container">
        <div className="employee-cards">
          {employees.map((employee) => (
            <div key={employee.id} className="employee-card">
              <div className="employee-card-header">
                <span>
                  {employee.name} {employee.surname}
                </span>
                <span>{employee.jobTitle}</span>
              </div>
              <div className="employee-card-details">
                <p>
                  {GetLabel("Labels.form.workedHours", culture) + ":"}{" "}
                  {employee.workedHours.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BackButton handleBackButton={handleBack} currentCulture={culture} />
    </div>
  );
};

export default WorkedHoursPage;
