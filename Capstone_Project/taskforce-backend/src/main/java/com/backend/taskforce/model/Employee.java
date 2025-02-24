package com.backend.taskforce.model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;


@Entity
public class Employee {
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getJobRole() {
        return jobRole;
    }

    public void setJobRole(String jobRole) {
        this.jobRole = jobRole;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public boolean isManager() {
        return isManager;
    }

    public void setManager(boolean manager) {
        isManager = manager;
    }

    public String getManagerPin() {
        return managerPin;
    }

    public void setManagerPin(String managerPin) {
        this.managerPin = managerPin;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getBadgeNumber() {
        return badgeNumber;
    }

    public void setBadgeNumber(String badgeNumber) {
        this.badgeNumber = badgeNumber;
    }

    public String getSin() {
        return sin;
    }

    public void setSin(String sin) {
        this.sin = sin;
    }

    public String getPunchPolicy() {
        return punchPolicy;
    }

    public void setPunchPolicy(String punchPolicy) {
        this.punchPolicy = punchPolicy;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getDateOfBirth() {
        return dateOfBirth;
    }
    public boolean isUnassigned() {
        return isUnassigned;
    }

    public void setUnassigned(boolean unassigned) {
        isUnassigned = unassigned;
    }

    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    private String jobTitle;
    private String jobRole;
    private String location;
    private boolean isManager;
    private boolean isUnassigned = false;
    private String managerPin;
    private String name;

    public Float getSalary() {
        return salary;
    }

    public void setSalary(Float salary) {
        this.salary = salary;
    }

    @OneToMany(mappedBy = "employee")
    private List<Schedule> schedules;

    private Float salary;
    private String surname;
    private String badgeNumber;
    private String sin;
    private String punchPolicy;
    private String phone;
    private String email;
    private String address;
    private String dateOfBirth;

    // Getters and setters
}
