import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GetLabel } from "../LanguageManager";
import { BackButton } from "./BackButton";
import "./ManageEmployeePaymentView.css";
import { API_BASE_URL } from "../config"; // ✅ Import dynamic base URL

const EMPLOYEE_PAYMENTS_API = `${API_BASE_URL}/api/employees/payments/`;
const PAY_PERIODS_API = `${API_BASE_URL}/api/configuration/payperiods`;

const ManageEmployeePaymentView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const culture = searchParams.get("culture") || "en";

  const [payPeriods, setPayPeriods] = useState([]);
  const [selectedPayPeriod, setSelectedPayPeriod] = useState("");
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const badgeNumber = searchParams.get("badge");

  // Fetch available pay periods
  useEffect(() => {
    const fetchPayPeriods = async () => {
      try {
        const response = await fetch(PAY_PERIODS_API);
        if (response.ok) {
          const data = await response.json();
          setPayPeriods(data);
          if (data.length > 0) {
            setSelectedPayPeriod(data[0]); // Default selection
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

  // Fetch payment data when pay period changes
  useEffect(() => {
    if (!selectedPayPeriod) return;

    const fetchPayments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${EMPLOYEE_PAYMENTS_API}${badgeNumber}/${selectedPayPeriod}`);
        if (!response.ok) {
          throw new Error("Failed to fetch payment details");
        }
        const data = await response.json();
        setPaymentData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [selectedPayPeriod]);

  const handleBack = () => {
    navigate(`/manager?culture=${culture}`);
  };

  return (
    <div className="worked-hours-page">
      <h1>{GetLabel("Labels.function.managePayment", culture)}</h1>

      {/* Pay Period Dropdown */}
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

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Loading...</div>}

      {paymentData && (
        <div className="payment-details">
          <p><strong>Employee:</strong> <span>{paymentData.employeeName}</span></p>
          <p><strong>Badge Number:</strong> <span>{paymentData.badgeNumber}</span></p>
          <p><strong>Pay Period:</strong> <span>{paymentData.payPeriod}</span></p>
          <p><strong>Total Hours Worked:</strong> <span>{paymentData.totalHoursWorked.toFixed(2)} hrs</span></p>
          <p><strong>Hourly Rate:</strong> <span>${paymentData.hourlyRate.toFixed(2)}</span></p>
          <p><strong>Gross Earnings:</strong> <span>${paymentData.grossEarnings.toFixed(2)}</span></p>
          <p><strong>Tax Deductions:</strong> <span>${paymentData.taxDeductions.toFixed(2)}</span></p>
          <p><strong>Net Pay:</strong> <span>${paymentData.netPay.toFixed(2)}</span></p>
        </div>
      )}

      <BackButton handleBackButton={handleBack} currentCulture={culture} />
    </div>
  );
};

export default ManageEmployeePaymentView;
