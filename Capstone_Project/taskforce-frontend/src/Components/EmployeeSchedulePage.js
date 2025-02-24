import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BackButton } from "./BackButton";
import "./EmployeeSchedulePage.css";

const EmployeeSchedulePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const employeeId = searchParams.get("employeeId");
  const currentCulture = searchParams.get("culture") || "en";

  const [schedules, setSchedules] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    mealDuration: 0,
    details: "",
  });

  const [editingScheduleId, setEditingScheduleId] = useState(null);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/schedules/employee/${employeeId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch schedules");
        }
        const data = await response.json();
        setSchedules(
          data.sort((a, b) => a.startTime.localeCompare(b.startTime))
        );
      } catch (error) {
        console.error(error);
      }
    };

    fetchSchedules();
  }, [employeeId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editingScheduleId
      ? `http://localhost:8080/api/schedules/${editingScheduleId}`
      : `http://localhost:8080/api/schedules`;
    const method = editingScheduleId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          employee: { id: employeeId },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save schedule");
      }

      const savedSchedule = await response.json();
      if (editingScheduleId) {
        setSchedules((prev) =>
          prev.map((schedule) =>
            schedule.id === editingScheduleId ? savedSchedule : schedule
          )
        );
      } else {
        setSchedules((prev) => [...prev, savedSchedule]);
      }

      setFormData({
        startDate: "",
        startTime: "",
        endDate: "",
        endTime: "",
        mealDuration: 0,
        details: "",
      });
      setEditingScheduleId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (schedule) => {
    setFormData(schedule);
    setEditingScheduleId(schedule.id);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/schedules/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete schedule");
      }
      setSchedules(schedules.filter((schedule) => schedule.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const filteredSchedules = schedules.filter((schedule) =>
    Object.values(schedule).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="employee-schedule-page">
      <BackButton
        handleBackButton={() => navigate(`/manager?culture=${currentCulture}`)}
      />

      <h1>Employee Schedule</h1>
      <div className="schedule-container">
        <div className="schedule-list">
          <input
          className="schedule-search"
            type="text"
            placeholder="Search schedules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {filteredSchedules.length === 0 ? (
            <p className="no-schedules">No schedules</p>
          ) : (
            <ul className="schedules">
              {filteredSchedules.map((schedule) => (
                <li key={schedule.id} className="schedule-item">
                  <div>
                    <strong>
                      {schedule.startDate} - {schedule.endDate}
                    </strong>{" "}
                    ({schedule.startTime} - {schedule.endTime})
                    <p>{schedule.details}</p>
                    <p>Meal Duration: {schedule.mealDuration} minutes</p>
                  </div>
                  <div className="schedule-buttons">
                    <button onClick={() => handleEdit(schedule)}>Edit</button>
                    <button onClick={() => handleDelete(schedule.id)}>
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* RIGHT SIDE - FORM */}
        <div className="schedule-form">
          <h2>{editingScheduleId ? "Update Schedule" : "Add New Schedule"}</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Start Date:
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Start Time:
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              End Date:
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              End Time:
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Meal Duration (minutes):
              <input
                type="number"
                name="mealDuration"
                value={formData.mealDuration}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Details:{" "}
              <textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
                required
                rows="3" // More rows to make it bigger
              />
            </label>

            <button type="submit">
              {editingScheduleId ? "Update Schedule" : "Add Schedule"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeSchedulePage;
