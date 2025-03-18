import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { GetLabel } from "../LanguageManager";
import "./EmployeePaymentsPage.css";

const API_URL = "http://localhost:8080/api/employees/payments/";

const EmployeePaymentsPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const badgeNumber = searchParams.get("badge");

  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!badgeNumber) {
      setError("No badge number provided.");
      return;
    }

    fetch(`${API_URL}${badgeNumber}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch payment details");
        }
        return response.json();
      })
      .then((data) => setPaymentData(data))
      .catch((error) => setError(error.message));
  }, [badgeNumber]);

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!paymentData) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="payment-container">
      <h2>{GetLabel("Labels.function.viewPayments")}</h2>
      <p><strong>Employee:</strong> {paymentData.employeeName}</p>
      <p><strong>Badge Number:</strong> {paymentData.badgeNumber}</p>
      <p><strong>Pay Period:</strong> {paymentData.payPeriod}</p>
      <p><strong>Total Hours Worked:</strong> {paymentData.totalHoursWorked} hrs</p>
      <p><strong>Hourly Rate:</strong> ${paymentData.hourlyRate.toFixed(2)}</p>
      <p><strong>Gross Earnings:</strong> ${paymentData.grossEarnings.toFixed(2)}</p>
      <p><strong>Tax Deductions:</strong> ${paymentData.taxDeductions.toFixed(2)}</p>
      <p><strong>Net Pay:</strong> ${paymentData.netPay.toFixed(2)}</p>
    </div>
  );
};

export default EmployeePaymentsPage;
