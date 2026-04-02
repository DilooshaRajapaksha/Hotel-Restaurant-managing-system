package com.hotel.backend.Repo;

import com.hotel.backend.Entity.MenuCategory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuCategoryRepo extends JpaRepository<MenuCategory, Long> {
    boolean existsByCategoryNameIgnoreCase(String categoryName);
    boolean existsByCategoryNameIgnoreCaseAndCategoryIdNot(String categoryName, Long categoryId);
}


