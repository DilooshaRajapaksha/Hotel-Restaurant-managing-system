package com.hotel.backend.Repo;

import com.hotel.backend.Entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User, Long> {
}