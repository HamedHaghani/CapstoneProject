package com.backend.taskforce.repository;

import com.backend.taskforce.model.Shift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShiftRepository extends JpaRepository<Shift, Long> {

    // ✅ Find the most recent active shift for an employee using badge number
    Optional<Shift> findFirstByEmployee_BadgeNumberIgnoreCaseAndEndTimeIsNullOrderByStartTimeDesc(String badgeNumber);

    // ✅ Corrected: Get all completed shifts within a date range for an employee using badge number
    List<Shift> findByEmployee_BadgeNumberIgnoreCaseAndStartTimeBetween(
            String badgeNumber, LocalDateTime startTime, LocalDateTime endTime
    );

    List<Shift> findByEmployee_BadgeNumberIgnoreCase(String badgeNumber);

}
