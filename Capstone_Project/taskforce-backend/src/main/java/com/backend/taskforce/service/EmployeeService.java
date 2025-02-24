package com.backend.taskforce.service;

import com.backend.taskforce.model.Employee;
import com.backend.taskforce.repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
//
//@Service
//public class EmployeeService {
//    private final EmployeeRepository employeeRepository;
//
//    @Autowired
//    public EmployeeService(EmployeeRepository employeeRepository) {
//        this.employeeRepository = employeeRepository;
//    }
//
//    public Employee saveEmployee(Employee employee) {
//        return employeeRepository.save(employee);
//    }
//
//    public List<Employee> getAllEmployees() {
//        return employeeRepository.findAll();
//    }
//
//    public Optional<Employee> getEmployeeById(Long id) {
//        return employeeRepository.findById(id);
//    }
//
//    public void deleteEmployee(Long id) {
//        employeeRepository.deleteById(id);
//    }
//
//    public Optional<Employee> getEmployeeByBadgeNumber(String badgeNumber) {
//        return employeeRepository.findByBadgeNumber(badgeNumber);
//    }
//
//    public Employee updateEmployee(Long id, Employee updatedEmployee) {
//        return employeeRepository.findById(id)
//                .map(existingEmployee -> {
//                    existingEmployee.setJobTitle(updatedEmployee.getJobTitle());
//                    existingEmployee.setJobRole(updatedEmployee.getJobRole());
//                    existingEmployee.setLocation(updatedEmployee.getLocation());
//                    existingEmployee.setManager(updatedEmployee.isManager());
//                    existingEmployee.setManagerPin(updatedEmployee.getManagerPin());
//                    existingEmployee.setName(updatedEmployee.getName());
//                    existingEmployee.setSurname(updatedEmployee.getSurname());
//                    existingEmployee.setBadgeNumber(updatedEmployee.getBadgeNumber());
//                    existingEmployee.setSin(updatedEmployee.getSin());
//                    existingEmployee.setPunchPolicy(updatedEmployee.getPunchPolicy());
//                    existingEmployee.setPhone(updatedEmployee.getPhone());
//                    existingEmployee.setEmail(updatedEmployee.getEmail());
//                    existingEmployee.setAddress(updatedEmployee.getAddress());
//                    existingEmployee.setDateOfBirth(updatedEmployee.getDateOfBirth());
//                    existingEmployee.setSalary(updatedEmployee.getSalary());
//
//                    return employeeRepository.save(existingEmployee);
//                })
//                .orElseThrow(() -> new IllegalArgumentException("Employee with ID " + id + " not found."));
//    }
//}
@Service
public class EmployeeService {
    private final EmployeeRepository employeeRepository;

    @Autowired
    public EmployeeService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
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
}
