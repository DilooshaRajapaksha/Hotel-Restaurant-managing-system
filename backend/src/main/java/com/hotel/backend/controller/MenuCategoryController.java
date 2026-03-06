package com.hotel.backend.controller;

import com.hotel.backend.dto.MenuCategoryDTO;
import com.hotel.backend.service.MenuCategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/menu-categories")
@CrossOrigin(origins = "http://localhost:5173")
public class MenuCategoryController {

    private final MenuCategoryService service;

    public MenuCategoryController(MenuCategoryService service) {
        this.service = service;
    }

    // GET http://localhost:8081/api/admin/menu-categories
    @GetMapping
    public List<MenuCategoryDTO> getAllCategories() {
        return service.getAllCategories();
    }
}