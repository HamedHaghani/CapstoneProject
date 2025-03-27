package com.backend.taskforce.service;

import com.backend.taskforce.model.*;
import com.backend.taskforce.repository.EmployeeRepository;
import com.backend.taskforce.repository.PaymentRepository;
import com.backend.taskforce.repository.ScheduleRepository;
import com.backend.taskforce.repository.ShiftRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class EmployeeService {
    private final EmployeeRepository employeeRepository;
    private final ScheduleRepository scheduleRepository;
    private final ShiftRepository shiftRepository;
    private final PaymentRepository paymentRepository;
    private final ShiftService shiftService;
    private final ConfigurationService configurationService;

    @Autowired
    public EmployeeService(EmployeeRepository employeeRepository, ScheduleRepository scheduleRepository,
                           ShiftRepository shiftRepository, PaymentRepository paymentRepository, ShiftService shiftService, ConfigurationService configurationService) {
        this.employeeRepository = employeeRepository;
        this.scheduleRepository = scheduleRepository;
        this.shiftRepository = shiftRepository;
        this.paymentRepository = paymentRepository;
        this.shiftService = shiftService;
        this.configurationService = configurationService;
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
        double tax = totalEarnings * 0.13; // Assume 15% tax
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

    public List<Map<String, Object>> getEmployeeWorkedHours(String payPeriod) {
        List<Employee> employees = employeeRepository.findAll();
        List<Map<String, Object>> employeeHoursList = new ArrayList<>();

        for (Employee employee : employees) {
            double workedHours = shiftService.calculateHoursWorked(payPeriod, employee.getBadgeNumber());

            Map<String, Object> employeeData = new HashMap<>();
            employeeData.put("name", employee.getName() + " " + employee.getSurname());
            employeeData.put("badgeNumber", employee.getBadgeNumber());
            employeeData.put("workedHours", workedHours);
            employeeData.put("payPeriod", payPeriod);

            employeeHoursList.add(employeeData);
        }

        return employeeHoursList;
    }


    public Map<String, Object> getEmployeePaymentDetailsCezar(String badgeNumber, String payPeriod) {
        Employee employee = employeeRepository.findByBadgeNumber(badgeNumber)
                .orElseThrow(() -> new RuntimeException("Employee not found with badge: " + badgeNumber));

        // Get total hours worked using ShiftService
        double totalHours = shiftService.calculateHoursWorked(payPeriod, badgeNumber);

        // Get tax rate dynamically from ConfigurationService
        double taxRate = getTaxRateFromConfiguration();

        // Calculate earnings
        double hourlyRate = employee.getSalary();
        double totalEarnings = totalHours * hourlyRate;
        double tax = totalEarnings * taxRate;
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
        paymentDetails.put("payPeriod", payPeriod);

        return paymentDetails;
    }

    private double getTaxRateFromConfiguration() {
        try {
            // Assume ConfigurationService stores tax rate in the latest config
            return configurationService.getLatestConfiguration()
                    .map(Configuration::getTaxPercentage)  // Ensure Configuration class has getTaxRate() method
                    .orElse(0.15);  // Default tax rate (15%) if no configuration is found
        } catch (Exception e) {
            throw new RuntimeException("Failed to retrieve tax rate from configuration: " + e.getMessage());
        }
    }

}
