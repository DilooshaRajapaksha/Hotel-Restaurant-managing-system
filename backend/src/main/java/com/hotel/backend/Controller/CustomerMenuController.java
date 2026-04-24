package com.hotel.backend.Controller;

import com.hotel.backend.DTO.MenuCategoryDTO;
import com.hotel.backend.DTO.MenuItemDTO;
import com.hotel.backend.Service.MenuCategoryService;
import com.hotel.backend.Service.MenuItemService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/public/menu")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerMenuController {

    private final MenuItemService menuItemService;
    private final MenuCategoryService categoryService;

    public CustomerMenuController(MenuItemService menuItemService, MenuCategoryService categoryService) {
        this.menuItemService = menuItemService;
        this.categoryService = categoryService;
    }

    @GetMapping
    public List<MenuItemDTO> getMenuItems(@RequestParam(required = false) Long categoryId) {
        List<MenuItemDTO> items = menuItemService.getAllItems();

        if (categoryId != null) {
            return items.stream()
                    .filter(item ->
                            item.getCategory_id() != null &&
                                    item.getCategory_id().equals(categoryId)
                    )
                    .collect(Collectors.toList());
        }

        return items;
    }

    @GetMapping("/categories")
    public List<MenuCategoryDTO> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @GetMapping("/featured")
    public List<MenuItemDTO> getFeaturedItems() {
        return menuItemService.getAllItems()
                .stream()
                .filter(item ->
                        item.getIs_available() != null &&
                                item.getIs_available()
                )
                .limit(6)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public MenuItemDTO getMenuItemById(@PathVariable Long id) {
        return menuItemService.getItem(id);
    }
}