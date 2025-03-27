package com.backend.taskforce.service;

import com.backend.taskforce.model.Employee;
import com.backend.taskforce.model.Schedule;
import com.backend.taskforce.model.Shift;
import com.backend.taskforce.repository.EmployeeRepository;
import com.backend.taskforce.repository.ScheduleRepository;
import com.backend.taskforce.repository.ShiftRepository;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Locale;

@Service
public class ShiftService {
    private final ShiftRepository shiftRepository;
    private final EmployeeRepository employeeRepository;
    private final ScheduleRepository scheduleRepository;

    public ShiftService(ShiftRepository shiftRepository, EmployeeRepository employeeRepository, ScheduleRepository scheduleRepository) {
        this.shiftRepository = shiftRepository;
        this.employeeRepository = employeeRepository;
        this.scheduleRepository = scheduleRepository;
    }

    private Employee findEmployeeByBadge(String badgeNumber) {
        return employeeRepository.findByBadgeNumber(badgeNumber)
                .orElseThrow(() -> new RuntimeException("Employee not found with badge: " + badgeNumber));
    }

    // ⏱ Start Shift with schedule validation
    public Shift startShiftByBadge(String badgeNumber) {
        Employee employee = findEmployeeByBadge(badgeNumber);
        LocalDateTime now = LocalDateTime.now();

        boolean hasScheduleNow = scheduleRepository.findByEmployeeId(employee.getId()).stream().anyMatch(schedule -> {
            try {
                LocalDate startDate = LocalDate.parse(schedule.getStartDate());
                LocalDate endDate = LocalDate.parse(schedule.getEndDate());
                LocalDate today = now.toLocalDate();

                if (!today.isBefore(startDate) && !today.isAfter(endDate)) {
                    LocalTime scheduledStart = LocalTime.parse(schedule.getStartTime());
                    LocalTime scheduledEnd = LocalTime.parse(schedule.getEndTime());
                    LocalDateTime from = LocalDateTime.of(today, scheduledStart);
                    LocalDateTime to = LocalDateTime.of(today, scheduledEnd);
                    return !now.isBefore(from) && !now.isAfter(to);
                }
            } catch (Exception e) {
                System.err.println("Schedule parse error: " + e.getMessage());
            }
            return false;
        });

        if (!hasScheduleNow) {
            throw new RuntimeException("You don't have a scheduled shift right now.");
        }

        Shift shift = new Shift(employee, now);
        return shiftRepository.save(shift);
    }

    public Shift endShiftByBadge(String badgeNumber) {
        Shift shift = shiftRepository.findFirstByEmployee_BadgeNumberIgnoreCaseAndEndTimeIsNullOrderByStartTimeDesc(badgeNumber)
                .orElseThrow(() -> new RuntimeException("No active shift found for badge: " + badgeNumber));
        shift.setEndTime(LocalDateTime.now());
        return shiftRepository.save(shift);
    }

    public Shift startBreakByBadge(String badgeNumber) {
        Shift shift = shiftRepository.findFirstByEmployee_BadgeNumberIgnoreCaseAndEndTimeIsNullOrderByStartTimeDesc(badgeNumber)
                .orElseThrow(() -> new RuntimeException("No active shift found. Start your shift first."));
        if (shift.getBreakStart() != null && shift.getBreakEnd() == null) {
            throw new RuntimeException("Break already started.");
        }
        shift.setBreakStart(LocalDateTime.now());
        return shiftRepository.save(shift);
    }

    public Shift endBreakByBadge(String badgeNumber) {
        Shift shift = shiftRepository.findFirstByEmployee_BadgeNumberIgnoreCaseAndEndTimeIsNullOrderByStartTimeDesc(badgeNumber)
                .orElseThrow(() -> new RuntimeException("No active shift found. Start your shift first."));
        if (shift.getBreakStart() == null) {
            throw new RuntimeException("No break started.");
        }
        if (shift.getBreakEnd() != null) {
            throw new RuntimeException("Break already ended.");
        }
        shift.setBreakEnd(LocalDateTime.now());
        return shiftRepository.save(shift);
    }

    public double calculateHoursWorked(String payPeriod, String badgeNumber) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy", Locale.ENGLISH);
        try {
            String[] dates = payPeriod.split(" - ");
            LocalDate startDate = LocalDate.parse(dates[0].trim(), formatter);
            LocalDate endDate = LocalDate.parse(dates[1].trim(), formatter);
            LocalDateTime from = startDate.atStartOfDay();
            LocalDateTime to = endDate.atTime(23, 59);

            List<Shift> shifts = shiftRepository.findByEmployee_BadgeNumberIgnoreCaseAndStartTimeBetween(badgeNumber, from, to);
            double total = 0;
            for (Shift shift : shifts) {
                if (shift.getEndTime() != null) {
                    Duration worked = Duration.between(shift.getStartTime(), shift.getEndTime());
                    Duration breakTime = (shift.getBreakStart() != null && shift.getBreakEnd() != null)
                            ? Duration.between(shift.getBreakStart(), shift.getBreakEnd())
                            : Duration.ZERO;
                    total += (worked.minus(breakTime)).toMinutes() / 60.0;
                }
            }
            return total;
        } catch (DateTimeParseException e) {
            throw new RuntimeException("Invalid date format: " + payPeriod, e);
        }
    }

    public List<Shift> getShiftsByEmployeeBadge(String badgeNumber) {
        findEmployeeByBadge(badgeNumber); // validation
        return shiftRepository.findByEmployee_BadgeNumberIgnoreCase(badgeNumber);
    }
}
