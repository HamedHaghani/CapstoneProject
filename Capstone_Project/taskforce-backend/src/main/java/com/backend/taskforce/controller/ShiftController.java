package com.backend.taskforce.controller;

import com.backend.taskforce.model.Shift;
import com.backend.taskforce.service.ShiftService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/shifts")
public class ShiftController {
    private final ShiftService shiftService;

    public ShiftController(ShiftService shiftService) {
        this.shiftService = shiftService;
    }

    // ▶️ Start Shift
    @PostMapping("/start")
    public ResponseEntity<?> startShift(@RequestBody Map<String, String> payload) {
        String badgeNumber = payload.get("badgeNumber");
        return ResponseEntity.ok(shiftService.startShiftByBadge(badgeNumber));
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
}
