import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GetLabel } from "../LanguageManager"; // Import the label manager
import "./ManageEmployeesPage.css"; // CSS for styling
import { BackButton } from "./BackButton";

const ManageEmployeesPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const currentCulture = searchParams.get("culture") || "en";

  const handleBack = () => {
    navigate(`/manager?culture=${currentCulture}`);
  };

  const handleEmployeeListNavigation = (action) => {
    navigate(`/employee-list?action=${action}&culture=${currentCulture}`);
  };

  return (
    <div className="manage-page">
      <h1 className="manage-title">
        {GetLabel("Labels.function.manageEmployees", currentCulture)}
      </h1>
      <div className="manage-options">
        <button
          className="manage-button"
          onClick={() => navigate(`/add-employee?culture=${currentCulture}`)}
        >
          {GetLabel("Labels.function.addEmployee", currentCulture)}
        </button>
        <button
          className="manage-button"
          onClick={() => handleEmployeeListNavigation("remove")}
        >
          {GetLabel("Labels.function.removeEmployee", currentCulture)}
        </button>
        <button
          className="manage-button"
          onClick={() => handleEmployeeListNavigation("update")}
        >
          {GetLabel("Labels.function.updateEmployee", currentCulture)}
        </button>
      </div>
      <BackButton
        handleBackButton={handleBack}
        currentCulture={currentCulture}
      />
    </div>
  );
};

export default ManageEmployeesPage;
