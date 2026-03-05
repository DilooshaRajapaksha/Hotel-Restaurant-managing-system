package com.hotel.backend.controller;

import com.hotel.backend.dto.MenuImageDTO;
import com.hotel.backend.service.MenuItemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class MenuImageController {

    private final MenuItemService service;

    public MenuImageController(MenuItemService service) {
        this.service = service;
    }

    //GET /api/admin/menu-items/{id}/images
    @GetMapping("/menu-items/{id}/images")
    public List<MenuImageDTO> getItemImages(@PathVariable Long id) {
        return service.getImages(id);
    }

    //DELETE /api/admin/menu-images/{imageId}
    @DeleteMapping("/menu-images/{imageId}")
    public void deleteImage(@PathVariable Long imageId) {
        service.deleteImage(imageId);
    }
}
