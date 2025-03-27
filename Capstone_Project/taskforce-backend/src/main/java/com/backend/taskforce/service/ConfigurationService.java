package com.backend.taskforce.service;

import com.backend.taskforce.model.Configuration;
import com.backend.taskforce.repository.ConfigurationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ConfigurationService {

    @Autowired
    private ConfigurationRepository configurationRepository;

    public Configuration saveConfiguration(Configuration config) {
        // Validate required fields
        System.out.println("#### This is config ID: " + config.getId());
        System.out.println("#### This is config ScheduleType: " + config.getPayPeriodStartDate());
        System.out.println("#### This is config ScheduleType: " + config.getScheduleType());
        System.out.println("#### This is config Tax: " + config.getTaxPercentage());
//         configurationRepository.deleteAll();

        if (config.getPayPeriodStartDate() == null || config.getScheduleType() == null) {
            throw new IllegalArgumentException("Pay period start date and schedule type are required.");
        }

        // Check if config ID is null (new entry)
        if (config.getId() == null) {
            return configurationRepository.save(config);  // Directly save a new entry
        }

        // If ID is present, attempt to update existing configuration
        Optional<Configuration> existingConfig = configurationRepository.findLatestConfiguration();
//        Optional<Configuration> existingConfig = configurationRepository.findById(config.getId());

        if (existingConfig.isPresent()) {
            Configuration updatedConfig = existingConfig.get();
            updatedConfig.setPayPeriodStartDate(config.getPayPeriodStartDate());
            updatedConfig.setScheduleType(config.getScheduleType());
            updatedConfig.setMinutesBeforeShift(config.getMinutesBeforeShift());
            updatedConfig.setAdminPassword(config.getAdminPassword());
            updatedConfig.setTaxPercentage(config.getTaxPercentage());
            updatedConfig.setAdminPasswordChanged(config.isAdminPasswordChanged());

            return configurationRepository.save(updatedConfig);
        } else {
            return configurationRepository.save(config);
        }
    }


    public List<Configuration> getAllConfigurations() {
        return configurationRepository.findAll();
    }

    public List<String> getPayPeriods() {
        Optional<Configuration> configOpt = configurationRepository.findLatestConfiguration();

        if (configOpt.isEmpty()) {
            throw new RuntimeException("No configuration found.");
        }

        Configuration config = configOpt.get();
        LocalDate startDate = config.getPayPeriodStartDate();
        String scheduleType = config.getScheduleType();
        LocalDate currentDate = LocalDate.now();
        List<String> payPeriods = new ArrayList<>();

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMMM dd, yyyy");

        while (!startDate.isAfter(currentDate)) {
            LocalDate endDate;
            if ("biweekly".equalsIgnoreCase(scheduleType)) {
                endDate = startDate.plusDays(13); // 14-day period
            } else if ("monthly".equalsIgnoreCase(scheduleType)) {
                endDate = startDate.plusMonths(1).minusDays(1);
            } else {
                throw new IllegalArgumentException("Unsupported schedule type: " + scheduleType);
            }

            payPeriods.add(startDate.format(formatter) + " - " + endDate.format(formatter));
            startDate = endDate.plusDays(1);
        }

        return payPeriods;
    }

    public Optional<Configuration> getLatestConfiguration() {
        return configurationRepository.findLatestConfiguration();
    }
}

