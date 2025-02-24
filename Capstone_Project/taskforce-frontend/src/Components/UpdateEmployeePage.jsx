import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GetLabel } from "../LanguageManager";
import "./UpdateEmployeePage.css";
import { BackButton } from "./BackButton";

const UpdateEmployeePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentCulture = searchParams.get("culture") || "en";
  const employeeId = searchParams.get("id");

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
  });

  const mockLocations = ["New York", "Toronto", "London"];
  const mockPunchPolicies = ["Flexible", "Fixed", "Remote"];

  // Fetch the employee details for updating
  useEffect(() => {
    if (employeeId != null) {
      console.log("Ivanna" + employeeId);

      const fetchEmployee = async () => {
        try {
          const response = await fetch(
            `http://localhost:8080/api/employees/${employeeId}`
          );
          if (response.ok) {
            const employee = await response.json();
            console.log(employee + "Ivanna");
            setFormData({
              jobTitle: employee.jobTitle || "",
              jobRole: employee.jobRole || "",
              location: employee.location || "",
              isManager: employee.isManager || false,
              managerPin: employee.managerPin || "",
              name: employee.name || "",
              surname: employee.surname || "",
              badgeNumber: employee.badgeNumber || "",
              sin: employee.sin || "",
              punchPolicy: employee.punchPolicy || "",
              phone: employee.phone || "",
              email: employee.email || "",
              address: employee.address || "",
              dateOfBirth: employee.dateOfBirth || "",
            });
          } else {
            console.error(
              `Failed to fetch employee data: ${response.statusText}`
            );
          }
        } catch (error) {
          console.error("Error fetching employee data:", error);
        }
      };

      fetchEmployee();
    }
  }, [employeeId]);

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
      const response = await fetch(
        `http://localhost:8080/api/employees/${employeeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert(
          GetLabel("Labels.function.updateEmployee", currentCulture) +
            " success!"
        );
        navigate(`/manage-employees?culture=${currentCulture}`);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Error updating employee");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form");
    }
  };

  return (
    <div className="custom-update-employee-page">
      <div className="custom-header">
        <h1 className="custom-title">
          {GetLabel("Labels.function.updateEmployee", currentCulture)}
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
              {GetLabel("Labels.form.dateOfBirth", currentCulture)}
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
              />
            </label>
          </div>
        </div>
        <div className="custom-form-actions">
          <button type="submit" className="submit-button">
            {GetLabel("Labels.function.updateEmployee", currentCulture)}
          </button>
        </div>
      </form>
      <BackButton
        handleBackButton={() => navigate(-1)}
        currentCulture={currentCulture}
      />
    </div>
  );
};

export default UpdateEmployeePage;
