import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GetLabel } from "../LanguageManager";
import { BackButton } from "./BackButton";
import "./EmployeeListPage.css";
import { API_BASE_URL } from "../config"; // ✅ Import the base URL

const API_URL = `${API_BASE_URL}/api`; // ✅ Build the full API path

const EmployeeListPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const culture = searchParams.get("culture") || "en";
  const action = searchParams.get("action") || "view";

  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedEmployeeId, setExpandedEmployeeId] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch(`${API_URL}/employees`);
        if (response.ok) {
          const data = await response.json();
          setEmployees(data);
        } else {
          console.error("Failed to fetch employees:", response.status);
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter((employee) =>
    `${employee.name} ${employee.surname}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpandedEmployeeId(expandedEmployeeId === id ? null : id);
  };

  const handleUpdate = (employee) => {
    navigate(`/update-employee?culture=${culture}&id=${employee.id}`);
  };

  const handleDelete = async (employee) => {
    const confirmRemoval = window.confirm(
      GetLabel("Labels.pin.confirmRemoval", culture)
    );
    if (confirmRemoval) {
      try {
        const response = await fetch(`${API_URL}/employees/${employee.id}`, {
          method: "DELETE",
        });
        if (response.ok) {
          alert(`Employee ${employee.name} removed`);
          setEmployees((prevEmployees) =>
            prevEmployees.filter((emp) => emp.id !== employee.id)
          );
        } else {
          console.error("Failed to delete employee:", response.status);
        }
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  const handleBack = () => {
    navigate(`/manager?culture=${culture}`);
  };

  const handleManageSchedules = (employeeId) => {
    navigate(`/employee-schedule?employeeId=${employeeId}&culture=${culture}`);
  };

  return (
    <div className="employee-list-page">
      <h1>{GetLabel(`Labels.function.${action}Employee`, culture)}</h1>
      <input
        type="text"
        className="search-bar"
        placeholder={GetLabel("Labels.form.search", culture)}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <div className="employee-cards-container">
        <div className="employee-cards">
          {filteredEmployees.map((employee, index) => (
            <div
              key={employee.id}
              className={`employee-card ${
                expandedEmployeeId === employee.id ? "expanded" : ""
              }`}
              onClick={() => toggleExpand(employee.id)}
            >
              <div className="employee-card-header">
                <span>
                  {employee.name} {employee.surname}
                </span>
                <span>{employee.role}</span>
              </div>
              {expandedEmployeeId === employee.id && (
                <div className="employee-card-details">
                  {Object.keys(employee).map(
                    (key, i) =>
                      employee[key] && (
                        <div
                          key={key}
                          className={`property-row ${
                            i % 2 === 0 ? "gray-row" : ""
                          }`}
                        >
                          <span>
                            {GetLabel(`Labels.form.${key}`, culture)}:
                          </span>
                          <div>{employee[key]}</div>
                        </div>
                      )
                  )}
                  {action !== "view" && (
                    <div className="action-buttons">
                      {action === "update" && (
                        <button
                          className="action-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdate(employee);
                          }}
                        >
                          {GetLabel(`Labels.function.updateEmployee`, culture)}
                        </button>
                      )}
                      {action === "remove" && (
                        <button
                          className="action-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(employee);
                          }}
                        >
                          {GetLabel(`Labels.function.removeEmployee`, culture)}
                        </button>
                      )}
                      {action === "schedules" && (
                        <button
                          className="action-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleManageSchedules(employee.id);
                          }}
                        >
                          {GetLabel("Labels.function.manageSchedules", culture)}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <BackButton handleBackButton={handleBack} currentCulture={culture} />
    </div>
  );
};

export default EmployeeListPage;
