import React, { useEffect, useState } from "react";
import { GetLabel } from "../LanguageManager";
import { BackButton } from "./BackButton";
import { useNavigate, useLocation } from "react-router-dom";
import "./EmployeePunches.css";

const API_URL = "http://localhost:8080/api/shifts/employee/";

const EmployeeSPunches = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const culture = searchParams.get("culture") || "en";
  const badgeNumber = searchParams.get("badge");

  const [shifts, setShifts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (badgeNumber) {
      fetchShifts();
    }
  }, [badgeNumber]);

  const fetchShifts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}${badgeNumber}`);
      if (!response.ok) {
        throw new Error("Failed to fetch shifts");
      }
      const data = await response.json();
      setShifts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackButton = () => {
    navigate(`/manager?culture=${culture}`);
  };

  return (
    <div className="shifts-container">
      <h2>{GetLabel("Labels.function.employeePunches")}</h2>
      
      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Loading...</div>}
      
      {shifts.length > 0 ? (
        <table className="shifts-table">
          <thead>
            <tr>
              <th>Shift ID</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Break Start</th>
              <th>Break End</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift) => (
              <tr key={shift.id}>
                <td>{shift.id}</td>
                <td>{shift.startTime ? new Date(shift.startTime).toLocaleString() : "N/A"}</td>
                <td>{shift.endTime ? new Date(shift.endTime).toLocaleString() : "N/A"}</td>
                <td>{shift.breakStart ? new Date(shift.breakStart).toLocaleString() : "N/A"}</td>
                <td>{shift.breakEnd ? new Date(shift.breakEnd).toLocaleString() : "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No shifts available.</p>
      )}

       <BackButton
              handleBackButton={handleBackButton}
              currentCulture={culture}
            />
    </div>
  );
};

export default EmployeeSPunches;
