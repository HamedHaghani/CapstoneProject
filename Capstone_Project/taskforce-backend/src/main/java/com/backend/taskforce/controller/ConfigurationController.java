package com.backend.taskforce.controller;

import com.backend.taskforce.model.Configuration;
import com.backend.taskforce.service.ConfigurationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/configuration")
public class ConfigurationController {

    @Autowired
    private ConfigurationService configurationService;

    @PostMapping("/save")
    public ResponseEntity<Configuration> saveConfiguration(@RequestBody Configuration config) {
        System.out.println("******** This is config Tax: " + config.getTaxPercentage());
        Configuration savedConfig = configurationService.saveConfiguration(config);
        return ResponseEntity.ok(savedConfig);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Configuration>> getAllConfigurations() {
        List<Configuration> configurations = configurationService.getAllConfigurations();
        return ResponseEntity.ok(configurations);
    }

    @GetMapping
    public ResponseEntity<Configuration> getConfiguration() {
        List<Configuration> configurations = configurationService.getAllConfigurations();
        if (!configurations.isEmpty()) {
            return ResponseEntity.ok(configurations.getFirst()); // Return first config
        }
        return ResponseEntity.ok(new Configuration()); // Return empty config if none exist
    }
    @GetMapping("/payperiods")
    public ResponseEntity<List<String>> getPayPeriods() {
        List<String> payPeriods = configurationService.getPayPeriods();
        return ResponseEntity.ok(payPeriods);
    }
}

