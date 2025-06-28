package com.backend.taskforce.controller;

import com.backend.taskforce.model.Schedule;
import com.backend.taskforce.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/schedules")
public class ScheduleController {

    private final ScheduleService scheduleService;

    @Autowired
    public ScheduleController(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    // Create Schedule
    @PostMapping
    public ResponseEntity<Schedule> addSchedule(@Valid @RequestBody Schedule schedule) {
        Schedule createdSchedule = scheduleService.addSchedule(schedule);
        return ResponseEntity.ok(createdSchedule);
    }

    @GetMapping("/employee/{badgeNumber}/schedules")
    public ResponseEntity<List<Schedule>> getEmployeeSchedulesByBadgeNumber(@PathVariable String badgeNumber) {
        List<Schedule> schedules = scheduleService.getSchedulesByBadgeNumber(badgeNumber);
        return schedules.isEmpty()
                ? ResponseEntity.noContent().build()
                : ResponseEntity.ok(schedules);
    }


    // Get All Schedules
    @GetMapping
    public ResponseEntity<List<Schedule>> getAllSchedules() {
        List<Schedule> schedules = scheduleService.getAllSchedules();
        return ResponseEntity.ok(schedules);
    }

    // Get Schedule by ID
    @GetMapping("/{id}")
    public ResponseEntity<Schedule> getScheduleById(@PathVariable Long id) {
        Optional<Schedule> schedule = scheduleService.getScheduleById(id);
        return schedule.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get Schedules by Employee ID
    @GetMapping("/employee/{employeeId}")
    public ResponseEntity<List<Schedule>> getSchedulesByEmployeeId(@PathVariable Long employeeId) {
        List<Schedule> schedules = scheduleService.getSchedulesByEmployeeId(employeeId);
        return schedules.isEmpty() ? ResponseEntity.noContent().build() : ResponseEntity.ok(schedules);
    }

    // Update Schedule
    @PutMapping("/{id}")
    public ResponseEntity<Schedule> updateSchedule(@PathVariable Long id, @Valid @RequestBody Schedule updatedSchedule) {
        Optional<Schedule> existingSchedule = scheduleService.updateSchedule(id, updatedSchedule);
        return existingSchedule.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete Schedule
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        boolean deleted = scheduleService.deleteSchedule(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
