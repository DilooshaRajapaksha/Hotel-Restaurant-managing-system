package com.hotel.backend.Repo;

import com.hotel.backend.Entity.DeliveryStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeliveryStaffRepo extends JpaRepository<DeliveryStaff, Long> {
    Optional<DeliveryStaff> findByEmail(String email);
    boolean existsByEmail(String email);
}
