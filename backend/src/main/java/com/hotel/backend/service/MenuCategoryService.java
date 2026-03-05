package com.hotel.backend.service;

import com.hotel.backend.dto.MenuCategoryDTO;
import com.hotel.backend.entity.MenuCategory;
import com.hotel.backend.repo.MenuCategoryRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MenuCategoryService {

    private final MenuCategoryRepo repo;

    public MenuCategoryService(MenuCategoryRepo repo) {
        this.repo = repo;
    }

    public List<MenuCategoryDTO> getAllCategories() {
        return repo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    private MenuCategoryDTO toDTO(MenuCategory c) {
        MenuCategoryDTO dto = new MenuCategoryDTO();
        dto.setCategory_id(c.getCategoryId());
        dto.setCategory_name(c.getCategoryName());
        return dto;
    }
}
