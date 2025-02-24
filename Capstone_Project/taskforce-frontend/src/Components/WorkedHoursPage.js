import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GetLabel } from "../LanguageManager";
import { BackButton } from "./BackButton"; // Import the BackButton
import "./WorkedHoursPage.css"; // CSS for styling

const WorkedHoursPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const culture = searchParams.get("culture") || "en";

  const [employees, setEmployees] = useState([]);

  // Fetch employees and their worked hours
  //   useEffect(() => {
  //     const fetchEmployeeHours = async () => {
  //       try {
  //         const response = await fetch(
  //           "http://localhost:8080/api/employees/hours"
  //         );
  //         if (response.ok) {
  //           const data = await response.json();
  //           setEmployees(data);
  //         } else {
  //           console.error("Failed to fetch employee hours:", response.status);
  //         }
  //       } catch (error) {
  //         console.error("Error fetching employee hours:", error);
  //       }
  //     };

  //     fetchEmployeeHours();
  //   }, []);

  useEffect(() => {
    const fetchEmployeeHours = async () => {
      try {
        // Simulated mock response
        const mockData = [
          {
            id: 1,
            name: "John",
            surname: "Doe",
            salary: 25, // hourly rate
            workedHours: 40, // hours worked since last pay
          },
          {
            id: 2,
            name: "Jane",
            surname: "Smith",
            salary: 30, // hourly rate
            workedHours: 35, // hours worked since last pay
          },
          {
            id: 3,
            name: "Alice",
            surname: "Brown",
            salary: 20, // hourly rate
            workedHours: 45, // hours worked since last pay
          },
          {
            id: 2,
            name: "Jane",
            surname: "Smith",
            salary: 30, // hourly rate
            workedHours: 35, // hours worked since last pay
          },
          {
            id: 3,
            name: "Alice",
            surname: "Brown",
            salary: 20, // hourly rate
            workedHours: 45, // hours worked since last pay
          },
        ];

        // Simulating a delay as if fetching from an API
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Setting the mock data
        setEmployees(mockData);
      } catch (error) {
        console.error("Error fetching employee hours:", error);
      }
    };

    fetchEmployeeHours();
  }, []);

  // Handle document generation
  const handleGenerateDocument = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/payments/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(employees),
        }
      );
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "payment_document.pdf";
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        console.error("Failed to generate document:", response.status);
      }
    } catch (error) {
      console.error("Error generating document:", error);
    }
  };

  // Navigate back
  const handleBack = () => {
    navigate(`/manager?culture=${culture}`);
  };

  return (
    <div className="worked-hours-page">
      <h1>{GetLabel("Labels.page.workedHours", culture)}</h1>
      <button
        className="generate-document-button"
        onClick={handleGenerateDocument}
      >
        {GetLabel("Labels.function.generatePaymentDocument", culture)}
      </button>
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
                  {GetLabel("Labels.form.salary", culture) + ":"}{" "}
                  {employee.salary}
                </p>
                <p>
                  {GetLabel("Labels.form.workedHours", culture) + ":"}{" "}
                  {employee.workedHours}
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
