package com.backend.taskforce.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Configuration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate payPeriodStartDate;
    private String scheduleType;
    private int minutesBeforeShift;
    private String adminPassword;
    private boolean isAdminPasswordChanged;
    private double taxPercentage;

    public Configuration() {}

    public Configuration(LocalDate payPeriodStartDate, String scheduleType, int minutesBeforeShift, String adminPassword,
                         boolean isAdminPasswordChanged, double taxPercentage) {
        this.payPeriodStartDate = payPeriodStartDate;
        this.scheduleType = scheduleType;
        this.minutesBeforeShift = minutesBeforeShift;
        this.adminPassword = adminPassword;
        this.isAdminPasswordChanged = isAdminPasswordChanged;
        this.taxPercentage = taxPercentage;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDate getPayPeriodStartDate() { return payPeriodStartDate; }
    public void setPayPeriodStartDate(LocalDate payPeriodStartDate) { this.payPeriodStartDate = payPeriodStartDate; }

    public String getScheduleType() { return scheduleType; }
    public void setScheduleType(String scheduleType) { this.scheduleType = scheduleType; }

    public int getMinutesBeforeShift() { return minutesBeforeShift; }
    public void setMinutesBeforeShift(int minutesBeforeShift) { this.minutesBeforeShift = minutesBeforeShift; }

    public String getAdminPassword() { return adminPassword; }
    public void setAdminPassword(String adminPassword) { this.adminPassword = adminPassword; }

    public boolean isAdminPasswordChanged() { return isAdminPasswordChanged; }
    public void setAdminPasswordChanged(boolean adminPasswordChanged) { isAdminPasswordChanged = adminPasswordChanged; }

    public double getTaxPercentage() { return taxPercentage; }
    public void setTaxPercentage(double taxPercentage) { this.taxPercentage = taxPercentage; }


}
