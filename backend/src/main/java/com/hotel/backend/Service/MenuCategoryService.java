package com.hotel.backend.Service;

import com.hotel.backend.DTO.MenuCategoryDTO;
import com.hotel.backend.Entity.MenuCategory;
import com.hotel.backend.Repo.MenuCategoryRepo;
import com.hotel.backend.Repo.MenuItemRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MenuCategoryService {

    private final MenuCategoryRepo repo;
    private final MenuItemRepo menuItemRepo;

    public MenuCategoryService(MenuCategoryRepo repo, MenuItemRepo menuItemRepo) {
        this.repo = repo;
        this.menuItemRepo = menuItemRepo;
    }

    public List<MenuCategoryDTO> getAllCategories() {
        return repo.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public MenuCategoryDTO getCategoryById(Long id) {
        MenuCategory category = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found."));
        return toDTO(category);
    }

    public MenuCategoryDTO saveCategory(MenuCategoryDTO dto) {
        String categoryName = dto.getCategory_name() != null ? dto.getCategory_name().trim() : "";

        if (categoryName.isEmpty()) {
            throw new RuntimeException("Category name is required.");
        }

        if (repo.existsByCategoryNameIgnoreCase(categoryName)) {
            throw new RuntimeException("Category name already exists.");
        }

        MenuCategory category = new MenuCategory();
        category.setCategoryName(categoryName);
        category.setDescription(dto.getDescription());
        category.setIsActive(dto.getIs_active() != null ? dto.getIs_active() : true);

        MenuCategory saved = repo.save(category);
        return toDTO(saved);
    }

    public MenuCategoryDTO updateCategory(Long id, MenuCategoryDTO dto) {
        MenuCategory existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found."));

        String categoryName = dto.getCategory_name() != null ? dto.getCategory_name().trim() : "";

        if (categoryName.isEmpty()) {
            throw new RuntimeException("Category name is required.");
        }

        if (repo.existsByCategoryNameIgnoreCaseAndCategoryIdNot(categoryName, id)) {
            throw new RuntimeException("Category name already exists.");
        }

        existing.setCategoryName(categoryName);
        existing.setDescription(dto.getDescription());
        existing.setIsActive(dto.getIs_active() != null ? dto.getIs_active() : true);

        MenuCategory updated = repo.save(existing);
        return toDTO(updated);
    }

    public void deleteCategory(Long id) {
        MenuCategory existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found."));

        if (menuItemRepo.existsByCategoryId(id)) {
            throw new RuntimeException("Cannot delete category because it is linked to menu items.");
        }

        repo.delete(existing);
    }

    private MenuCategoryDTO toDTO(MenuCategory c) {
        MenuCategoryDTO dto = new MenuCategoryDTO();
        dto.setCategory_id(c.getCategoryId());
        dto.setCategory_name(c.getCategoryName());
        dto.setDescription(c.getDescription());
        dto.setIs_active(c.getIsActive());
        return dto;
    }
}
