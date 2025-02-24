import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { GetLabel } from "../LanguageManager";
import { BackButton } from "./BackButton";
import "./EmployeeSchedulesPage.css";

const EmployeeSchedulesPage = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(`/`);
  };

  const [searchParams] = useSearchParams();
  const badge = searchParams.get("badge");
  const culture = searchParams.get("culture");

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchSchedules = async () => {
      if (!badge) {
        setError("Badge number is missing.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/schedules/employee/${badge}/schedules`
        );

        if (response.status === 404) {
          setNotFound(true);
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch employee schedules.");
        }

        const data = await response.json();
        setSchedules(data);
      } catch (err) {
        setError("Failed to fetch employee schedules.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [badge]);

  if (loading) return <p>{GetLabel("Labels.function.loading", culture)}</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="employee-schedules-page">
      {notFound ? (
        <div className="employee-not-found">
          <h2>
            {GetLabel("Labels.function.schedulesNotFound", culture, badge)}
          </h2>
        </div>
      ) : (
        <>
          <h2>{GetLabel("Labels.function.employeeSchedules", culture)}</h2>
          <div className="schedules-container">
            {schedules.length > 0 ? (
              <div className="schedules-list">
                {schedules.map((schedule, index) => (
                  <div key={index} className="schedule-item">
                    <p>
                      <strong>
                        {GetLabel("Labels.form.details", culture)}:{" "}
                      </strong>
                      {schedule.details}
                    </p>
                    <p>
                      <strong>
                        {GetLabel("Labels.form.startDate", culture)}:{" "}
                      </strong>
                      {schedule.startDate}
                    </p>
                    <p>
                      <strong>
                        {GetLabel("Labels.form.endDate", culture)}:{" "}
                      </strong>
                      {schedule.endDate}
                    </p>
                    <p>
                      <strong>
                        {GetLabel("Labels.form.startTime", culture)}:{" "}
                      </strong>
                      {schedule.startTime}
                    </p>
                    <p>
                      <strong>
                        {GetLabel("Labels.form.endTime", culture)}:{" "}
                      </strong>
                      {schedule.endTime}
                    </p>
                    <p>
                      <strong>
                        {GetLabel("Labels.form.mealDuration", culture)}:{" "}
                      </strong>
                      {schedule.mealDuration}{" "}
                      {GetLabel("Labels.form.minutes", culture)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>{GetLabel("Labels.function.noSchedules", culture)}</p>
            )}
          </div>
        </>
      )}
      <BackButton handleBackButton={handleBack} />
    </div>
  );
};

export default EmployeeSchedulesPage;
