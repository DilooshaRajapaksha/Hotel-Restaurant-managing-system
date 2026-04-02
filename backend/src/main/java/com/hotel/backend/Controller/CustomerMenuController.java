package com.hotel.backend.Controller;

import com.hotel.backend.DTO.MenuCategoryDTO;
import com.hotel.backend.DTO.MenuItemDTO;
import com.hotel.backend.Service.MenuCategoryService;
import com.hotel.backend.Service.MenuItemService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public/menu")   // ← Anyone can see menu
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerMenuController {

    private final MenuItemService menuItemService;
    private final MenuCategoryService categoryService;

    public CustomerMenuController(MenuItemService menuItemService, MenuCategoryService categoryService) {
        this.menuItemService = menuItemService;
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<MenuItemDTO> getAllMenuItems() {
        return menuItemService.getAllItems();
    }

    @GetMapping("/categories")
    public List<MenuCategoryDTO> getAllCategories() {
        return categoryService.getAllCategories();
    }
}