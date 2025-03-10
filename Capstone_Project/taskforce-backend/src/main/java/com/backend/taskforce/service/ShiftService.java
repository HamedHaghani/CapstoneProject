package com.backend.taskforce.service;

import com.backend.taskforce.model.Employee;
import com.backend.taskforce.model.Shift;
import com.backend.taskforce.repository.EmployeeRepository;
import com.backend.taskforce.repository.ShiftRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ShiftService {
    private final ShiftRepository shiftRepository;
    private final EmployeeRepository employeeRepository;

    public ShiftService(ShiftRepository shiftRepository, EmployeeRepository employeeRepository) {
        this.shiftRepository = shiftRepository;
        this.employeeRepository = employeeRepository;
    }

    // 🔍 Helper Method: Find Employee by Badge Number
    private Employee findEmployeeByBadge(String badgeNumber) {
        return employeeRepository.findByBadgeNumber(badgeNumber)
                .orElseThrow(() -> new RuntimeException("Employee not found with badge: " + badgeNumber));
    }

    // ▶️ Start Shift
    public Shift startShiftByBadge(String badgeNumber) {
        Employee employee = findEmployeeByBadge(badgeNumber);
        Shift shift = new Shift(employee, LocalDateTime.now());
        return shiftRepository.save(shift);
    }

    // ⏹ End Shift
    public Shift endShiftByBadge(String badgeNumber) {
        Shift shift = shiftRepository.findFirstByEmployee_BadgeNumberIgnoreCaseAndEndTimeIsNullOrderByStartTimeDesc(badgeNumber)
                .orElseThrow(() -> new RuntimeException("No active shift found for badge: " + badgeNumber));

        shift.setEndTime(LocalDateTime.now());
        return shiftRepository.save(shift);
    }

    // ⏸ Start Break
    public Shift startBreakByBadge(String badgeNumber) {
        Shift shift = shiftRepository.findFirstByEmployee_BadgeNumberIgnoreCaseAndEndTimeIsNullOrderByStartTimeDesc(badgeNumber)
                .orElseThrow(() -> new RuntimeException("No active shift found. Start your shift first."));

        if (shift.getBreakStart() != null && shift.getBreakEnd() == null) {
            throw new RuntimeException("Break is already started. End the current break first.");
        }

        shift.setBreakStart(LocalDateTime.now());
        return shiftRepository.save(shift);
    }

    // ▶️ End Break
    public Shift endBreakByBadge(String badgeNumber) {
        Shift shift = shiftRepository.findFirstByEmployee_BadgeNumberIgnoreCaseAndEndTimeIsNullOrderByStartTimeDesc(badgeNumber)
                .orElseThrow(() -> new RuntimeException("No active shift found. Start your shift first."));

        if (shift.getBreakStart() == null) {
            throw new RuntimeException("No break has been started.");
        }

        if (shift.getBreakEnd() != null) {
            throw new RuntimeException("Break has already ended.");
        }

        shift.setBreakEnd(LocalDateTime.now());
        return shiftRepository.save(shift);
    }
}
