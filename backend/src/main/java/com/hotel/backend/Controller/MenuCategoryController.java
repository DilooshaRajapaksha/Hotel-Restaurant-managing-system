package com.hotel.backend.Controller;

import com.hotel.backend.DTO.MenuCategoryDTO;
import com.hotel.backend.Service.MenuCategoryService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/menu-categories")
@CrossOrigin(origins = "http://localhost:5173")
public class MenuCategoryController {

    private final MenuCategoryService service;

    public MenuCategoryController(MenuCategoryService service) {
        this.service = service;
    }

    @GetMapping
    public List<MenuCategoryDTO> getAllCategories() {
        return service.getAllCategories();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.getCategoryById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody MenuCategoryDTO dto) {
        try {
            MenuCategoryDTO saved = service.saveCategory(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody MenuCategoryDTO dto) {
        try {
            MenuCategoryDTO updated = service.updateCategory(id, dto);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            if ("Category not found.".equals(e.getMessage())) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", e.getMessage()));
            }
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        try {
            service.deleteCategory(id);
            return ResponseEntity.ok(Map.of("message", "Category deleted successfully."));
        } catch (RuntimeException e) {
            if ("Category not found.".equals(e.getMessage())) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", e.getMessage()));
            }
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
