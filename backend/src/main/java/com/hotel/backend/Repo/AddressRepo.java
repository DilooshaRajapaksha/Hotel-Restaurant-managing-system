package com.hotel.backend.Repo;

import com.hotel.backend.Entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AddressRepo extends JpaRepository<Address, Long> {
    List<Address> findByUserUserId(Long userId);
    Optional<Address> findByUserUserIdAndIsDefaultTrue(Long userId);
}