package com.hotel.backend.Controller;

import com.hotel.backend.DTO.MenuItemDTO;
import com.hotel.backend.Service.MenuItemService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/menu-items")
@CrossOrigin(origins = "http://localhost:5173")
public class MenuItemController {

    private final MenuItemService service;

    public MenuItemController(MenuItemService service) {
        this.service = service;
    }

    //GET /api/admin/menu-items
    @GetMapping
    public List<MenuItemDTO> getAll() {
        return service.getAllItems();
    }

    //GET /api/admin/menu-items/{id}
    @GetMapping("/{id}")
    public MenuItemDTO getOne(@PathVariable Long id) {
        return service.getItem(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        try {
            service.deleteItem(id);
            return ResponseEntity.ok(Map.of("message", "Menu item deleted successfully."));
        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "You can't delete this item because it is used in current orders."));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to delete menu item."));
        }
    }

    //POST multipart (fields + images)
    @PostMapping(consumes = "multipart/form-data")
    public MenuItemDTO create(
            @RequestParam String item_name,
            @RequestParam Long category_id,
            @RequestParam(required = false) String description,
            @RequestParam BigDecimal price,
            @RequestParam(required = false) BigDecimal half_price,
            @RequestParam(required = false) BigDecimal full_price,
            @RequestParam(required = false) Integer preparation_time,
            @RequestParam(defaultValue = "true") Boolean is_available,
            @RequestPart(required = false) List<MultipartFile> images
    ) throws Exception {

        MenuItemDTO dto = new MenuItemDTO();
        dto.setItem_name(item_name);
        dto.setCategory_id(category_id);
        dto.setDescription(description);
        dto.setPrice(price);
        dto.setHalf_price(half_price);
        dto.setFull_price(full_price);
        dto.setPreparation_time(preparation_time);
        dto.setIs_available(is_available);

        return service.create(dto, images);
    }

    // PUT multipart (fields + images optional)
    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    public MenuItemDTO update(
            @PathVariable Long id,
            @RequestParam String item_name,
            @RequestParam(required = false) Long category_id,
            @RequestParam(required = false) String description,
            @RequestParam BigDecimal price,
            @RequestParam(required = false) BigDecimal half_price,
            @RequestParam(required = false) BigDecimal full_price,
            @RequestParam(required = false) Integer preparation_time,
            @RequestParam(defaultValue = "true") Boolean is_available,
            @RequestPart(required = false) List<MultipartFile> images
    ) throws Exception {

        MenuItemDTO dto = new MenuItemDTO();
        dto.setItem_name(item_name);
        dto.setCategory_id(category_id); // if null, service keeps old
        dto.setDescription(description);
        dto.setPrice(price);
        dto.setHalf_price(half_price);
        dto.setFull_price(full_price);
        dto.setPreparation_time(preparation_time);
        dto.setIs_available(is_available);

        return service.update(id, dto, images);
    }
}
