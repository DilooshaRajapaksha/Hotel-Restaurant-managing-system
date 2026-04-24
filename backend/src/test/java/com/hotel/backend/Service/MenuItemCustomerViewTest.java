package com.hotel.backend.Service;

import com.hotel.backend.DTO.MenuImageDTO;
import com.hotel.backend.DTO.MenuItemDTO;
import com.hotel.backend.Entity.MenuImage;
import com.hotel.backend.Entity.MenuItem;
import com.hotel.backend.Repo.MenuCategoryRepo;
import com.hotel.backend.Repo.MenuImageRepo;
import com.hotel.backend.Repo.MenuItemRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.math.BigDecimal;

@ExtendWith(MockitoExtension.class)
class MenuItemServiceTest {

    @Mock
    private MenuItemRepo menuItemRepo;

    @Mock
    private MenuImageRepo imageRepo;

    @Mock
    private MenuCategoryRepo categoryRepo;

    @Mock
    private FileStorageService fileStorage;

    @InjectMocks
    private MenuItemService menuItemService;

    private MenuItem menuItem;
    private MenuImage mainImage;

    @BeforeEach
    void setUp() {
        menuItem = new MenuItem();
        menuItem.setItemId(1L);
        menuItem.setCategoryId(10L);
        menuItem.setItemName("Chicken Fried Rice");
        menuItem.setDescription("Tasty rice");
        menuItem.setPrice(BigDecimal.valueOf(1200));
        menuItem.setHalfPrice(BigDecimal.valueOf(700));
        menuItem.setFullPrice(BigDecimal.valueOf(1200));
        menuItem.setPreparationTime(15);
        menuItem.setIsAvailable(true);

        mainImage = new MenuImage();
        mainImage.setFimageId(100L);
        mainImage.setItemId(1L);
        mainImage.setFimageUrl("http://test/image.jpg");
        mainImage.setIsMain(true);
    }

    @Test
    void TC001_getAllItems_returnsAllItems() {
        when(menuItemRepo.findAll()).thenReturn(List.of(menuItem));
        when(imageRepo.findByItemId(1L)).thenReturn(List.of(mainImage));

        List<MenuItemDTO> result = menuItemService.getAllItems();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Chicken Fried Rice", result.get(0).getItem_name());
        assertEquals("http://test/image.jpg", result.get(0).getImage_url());
    }

    @Test
    void TC002_getItem_validId_returnsItem() {
        when(menuItemRepo.findById(1L)).thenReturn(Optional.of(menuItem));
        when(imageRepo.findByItemId(1L)).thenReturn(List.of(mainImage));

        MenuItemDTO result = menuItemService.getItem(1L);

        assertNotNull(result);
        assertEquals(1L, result.getItem_id());
        assertEquals("Chicken Fried Rice", result.getItem_name());
    }

    @Test
    void TC003_getItem_invalidId_throwsException() {
        when(menuItemRepo.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> menuItemService.getItem(99L));

        assertEquals("Menu item not found", ex.getMessage());
    }

    @Test
    void TC004_create_validDataWithoutImages_savesSuccessfully() throws Exception {
        MenuItemDTO dto = new MenuItemDTO();
        dto.setCategory_id(10L);
        dto.setItem_name("Burger");
        dto.setDescription("Beef burger");
        dto.setPrice(BigDecimal.valueOf(1500));
        dto.setHalf_price(BigDecimal.valueOf(800));
        dto.setFull_price(BigDecimal.valueOf(1500));
        dto.setPreparation_time(20);
        dto.setIs_available(true);

        MenuItem saved = new MenuItem();
        saved.setItemId(2L);
        saved.setCategoryId(10L);
        saved.setItemName("Burger");
        saved.setDescription("Beef burger");
        saved.setPrice(BigDecimal.valueOf(1500));
        saved.setHalfPrice(BigDecimal.valueOf(800));
        saved.setFullPrice(BigDecimal.valueOf(1500));
        saved.setPreparationTime(20);
        saved.setIsAvailable(true);

        when(categoryRepo.existsById(10L)).thenReturn(true);
        when(menuItemRepo.save(any(MenuItem.class))).thenReturn(saved);
        when(imageRepo.findByItemId(2L)).thenReturn(List.of());

        MenuItemDTO result = menuItemService.create(dto, null);

        assertNotNull(result);
        assertEquals("Burger", result.getItem_name());
        verify(menuItemRepo, times(1)).save(any(MenuItem.class));
    }

    @Test
    void TC005_create_missingCategoryId_throwsException() {
        MenuItemDTO dto = new MenuItemDTO();
        dto.setItem_name("Burger");

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> menuItemService.create(dto, null));

        assertEquals("category_id is required", ex.getMessage());
    }

    @Test
    void TC006_create_invalidCategoryId_throwsException() {
        MenuItemDTO dto = new MenuItemDTO();
        dto.setCategory_id(99L);
        dto.setItem_name("Burger");

        when(categoryRepo.existsById(99L)).thenReturn(false);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> menuItemService.create(dto, null));

        assertEquals("Invalid category_id", ex.getMessage());
    }

    @Test
    void TC007_create_withImages_savesImagesSuccessfully() throws Exception {
        MenuItemDTO dto = new MenuItemDTO();
        dto.setCategory_id(10L);
        dto.setItem_name("Pizza");
        dto.setDescription("Cheese pizza");
        dto.setPrice(BigDecimal.valueOf(2000));

        MenuItem saved = new MenuItem();
        saved.setItemId(3L);
        saved.setCategoryId(10L);
        saved.setItemName("Pizza");
        saved.setDescription("Cheese pizza");
        saved.setPrice(BigDecimal.valueOf(2000));
        saved.setIsAvailable(true);

        MultipartFile image = new MockMultipartFile(
                "file",
                "pizza.jpg",
                "image/jpeg",
                "dummy".getBytes()
        );

        when(categoryRepo.existsById(10L)).thenReturn(true);
        when(menuItemRepo.save(any(MenuItem.class))).thenReturn(saved);
        when(imageRepo.findByItemId(3L)).thenReturn(List.of());
        when(fileStorage.saveMenuImage(any(MultipartFile.class))).thenReturn("http://test/pizza.jpg");

        MenuItemDTO result = menuItemService.create(dto, List.of(image));

        assertNotNull(result);
        verify(fileStorage, times(1)).saveMenuImage(any(MultipartFile.class));
        verify(imageRepo, atLeastOnce()).save(any());
    }

    @Test
    void TC008_update_validDataWithoutImages_updatesSuccessfully() throws Exception {
        MenuItemDTO dto = new MenuItemDTO();
        dto.setCategory_id(20L);
        dto.setItem_name("Updated Rice");
        dto.setDescription("Updated description");
        dto.setPrice(BigDecimal.valueOf(1300));
        dto.setHalf_price(BigDecimal.valueOf(750));
        dto.setFull_price(BigDecimal.valueOf(1300));
        dto.setPreparation_time(18);
        dto.setIs_available(false);

        when(menuItemRepo.findById(1L)).thenReturn(Optional.of(menuItem));
        when(categoryRepo.existsById(20L)).thenReturn(true);
        when(menuItemRepo.save(any(MenuItem.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(imageRepo.findByItemId(1L)).thenReturn(List.of());

        MenuItemDTO result = menuItemService.update(1L, dto, null);

        assertNotNull(result);
        assertEquals("Updated Rice", result.getItem_name());
        assertEquals(20L, result.getCategory_id());
        assertFalse(result.getIs_available());
    }

    @Test
    void TC009_update_invalidId_throwsException() {
        MenuItemDTO dto = new MenuItemDTO();
        dto.setItem_name("Updated");

        when(menuItemRepo.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> menuItemService.update(99L, dto, null));

        assertEquals("Menu item not found", ex.getMessage());
    }

    @Test
    void TC010_update_invalidCategoryId_throwsException() {
        MenuItemDTO dto = new MenuItemDTO();
        dto.setCategory_id(88L);

        when(menuItemRepo.findById(1L)).thenReturn(Optional.of(menuItem));
        when(categoryRepo.existsById(88L)).thenReturn(false);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> menuItemService.update(1L, dto, null));

        assertEquals("Invalid category_id", ex.getMessage());
    }

    @Test
    void TC011_update_withImages_savesImagesSuccessfully() throws Exception {
        MenuItemDTO dto = new MenuItemDTO();
        dto.setItem_name("New Name");

        MultipartFile image = new MockMultipartFile(
                "file",
                "new.jpg",
                "image/jpeg",
                "dummy".getBytes()
        );

        when(menuItemRepo.findById(1L)).thenReturn(Optional.of(menuItem));
        when(menuItemRepo.save(any(MenuItem.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(imageRepo.findByItemId(1L)).thenReturn(List.of());
        when(fileStorage.saveMenuImage(any(MultipartFile.class))).thenReturn("http://test/new.jpg");

        MenuItemDTO result = menuItemService.update(1L, dto, List.of(image));

        assertNotNull(result);
        verify(fileStorage, times(1)).saveMenuImage(any(MultipartFile.class));
        verify(imageRepo, atLeastOnce()).save(any(MenuImage.class));
    }

    @Test
    void TC012_getImages_returnsImageList() {
        when(imageRepo.findByItemId(1L)).thenReturn(List.of(mainImage));

        List<MenuImageDTO> result = menuItemService.getImages(1L);

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("http://test/image.jpg", result.get(0).getFimage_url());
        assertTrue(result.get(0).getIs_main());
    }

    @Test
    void TC013_deleteImage_validId_deletesSuccessfully() {
        when(imageRepo.findById(100L)).thenReturn(Optional.of(mainImage));

        assertDoesNotThrow(() -> menuItemService.deleteImage(100L));

        verify(fileStorage, times(1)).deleteByUrl("http://test/image.jpg");
        verify(imageRepo, times(1)).delete(mainImage);
    }

    @Test
    void TC014_deleteImage_invalidId_throwsException() {
        when(imageRepo.findById(999L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> menuItemService.deleteImage(999L));

        assertEquals("Image not found", ex.getMessage());
    }

    @Test
    void TC015_deleteItem_validId_deletesSuccessfully() {
        when(menuItemRepo.existsById(1L)).thenReturn(true);

        assertDoesNotThrow(() -> menuItemService.deleteItem(1L));

        verify(menuItemRepo, times(1)).deleteById(1L);
    }

    @Test
    void TC016_deleteItem_invalidId_throwsException() {
        when(menuItemRepo.existsById(999L)).thenReturn(false);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> menuItemService.deleteItem(999L));

        assertEquals("Menu item not found.", ex.getMessage());
    }
}
