package com.backend.taskforce.repository;

import com.backend.taskforce.model.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Optional<Employee> findByBadgeNumber(String badgeNumber);
    List<Employee> findByIsUnassignedFalse();
}
