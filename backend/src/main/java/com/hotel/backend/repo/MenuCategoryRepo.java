package com.hotel.backend.repo;

import com.hotel.backend.entity.MenuCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuCategoryRepo extends JpaRepository<MenuCategory, Long> {
}