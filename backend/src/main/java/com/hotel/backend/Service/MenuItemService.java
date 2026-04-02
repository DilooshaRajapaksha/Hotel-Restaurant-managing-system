package com.hotel.backend.Service;

import com.hotel.backend.DTO.MenuImageDTO;
import com.hotel.backend.DTO.MenuItemDTO;
import com.hotel.backend.Entity.MenuImage;
import com.hotel.backend.Entity.MenuItem;
import com.hotel.backend.Repo.MenuCategoryRepo;
import com.hotel.backend.Repo.MenuImageRepo;
import com.hotel.backend.Repo.MenuItemRepo;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MenuItemService {

    private final MenuItemRepo menuItemRepo;
    private final MenuImageRepo imageRepo;
    private final MenuCategoryRepo categoryRepo;
    private final FileStorageService fileStorage;

    public MenuItemService(MenuItemRepo menuItemRepo, MenuImageRepo imageRepo, MenuCategoryRepo categoryRepo, FileStorageService fileStorage) {
        this.menuItemRepo = menuItemRepo;
        this.imageRepo = imageRepo;
        this.categoryRepo = categoryRepo;
        this.fileStorage = fileStorage;
    }

    public List<MenuItemDTO> getAllItems() {
        return menuItemRepo.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public MenuItemDTO getItem(Long id) {
        MenuItem item = menuItemRepo.findById(id).orElseThrow(() -> new RuntimeException("Menu item not found"));
        return toDTO(item);
    }

    public MenuItemDTO create(MenuItemDTO dto, List<MultipartFile> images) throws Exception {
        // category_id NOT NULL + must exist
        if (dto.getCategory_id() == null) throw new RuntimeException("category_id is required");
        if (!categoryRepo.existsById(dto.getCategory_id())) throw new RuntimeException("Invalid category_id");

        MenuItem item = new MenuItem();
        applyDTO(item, dto);

        MenuItem saved = menuItemRepo.save(item);

        if (images != null) saveImages(saved.getItemId(), images);

        return toDTO(saved);
    }

    public MenuItemDTO update(Long id, MenuItemDTO dto, List<MultipartFile> images) throws Exception {
        MenuItem item = menuItemRepo.findById(id).orElseThrow(() -> new RuntimeException("Menu item not found"));

        // category_id is NOT NULL - if frontend sends empty, keep old
        if (dto.getCategory_id() != null) {
            if (!categoryRepo.existsById(dto.getCategory_id())) throw new RuntimeException("Invalid category_id");
            item.setCategoryId(dto.getCategory_id());
        }

        if (dto.getItem_name() != null) item.setItemName(dto.getItem_name());
        item.setDescription(dto.getDescription());
        if (dto.getPrice() != null) item.setPrice(dto.getPrice());

        item.setHalfPrice(dto.getHalf_price());
        item.setFullPrice(dto.getFull_price());
        item.setPreparationTime(dto.getPreparation_time());
        if (dto.getIs_available() != null) item.setIsAvailable(dto.getIs_available());

        MenuItem saved = menuItemRepo.save(item);

        if (images != null && !images.isEmpty()) saveImages(saved.getItemId(), images);

        return toDTO(saved);
    }

    public List<MenuImageDTO> getImages(Long itemId) {
        return imageRepo.findByItemId(itemId).stream().map(this::toImageDTO).collect(Collectors.toList());
    }

    public void deleteImage(Long imageId) {
        MenuImage img = imageRepo.findById(imageId).orElseThrow(() -> new RuntimeException("Image not found"));
        fileStorage.deleteByUrl(img.getFimageUrl());
        imageRepo.delete(img);
    }


    public void deleteItem(Long id) {
        if (!menuItemRepo.existsById(id)) {
            throw new RuntimeException("Menu item not found.");
        }

        menuItemRepo.deleteById(id);
    }
    // helpers

    private void saveImages(Long itemId, List<MultipartFile> images) throws Exception {
        boolean hasAny = imageRepo.findByItemId(itemId).size() > 0;

        for (MultipartFile file : images) {
            String url = fileStorage.saveMenuImage(file);

            MenuImage img = new MenuImage();
            img.setItemId(itemId);
            img.setFimageUrl(url);
            img.setIsMain(!hasAny); // first image becomes MAIN
            imageRepo.save(img);

            hasAny = true;
        }
    }

    private MenuItemDTO toDTO(MenuItem i) {
        MenuItemDTO dto = new MenuItemDTO();
        dto.setItem_id(i.getItemId());
        dto.setCategory_id(i.getCategoryId());
        dto.setItem_name(i.getItemName());
        dto.setDescription(i.getDescription());
        dto.setPrice(i.getPrice());
        dto.setHalf_price(i.getHalfPrice());
        dto.setFull_price(i.getFullPrice());
        dto.setPreparation_time(i.getPreparationTime());
        dto.setIs_available(i.getIsAvailable());
        return dto;
    }

    private MenuImageDTO toImageDTO(MenuImage img) {
        MenuImageDTO dto = new MenuImageDTO();
        dto.setFimage_id(img.getFimageId());
        dto.setFimage_url(img.getFimageUrl());
        dto.setIs_main(img.getIsMain());
        return dto;
    }

    private void applyDTO(MenuItem item, MenuItemDTO dto) {
        item.setCategoryId(dto.getCategory_id());
        item.setItemName(dto.getItem_name());
        item.setDescription(dto.getDescription());
        item.setPrice(dto.getPrice());
        item.setHalfPrice(dto.getHalf_price());
        item.setFullPrice(dto.getFull_price());
        item.setPreparationTime(dto.getPreparation_time());
        item.setIsAvailable(dto.getIs_available() != null ? dto.getIs_available() : true);
    }
}
