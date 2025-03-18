package com.backend.taskforce.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "employee_id", nullable = false)
    private Employee employee;  // Relationship to Employee

    private double grossEarnings;
    private double taxDeductions;
    private double netPay;
    private LocalDate paymentDate;
    private String payPeriod; // Example: "2025-03-03 to 2025-03-17"

    // ✅ Constructors
    public Payment() {}

    public Payment(Employee employee, double grossEarnings, double taxDeductions, double netPay, LocalDate paymentDate, String payPeriod) {
        this.employee = employee;
        this.grossEarnings = grossEarnings;
        this.taxDeductions = taxDeductions;
        this.netPay = netPay;
        this.paymentDate = paymentDate;
        this.payPeriod = payPeriod;
    }

    // ✅ Getters and Setters
    public Long getId() { return id; }
    public Employee getEmployee() { return employee; }
    public double getGrossEarnings() { return grossEarnings; }
    public double getTaxDeductions() { return taxDeductions; }
    public double getNetPay() { return netPay; }
    public LocalDate getPaymentDate() { return paymentDate; }
    public String getPayPeriod() { return payPeriod; }

    public void setId(Long id) { this.id = id; }
    public void setEmployee(Employee employee) { this.employee = employee; }
    public void setGrossEarnings(double grossEarnings) { this.grossEarnings = grossEarnings; }
    public void setTaxDeductions(double taxDeductions) { this.taxDeductions = taxDeductions; }
    public void setNetPay(double netPay) { this.netPay = netPay; }
    public void setPaymentDate(LocalDate paymentDate) { this.paymentDate = paymentDate; }
    public void setPayPeriod(String payPeriod) { this.payPeriod = payPeriod; }
}
