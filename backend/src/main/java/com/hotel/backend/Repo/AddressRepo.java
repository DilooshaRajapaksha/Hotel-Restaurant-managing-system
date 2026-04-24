package com.hotel.backend.Repo;

import com.hotel.backend.Entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AddressRepo extends JpaRepository<Address, Long> {
    Optional<Address> findFirstByUserUserIdAndIsDefaultTrue(Long userId);
    Optional<Address> findFirstByUserUserId(Long userId);
}
