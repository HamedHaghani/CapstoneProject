package com.backend.taskforce.service;

import com.backend.taskforce.model.Employee;
import com.backend.taskforce.model.Payment;
import com.backend.taskforce.model.Schedule;
import com.backend.taskforce.model.Shift;
import com.backend.taskforce.repository.EmployeeRepository;
import com.backend.taskforce.repository.PaymentRepository;
import com.backend.taskforce.repository.ScheduleRepository;
import com.backend.taskforce.repository.ShiftRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final ScheduleRepository scheduleRepository;
    private final ShiftRepository shiftRepository;
    private final PaymentRepository paymentRepository;

    @Autowired
    public EmployeeService(EmployeeRepository employeeRepository, ScheduleRepository scheduleRepository,
                           ShiftRepository shiftRepository, PaymentRepository paymentRepository) {
        this.employeeRepository = employeeRepository;
        this.scheduleRepository = scheduleRepository;
        this.shiftRepository = shiftRepository;
        this.paymentRepository = paymentRepository;
    }

    public Employee saveEmployee(Employee employee) {
        return employeeRepository.save(employee);
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findByIsUnassignedFalse(); // Return only active employees
    }

    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }

    public void deleteEmployee(Long id) {
        employeeRepository.findById(id).ifPresent(employee -> {
            employee.setUnassigned(true); // Mark as unassigned instead of deleting
            employeeRepository.save(employee);
        });
    }

    public Optional<Employee> getEmployeeByBadgeNumber(String badgeNumber) {
        return employeeRepository.findByBadgeNumber(badgeNumber);
    }

    public Employee updateEmployee(Long id, Employee updatedEmployee) {
        return employeeRepository.findById(id)
                .map(existingEmployee -> {
                    existingEmployee.setJobTitle(updatedEmployee.getJobTitle());
                    existingEmployee.setJobRole(updatedEmployee.getJobRole());
                    existingEmployee.setLocation(updatedEmployee.getLocation());
                    existingEmployee.setManager(updatedEmployee.isManager());
                    existingEmployee.setManagerPin(updatedEmployee.getManagerPin());
                    existingEmployee.setName(updatedEmployee.getName());
                    existingEmployee.setSurname(updatedEmployee.getSurname());
                    existingEmployee.setBadgeNumber(updatedEmployee.getBadgeNumber());
                    existingEmployee.setSin(updatedEmployee.getSin());
                    existingEmployee.setPunchPolicy(updatedEmployee.getPunchPolicy());
                    existingEmployee.setPhone(updatedEmployee.getPhone());
                    existingEmployee.setEmail(updatedEmployee.getEmail());
                    existingEmployee.setAddress(updatedEmployee.getAddress());
                    existingEmployee.setDateOfBirth(updatedEmployee.getDateOfBirth());
                    existingEmployee.setSalary(updatedEmployee.getSalary());
                    existingEmployee.setUnassigned(updatedEmployee.isUnassigned());

                    return employeeRepository.save(existingEmployee);
                })
                .orElseThrow(() -> new IllegalArgumentException("Employee with ID " + id + " not found."));
    }

    // 🔹 Get Employee Profile by Badge
    public Employee getEmployeeProfileByBadge(String badgeNumber) {
        return employeeRepository.findByBadgeNumber(badgeNumber)
                .orElseThrow(() -> new RuntimeException("Employee not found with badge: " + badgeNumber));
    }

    // 🔹 Get Employee Schedules by Badge
    public List<Schedule> getEmployeeSchedulesByBadge(String badgeNumber) {
        Employee employee = employeeRepository.findByBadgeNumber(badgeNumber)
                .orElseThrow(() -> new RuntimeException("Employee not found with badge: " + badgeNumber));
        return scheduleRepository.findByEmployeeId(employee.getId());
    }

    // 🔹 New: Get Employee Payments Details (Total hours, salary, tax, net pay)
    public Map<String, Object> getEmployeePaymentDetails(String badgeNumber) {
        Employee employee = employeeRepository.findByBadgeNumber(badgeNumber)
                .orElseThrow(() -> new RuntimeException("Employee not found with badge: " + badgeNumber));

        // Define the pay period (last 14 days)
        LocalDate startDate = LocalDate.now().minus(14, ChronoUnit.DAYS);
        LocalDate endDate = LocalDate.now();

        List<Shift> shifts = shiftRepository.findByEmployee_BadgeNumberIgnoreCaseAndStartTimeBetween(
                badgeNumber,
                startDate.atStartOfDay(),
                endDate.atTime(23, 59, 59)
        );

        // Calculate total worked hours
        double totalHours = shifts.stream()
                .filter(shift -> shift.getEndTime() != null) // Exclude incomplete shifts
                .mapToDouble(shift -> ChronoUnit.MINUTES.between(shift.getStartTime(), shift.getEndTime()) / 60.0)
                .sum();

        // Calculate earnings
        double hourlyRate = employee.getSalary();
        double totalEarnings = totalHours * hourlyRate;
        double tax = totalEarnings * 0.15; // Assume 15% tax
        double netPay = totalEarnings - tax;

        // Create response
        Map<String, Object> paymentDetails = new HashMap<>();
        paymentDetails.put("employeeName", employee.getName() + " " + employee.getSurname());
        paymentDetails.put("badgeNumber", badgeNumber);
        paymentDetails.put("totalHoursWorked", totalHours);
        paymentDetails.put("hourlyRate", hourlyRate);
        paymentDetails.put("grossEarnings", totalEarnings);
        paymentDetails.put("taxDeductions", tax);
        paymentDetails.put("netPay", netPay);
        paymentDetails.put("payPeriod", startDate + " to " + endDate);

        return paymentDetails;
    }

    // ✅ Fetch multiple past payments using badge number
    public List<Payment> getEmployeePaymentsByBadge(String badgeNumber) {
        Employee employee = employeeRepository.findByBadgeNumber(badgeNumber)
                .orElseThrow(() -> new RuntimeException("Employee not found with badge: " + badgeNumber));

        return paymentRepository.findByEmployee_BadgeNumberOrderByPaymentDateDesc(badgeNumber);
    }
}
