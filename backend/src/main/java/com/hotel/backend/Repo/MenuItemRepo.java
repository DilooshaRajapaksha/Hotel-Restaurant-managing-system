package com.hotel.backend.Repo;

import com.hotel.backend.Entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuItemRepo extends JpaRepository<MenuItem, Long> {
    boolean existsByCategoryId(Long categoryId);
}

