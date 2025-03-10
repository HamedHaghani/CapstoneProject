package com.backend.taskforce.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Shift {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime breakStart;
    private LocalDateTime breakEnd;

    public Shift() {}

    public Shift(Employee employee, LocalDateTime startTime) {
        this.employee = employee;
        this.startTime = startTime;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Employee getEmployee() { return employee; }
    public void setEmployee(Employee employee) { this.employee = employee; }

    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }

    public LocalDateTime getEndTime() { return endTime; }
    public void setEndTime(LocalDateTime endTime) { this.endTime = endTime; }

    public LocalDateTime getBreakStart() { return breakStart; }
    public void setBreakStart(LocalDateTime breakStart) { this.breakStart = breakStart; }

    public LocalDateTime getBreakEnd() { return breakEnd; }
    public void setBreakEnd(LocalDateTime breakEnd) { this.breakEnd = breakEnd; }
}
