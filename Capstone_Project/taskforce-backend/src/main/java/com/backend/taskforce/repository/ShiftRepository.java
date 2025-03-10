package com.backend.taskforce.repository;

import com.backend.taskforce.model.Shift;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ShiftRepository extends JpaRepository<Shift, Long> {
    Optional<Shift> findFirstByEmployee_BadgeNumberIgnoreCaseAndEndTimeIsNullOrderByStartTimeDesc(String badgeNumber);
}
