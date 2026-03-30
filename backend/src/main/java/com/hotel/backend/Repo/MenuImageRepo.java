package com.hotel.backend.Repo;

import com.hotel.backend.Entity.MenuImage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuImageRepo extends JpaRepository<MenuImage, Long> {
    List<MenuImage> findByItemId(Long itemId);
}