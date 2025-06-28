package com.backend.taskforce.controller;

import com.backend.taskforce.model.Shift;
import com.backend.taskforce.service.ShiftService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/shifts")
public class ShiftController {
    private final ShiftService shiftService;

    public ShiftController(ShiftService shiftService) {
        this.shiftService = shiftService;
    }

    // ▶️ Start Shift (with schedule validation)
    @PostMapping("/start")
    public ResponseEntity<?> startShift(@RequestBody Map<String, String> payload) {
        String badgeNumber = payload.get("badgeNumber");
        try {
            Shift shift = shiftService.startShiftByBadge(badgeNumber);
            return ResponseEntity.ok(shift);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(Map.of("error", ex.getMessage()));
        }
    }

    // ⏹ End Shift
    @PostMapping("/end")
    public ResponseEntity<?> endShift(@RequestBody Map<String, String> payload) {
        String badgeNumber = payload.get("badgeNumber");
        return ResponseEntity.ok(shiftService.endShiftByBadge(badgeNumber));
    }

    // ⏸ Start Break
    @PostMapping("/start-break")
    public ResponseEntity<?> startBreak(@RequestBody Map<String, String> payload) {
        String badgeNumber = payload.get("badgeNumber");
        return ResponseEntity.ok(shiftService.startBreakByBadge(badgeNumber));
    }

    // ▶️ End Break
    @PostMapping("/end-break")
    public ResponseEntity<?> endBreak(@RequestBody Map<String, String> payload) {
        String badgeNumber = payload.get("badgeNumber");
        return ResponseEntity.ok(shiftService.endBreakByBadge(badgeNumber));
    }

    // 📅 Get all shifts for an employee
    @GetMapping("/employee/{badgeNumber}")
    public ResponseEntity<?> getShiftsByEmployee(@PathVariable String badgeNumber) {
        return ResponseEntity.ok(shiftService.getShiftsByEmployeeBadge(badgeNumber));
    }
}
