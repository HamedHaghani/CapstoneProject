package com.backend.taskforce.repository;

import com.backend.taskforce.model.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    // Find all schedules for the employee
    List<Schedule> findByEmployeeId(Long employeeId);

    // ✅ Modified to use Strings instead of LocalDate/LocalTime
    List<Schedule> findByEmployeeIdAndStartDateAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
            Long employeeId, String startDate, String currentTime1, String currentTime2
    );
}
