package com.backend.taskforce.repository;

import com.backend.taskforce.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // ✅ Get all payments for an employee using badge number
    List<Payment> findByEmployee_BadgeNumberOrderByPaymentDateDesc(String badgeNumber);

}
