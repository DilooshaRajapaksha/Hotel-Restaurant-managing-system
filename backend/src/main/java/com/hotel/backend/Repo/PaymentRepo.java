package com.hotel.backend.Repo;

import com.hotel.backend.Entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentRepo extends JpaRepository<Payment, Long> {
    Optional<Payment> findByOrderOrderId(Long orderId);
}
