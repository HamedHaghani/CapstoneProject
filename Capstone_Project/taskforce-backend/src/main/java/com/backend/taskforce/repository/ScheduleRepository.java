package com.backend.taskforce.repository;

import com.backend.taskforce.model.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    // Custom query method to find schedules by employee ID
    List<Schedule> findByEmployeeId(Long employeeId);
}

