package com.backend.taskforce.controller;

import com.backend.taskforce.model.Employee;
import com.backend.taskforce.service.EmployeeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
//
//@RestController
//@RequestMapping("/api/employees")
//public class EmployeeController {
//    private final EmployeeService employeeService;
//
//    @Autowired
//    public EmployeeController(EmployeeService employeeService) {
//        this.employeeService = employeeService;
//    }
//
//    @PostMapping
//    public Employee addEmployee(@RequestBody Employee employee) {
//        return employeeService.saveEmployee(employee);
//    }
//
//    @GetMapping("/badge/{badgeNumber}")
//    public ResponseEntity<Employee> getEmployeeByBadgeNumber(@PathVariable String badgeNumber) {
//        return employeeService.getEmployeeByBadgeNumber(badgeNumber)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }
//
//    @GetMapping
//    public List<Employee> getAllEmployees() {
//        return employeeService.getAllEmployees();
//    }
//
//    @GetMapping("/{id}")
//    public Optional<Employee> getEmployeeById(@PathVariable Long id) {
//        return employeeService.getEmployeeById(id);
//    }
//
//    @DeleteMapping("/{id}")
//    public void deleteEmployee(@PathVariable Long id) {
//        employeeService.deleteEmployee(id);
//    }
//
//    @PutMapping("/{id}")
//    public ResponseEntity<Employee> updateEmployee(
//            @PathVariable Long id,
//            @Valid @RequestBody Employee updatedEmployee) {
//        Employee employee = employeeService.updateEmployee(id, updatedEmployee);
//        return ResponseEntity.ok(employee);
//    }
//}
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {
    private final EmployeeService employeeService;

    @Autowired
    public EmployeeController(EmployeeService employeeService) {
        this.employeeService = employeeService;
    }

    @PostMapping
    public Employee addEmployee(@RequestBody Employee employee) {
        return employeeService.saveEmployee(employee);
    }

    @GetMapping("/badge/{badgeNumber}")
    public ResponseEntity<Employee> getEmployeeByBadgeNumber(@PathVariable String badgeNumber) {
        return employeeService.getEmployeeByBadgeNumber(badgeNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public List<Employee> getAllEmployees() {
        return employeeService.getAllEmployees();
    }

    @GetMapping("/{id}")
    public Optional<Employee> getEmployeeById(@PathVariable Long id) {
        return employeeService.getEmployeeById(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEmployee(@PathVariable Long id) {
        employeeService.deleteEmployee(id);
        return ResponseEntity.ok("Employee marked as unassigned.");
    }

    @PutMapping("/{id}")
    public ResponseEntity<Employee> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody Employee updatedEmployee) {
        Employee employee = employeeService.updateEmployee(id, updatedEmployee);
        return ResponseEntity.ok(employee);
    }
}
