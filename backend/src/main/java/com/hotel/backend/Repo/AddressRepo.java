package com.hotel.backend.Repo;

import com.hotel.backend.Entity.Address;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AddressRepo extends JpaRepository<Address, Long> {
}
