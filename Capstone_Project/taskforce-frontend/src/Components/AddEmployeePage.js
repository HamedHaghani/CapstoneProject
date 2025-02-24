import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GetLabel } from "../LanguageManager"; // Import the label manager
import "./AddEmployeePage.css"; // Updated CSS file name
import { BackButton } from "./BackButton";

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
      const response = await fetch("http://localhost:8080/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        alert(
          `${GetLabel("Labels.function.addEmployee", currentCulture)} success!`
        );
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
          {" "}
          {/* Scrollable container */}
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
              {GetLabel("Labels.form.badgeNumber", currentCulture)}
              <input
                type="text"
                name="badgeNumber"
                value={formData.badgeNumber}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              {GetLabel("Labels.form.sin", currentCulture)}
              <input
                type="text"
                name="sin"
                value={formData.sin}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              {GetLabel("Labels.form.punchPolicy", currentCulture)}
              <select
                name="punchPolicy"
                value={formData.punchPolicy}
                onChange={handleInputChange}
                required
              >
                <option value="" disabled>
                  {GetLabel("Labels.form.selectPunchPolicy", currentCulture)}
                </option>
                {mockPunchPolicies.map((policy, index) => (
                  <option key={index} value={policy}>
                    {policy}
                  </option>
                ))}
              </select>
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
              {GetLabel("Labels.form.salary", currentCulture)}
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                required
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
              <div></div>
              <div className="ismanager">
                {GetLabel("Labels.form.isManager", currentCulture)}
                <input
                  className="custom-checkbox"
                  type="checkbox"
                  name="isManager"
                  checked={formData.isManager}
                  onChange={handleInputChange}
                />
              </div>
            </label>
            {formData.isManager && (
              <label>
                {GetLabel("Labels.form.managerPin", currentCulture)}
                <input
                  type="password"
                  name="managerPin"
                  value={formData.managerPin}
                  onChange={handleInputChange}
                  required
                />
              </label>
            )}
            <div className="custom-button-container">
              <button type="submit" className="custom-submit-button">
                {GetLabel("Labels.button.submit", currentCulture)}
              </button>
            </div>
          </div>
        </div>
      </form>
      <BackButton
        handleBackButton={() =>
          navigate(`/manage-employees?culture=${currentCulture}`)
        }
        currentCulture={currentCulture}
      />
    </div>
  );
};

export default AddEmployeePage;
