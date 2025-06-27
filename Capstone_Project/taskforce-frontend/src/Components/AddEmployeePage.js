import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GetLabel } from "../LanguageManager"; 
import "./AddEmployeePage.css"; 
import { BackButton } from "./BackButton";
import { API_BASE_URL } from "../config";

const AddEmployeePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentCulture = searchParams.get("culture") || "en";

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

  const [loadingBadge, setLoadingBadge] = useState(true);

  // Fetch badge number from backend when the page loads
  useEffect(() => {
    const fetchBadgeNumber = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/employees/generate-badge`);//http://localhost:8080/api/employees/generate-badge
        if (response.ok) {
          const data = await response.json();
          setFormData((prevData) => ({
            ...prevData,
            badgeNumber: data.badgeNumber,
          }));
        } else {
          throw new Error("Error generating badge number");
        }
      } catch (error) {
        console.error("Error fetching badge number:", error);
        alert("Error generating badge number");
      } finally {
        setLoadingBadge(false);
      }
    };
    fetchBadgeNumber();
  }, []);

  const mockLocations = ["New York", "Toronto", "London"];
  const mockPunchPolicies = ["Flexible", "Fixed", "Remote"];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/employees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(`${GetLabel("Labels.function.addEmployee", currentCulture)} success!`);
        navigate(`/manage-employees?culture=${currentCulture}`);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Error adding employee");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form");
    }
  };

  return (
    <div className="custom-add-employee-page">
      <div className="custom-header">
        <h1 className="custom-title">
          {GetLabel("Labels.function.addEmployee", currentCulture)}
        </h1>
      </div>
      <form className="custom-employee-form" onSubmit={handleSubmit}>
        <div className="custom-form-scroll-container">
          <div className="custom-form-grid">
            <label>
              {GetLabel("Labels.form.jobTitle", currentCulture)}
              <input
                type="text"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              {GetLabel("Labels.form.role", currentCulture)}
              <input
                type="text"
                name="jobRole"
                value={formData.jobRole}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              {GetLabel("Labels.form.location", currentCulture)}
              <select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  {GetLabel("Labels.form.selectLocation", currentCulture)}
                </option>
                {mockLocations.map((location, index) => (
                  <option key={index} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {GetLabel("Labels.form.name", currentCulture)}
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              {GetLabel("Labels.form.surname", currentCulture)}
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              {GetLabel("Labels.form.address", currentCulture)}
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              {GetLabel("Labels.form.badgeNumber", currentCulture)}
              <input
                type="text"
                name="badgeNumber"
                value={loadingBadge ? "Loading..." : formData.badgeNumber}
                readOnly
              />
            </label>
            <label>
              {GetLabel("Labels.form.dateOfBirth", currentCulture)}
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              {GetLabel("Labels.form.phone", currentCulture)}
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              {GetLabel("Labels.form.email", currentCulture)}
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              {GetLabel("Labels.form.salary", currentCulture)}
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                required
              />
            </label>
            <div className="custom-button-container">
              <button type="submit" className="custom-submit-button">
                {GetLabel("Labels.button.submit", currentCulture)}
              </button>
            </div>
          </div>
        </div>
      </form>
      <BackButton
        handleBackButton={() => navigate(`/manage-employees?culture=${currentCulture}`)}
        currentCulture={currentCulture}
      />
    </div>
  );
};

export default AddEmployeePage;
