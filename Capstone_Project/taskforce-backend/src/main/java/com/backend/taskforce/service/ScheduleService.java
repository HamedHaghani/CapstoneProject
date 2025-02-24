package com.backend.taskforce.service;

import com.backend.taskforce.model.Employee;
import com.backend.taskforce.model.Schedule;
import com.backend.taskforce.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final EmployeeService employeeService;


    @Autowired
    public ScheduleService(ScheduleRepository scheduleRepository, EmployeeService employeeService) {
        this.scheduleRepository = scheduleRepository;
        this.employeeService = employeeService;

    }

    // Add a new schedule
    public Schedule addSchedule(Schedule schedule) {
        return scheduleRepository.save(schedule);
    }

    // Get all schedules
    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    // Get schedule by ID
    public Optional<Schedule> getScheduleById(Long id) {
        return scheduleRepository.findById(id);
    }

    // Update schedule
    public Optional<Schedule> updateSchedule(Long id, Schedule updatedSchedule) {
        if (scheduleRepository.existsById(id)) {
            updatedSchedule.setId(id);
            return Optional.of(scheduleRepository.save(updatedSchedule));
        }
        return Optional.empty();
    }

    // Delete schedule
    public boolean deleteSchedule(Long id) {
        if (scheduleRepository.existsById(id)) {
            scheduleRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Fetch schedules by employee ID
    public List<Schedule> getSchedulesByEmployeeId(Long employeeId) {
        return scheduleRepository.findByEmployeeId(employeeId);
    }

    public List<Schedule> getSchedulesByBadgeNumber(String badge) {
        Optional<Employee> employee = employeeService.getEmployeeByBadgeNumber(badge);

        if (employee.isEmpty()) return new ArrayList<>();

        return scheduleRepository.findByEmployeeId(employee.get().getId());
    }


}
