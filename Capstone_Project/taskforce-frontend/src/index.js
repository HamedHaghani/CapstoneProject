import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MainPage from "./Components/MainPage";
import PinPage from "./Components/PinPage";
import ManagerPage from "./Components/ManagerPage";
import ManageEmployeesPage from "./Components/ManageEmployeesPage";
import AddEmployeePage from "./Components/AddEmployeePage";
import EmployeeListPage from "./Components/EmployeeListPage";
import UpdateEmployeePage from "./Components/UpdateEmployeePage";
import WorkedHoursPage from "./Components/WorkedHoursPage";
import EmployeeSchedulePage from "./Components/EmployeeSchedulePage";
import BadgeEntryPage from "./Components/BadgeEntryPage"; // Import BadgeEntryPage
import EmployeeDetailsPage from "./Components/EmployeeDetailsPage"; // Import BadgeEntryPage
import EmployeeSchedulesPage from "./Components/EmployeeSchedulesPage"; // Import BadgeEntryPage

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/pin",
    element: <PinPage />,
  },
  {
    path: "/manager",
    element: <ManagerPage />,
  },
  {
    path: "/manage-employees",
    element: <ManageEmployeesPage />,
  },
  {
    path: "/add-employee",
    element: <AddEmployeePage />,
  },
  {
    path: "/update-employee",
    element: <UpdateEmployeePage />,
  },
  {
    path: "/employee-list",
    element: <EmployeeListPage />,
  },
  {
    path: "/manage-schedules",
    element: <EmployeeListPage />,
  },
  {
    path: "/hours-worked",
    element: <WorkedHoursPage />,
  },
  {
    path: "/employee-schedule",
    element: <EmployeeSchedulePage />,
  },
  {
    path: "/badge-entry",
    element: <BadgeEntryPage />, // Added BadgeEntryPage route
  },
  {
    path: "/employee-viewProfile",
    element: <EmployeeDetailsPage />,
  },
  {
    path: "/employee-viewSchedules",
    element: <EmployeeSchedulesPage />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
