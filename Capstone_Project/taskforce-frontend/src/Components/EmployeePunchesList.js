import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GetLabel } from "../LanguageManager"; // Import label manager
import { BackButton } from "./BackButton"; // Import the BackButton
import "./EmployeeListPage.css"; // CSS for styling

const EmployeePunchesList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const culture = searchParams.get("culture") || "en";
  const action = searchParams.get("action") || "view"; // Default to 'view'

  const [employees, setEmployees] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedEmployeeId, setExpandedEmployeeId] = useState(null);

  // Fetch employees from API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/employees");
        if (response.ok) {
          const data = await response.json();
          console.log("******Fetched Employees: ", data);
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

  // Filter employees by search query
  const filteredEmployees = employees.filter((employee) =>
    `${employee.name} ${employee.surname}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Toggle card expansion
  const toggleExpand = (id) => {
    setExpandedEmployeeId(expandedEmployeeId === id ? null : id);
  };

  // Handle updating an employee
  const handleUpdate = (employee) => {
    navigate(`/update-employee?culture=${culture}&id=${employee.id}`);
  };

  // Handle view payment of an employee
  const handlePayment = (employee) => {
    navigate(`/employee-punch?badge=${employee.badgeNumber}&culture=${culture}`);
  };

  // Handle deleting an employee
  const handleDelete = async (employee) => {
    const confirmRemoval = window.confirm(
      GetLabel("Labels.pin.confirmRemoval", culture)
    );
    if (confirmRemoval) {
      try {
        const response = await fetch(
          `http://localhost:8080/api/employees/${employee.id}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          alert(`Employee ${employee.name} removed`);
          // Refresh employees list after deletion
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

  // Navigate back
  const handleBack = () => {
    navigate(`/manager?culture=${culture}`);
  };

  // Handle managing schedules
  const handleManageSchedules = (employeeId) => {
    navigate(`/employee-schedule?employeeId=${employeeId}&culture=${culture}`);
  };

    // Handle employee punches
    const handlePunches = (employee) => {
        navigate(`/employee-punch?badge=${employee.badgeNumber}&culture=${culture}`);
        // navigate(`/employee-punch?culture=${culture}&id=${employee.id}`);
      };

  return (
    <div className="employee-list-page">
      <h1>{GetLabel(`Labels.function.employeePunches`, culture)}</h1>
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
                  {/* Conditionally render the action button */}
                  {action !== "view" && (
                    <div className="action-buttons">
                      {action === "update" && (
                        <button
                          className="action-button"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card toggle
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
                            e.stopPropagation(); // Prevent card toggle
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
                            e.stopPropagation(); // Prevent card toggle
                            handleManageSchedules(employee.id); // Pass employee id
                          }}
                        >
                          {GetLabel("Labels.function.manageSchedules", culture)}
                        </button>
                      )}
                      {action === "payment" && (
                        <button
                          className="action-button"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card toggle
                            handlePayment(employee); // Pass employee id
                          }}
                        >
                          {GetLabel("Labels.function.managePayment", culture)}
                        </button>
                      )}
                      {action === "punches" && (
                        <button
                          className="action-button"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card toggle
                            handlePunches(employee); // Pass employee id
                          }}
                        >
                          {GetLabel("Labels.function.employeePunches", culture)}
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

export default EmployeePunchesList;


