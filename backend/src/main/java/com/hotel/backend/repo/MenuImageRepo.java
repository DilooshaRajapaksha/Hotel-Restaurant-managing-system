package com.hotel.backend.repo;

import com.hotel.backend.entity.MenuImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuImageRepo extends JpaRepository<MenuImage, Long> {
    List<MenuImage> findByItemId(Long itemId);
}