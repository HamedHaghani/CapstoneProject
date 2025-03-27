import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GetLabel } from "../LanguageManager";
import { BackButton } from "./BackButton";
import "./ManageEmployeePaymentView.css";

const API_URL = "http://localhost:8080/api/employees/payments/";

const ManageEmployeePaymentView = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const culture = searchParams.get("culture") || "en";

  const [employees, setEmployees] = useState([]);
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
        const response = await fetch("http://localhost:8080/api/configuration/payperiods");
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

    const fetchPayments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_URL}${badgeNumber}/${selectedPayPeriod}`);
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

  

  // Navigate back
  const handleBack = () => {
    navigate(`/manager?culture=${culture}`);
  };

  return (
    <div className="worked-hours-page">
      <h1>{GetLabel("Labels.function.managePayment", culture)}</h1>

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





// import React, { useEffect, useState } from "react";
// import { useLocation } from "react-router-dom";
// import { GetLabel } from "../LanguageManager";
// import "./ManageEmployeePaymentView.css";

// const API_URL = "http://localhost:8080/api/employees/payments/";

// const ManageEmployeePaymentView = () => {
//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);
//   const badgeNumber = searchParams.get("badge");

//   const [paymentData, setPaymentData] = useState(null);
//   const [error, setError] = useState(null);
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (badgeNumber && startDate && endDate) {
//       fetchPayments();
//     }
//   }, [badgeNumber, startDate, endDate]);

//   const fetchPayments = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(`${API_URL}${badgeNumber}?start=${startDate}&end=${endDate}`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch payment details");
//       }
//       const data = await response.json();
//       setPaymentData(data);
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="payment-container">
//       <h2>{GetLabel("Labels.function.managePayment")}</h2>

//       <div className="date-selection">
//         <label>
//           Start Date:
//           <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
//         </label>
//         <label>
//           End Date:
//           <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
//         </label>
//         <button onClick={fetchPayments} disabled={!startDate || !endDate}>
//           Search Payments
//         </button>
//       </div>

//       {error && <div className="error-message">{error}</div>}
//       {loading && <div className="loading">Loading...</div>}

//       {paymentData && (
//         <div className="payment-details">
//           <p><strong>Employee:</strong> <span>{paymentData.employeeName}</span></p>
//           <p><strong>Badge Number:</strong> <span>{paymentData.badgeNumber}</span></p>
//           <p><strong>Pay Period:</strong> <span>{paymentData.payPeriod}</span></p>
//           <p><strong>Total Hours Worked:</strong> <span>{paymentData.totalHoursWorked} hrs</span></p>
//           <p><strong>Hourly Rate:</strong> <span>${paymentData.hourlyRate.toFixed(2)}</span></p>
//           <p><strong>Gross Earnings:</strong> <span>${paymentData.grossEarnings.toFixed(2)}</span></p>
//           <p><strong>Tax Deductions:</strong> <span>${paymentData.taxDeductions.toFixed(2)}</span></p>
//           <p><strong>Net Pay:</strong> <span>${paymentData.netPay.toFixed(2)}</span></p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ManageEmployeePaymentView;
