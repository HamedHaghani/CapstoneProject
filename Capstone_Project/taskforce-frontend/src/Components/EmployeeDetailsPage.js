import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom"; // Use useSearchParams instead of useParams
import { GetLabel } from "../LanguageManager"; // Localization
import { BackButton } from "./BackButton"; // Back navigation
import "./EmployeeDetailsPage.css"; // Add styling

const EmployeeDetailsPage = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(`/`);
  };

  const [searchParams] = useSearchParams(); // Extract query parameters
  const badge = searchParams.get("badge"); // Get the 'badge' query parameter
  const culture = searchParams.get("culture"); // Get the 'culture' query parameter

  const [formData, setFormData] = useState({
    jobTitle: "",
    jobRole: "",
    location: "",
    isManager: false,
    managerPin: "",
    name: "",
    surname: "",
    badgeNumber: "",
    sin: "",
    punchPolicy: "",
    phone: "",
    email: "",
    address: "",
    dateOfBirth: "",
    salary: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false); // New state to track if employee is not found

  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!badge) {
        setError("Badge number is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/employees/badge/${badge}`
        );

        if (response.status === 404) {
          setNotFound(true); // Set employee not found
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch employee data.");
        }

        const data = await response.json();
        setFormData(data);
      } catch (err) {
        setError("Failed to fetch employee data.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, [badge]);

  if (loading) return <p>{GetLabel("Labels.function.loading", culture)}</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="employee-details-page">
      {notFound ? (
        <div className="employee-not-found">
          <h2>
            {GetLabel("Labels.function.employeeNotFound", culture, badge)}
          </h2>
        </div>
      ) : (
        <>
          <h2>{GetLabel("Labels.function.employeeDetails", culture)}</h2>
          <div className="details-container">
            <p>
              <strong>{GetLabel("Labels.form.name", culture)}: </strong>{" "}
              {formData.name} {formData.surname}
            </p>
            <p>
              <strong>{GetLabel("Labels.form.jobTitle", culture)}: </strong>{" "}
              {formData.jobTitle}
            </p>
            <p>
              <strong>{GetLabel("Labels.form.role", culture)}: </strong>{" "}
              {formData.jobRole}
            </p>
            <p>
              <strong>{GetLabel("Labels.form.location", culture)}: </strong>{" "}
              {formData.location}
            </p>
            <p>
              <strong>{GetLabel("Labels.form.badgeNumber", culture)}: </strong>{" "}
              {formData.badgeNumber}
            </p>
            <p>
              <strong>{GetLabel("Labels.form.phone", culture)}: </strong>{" "}
              {formData.phone}
            </p>
            <p>
              <strong>{GetLabel("Labels.form.email", culture)}: </strong>{" "}
              {formData.email}
            </p>
            <p>
              <strong>{GetLabel("Labels.form.dateOfBirth", culture)}: </strong>{" "}
              {formData.dateOfBirth}
            </p>
            <p>
              <strong>{GetLabel("Labels.form.salary", culture)}: </strong> $
              {formData.salary}
            </p>
          </div>
        </>
      )}

      <BackButton handleBackButton={handleBack} />
    </div>
  );
};

export default EmployeeDetailsPage;
