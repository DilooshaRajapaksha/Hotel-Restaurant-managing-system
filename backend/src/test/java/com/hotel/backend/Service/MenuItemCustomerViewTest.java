package com.hotel.backend.Service;

import com.hotel.backend.DTO.MenuItemDTO;
import com.hotel.backend.Entity.MenuImage;
import com.hotel.backend.Entity.MenuItem;
import com.hotel.backend.Repo.MenuCategoryRepo;
import com.hotel.backend.Repo.MenuImageRepo;
import com.hotel.backend.Repo.MenuItemRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MenuItemCustomerViewTest {

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

    private MenuItem availableItem;
    private MenuItem unavailableItem;
    private MenuImage mainImage1;
    private MenuImage mainImage2;

    @BeforeEach
    void setUp() {
        availableItem = new MenuItem();
        availableItem.setItemId(1L);
        availableItem.setCategoryId(10L);
        availableItem.setItemName("Chicken Fried Rice");
        availableItem.setDescription("Spicy chicken fried rice");
        availableItem.setPrice(BigDecimal.valueOf(1200));
        availableItem.setHalfPrice(BigDecimal.valueOf(700));
        availableItem.setFullPrice(BigDecimal.valueOf(1200));
        availableItem.setPreparationTime(15);
        availableItem.setIsAvailable(true);

        unavailableItem = new MenuItem();
        unavailableItem.setItemId(2L);
        unavailableItem.setCategoryId(10L);
        unavailableItem.setItemName("Seafood Noodles");
        unavailableItem.setDescription("Mixed seafood noodles");
        unavailableItem.setPrice(BigDecimal.valueOf(1500));
        unavailableItem.setHalfPrice(BigDecimal.valueOf(900));
        unavailableItem.setFullPrice(BigDecimal.valueOf(1500));
        unavailableItem.setPreparationTime(20);
        unavailableItem.setIsAvailable(false);

        mainImage1 = new MenuImage();
        mainImage1.setFimageId(101L);
        mainImage1.setItemId(1L);
        mainImage1.setFimageUrl("http://test/chicken-fried-rice.jpg");
        mainImage1.setIsMain(true);

        mainImage2 = new MenuImage();
        mainImage2.setFimageId(102L);
        mainImage2.setItemId(2L);
        mainImage2.setFimageUrl("http://test/seafood-noodles.jpg");
        mainImage2.setIsMain(true);
    }

    @Test
    void TC_CUST_ITEM_001_getAllItems_returnsItemsForCustomerMenuPage() {
        when(menuItemRepo.findAll()).thenReturn(List.of(availableItem, unavailableItem));
        when(imageRepo.findByItemId(1L)).thenReturn(List.of(mainImage1));
        when(imageRepo.findByItemId(2L)).thenReturn(List.of(mainImage2));

        List<MenuItemDTO> result = menuItemService.getAllItems();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Chicken Fried Rice", result.get(0).getItem_name());
        assertEquals("Seafood Noodles", result.get(1).getItem_name());
    }

    @Test
    void TC_CUST_ITEM_002_getItem_returnsRequiredCustomerFields() {
        when(menuItemRepo.findById(1L)).thenReturn(Optional.of(availableItem));
        when(imageRepo.findByItemId(1L)).thenReturn(List.of(mainImage1));

        MenuItemDTO result = menuItemService.getItem(1L);

        assertNotNull(result);
        assertEquals("Chicken Fried Rice", result.getItem_name());
        assertEquals("Spicy chicken fried rice", result.getDescription());
        assertEquals(BigDecimal.valueOf(1200), result.getPrice());
        assertEquals("http://test/chicken-fried-rice.jpg", result.getImage_url());
        assertTrue(result.getIs_available());
    }

    @Test
    void TC_CUST_ITEM_003_getAllItems_includesAvailabilityStatusForUnavailableFood() {
        when(menuItemRepo.findAll()).thenReturn(List.of(unavailableItem));
        when(imageRepo.findByItemId(2L)).thenReturn(List.of(mainImage2));

        List<MenuItemDTO> result = menuItemService.getAllItems();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Seafood Noodles", result.get(0).getItem_name());
        assertFalse(result.get(0).getIs_available());
    }

    @Test
    void TC_CUST_ITEM_004_getAllItems_returnsEmptyList_whenNoFoodItemsExist() {
        when(menuItemRepo.findAll()).thenReturn(List.of());

        List<MenuItemDTO> result = menuItemService.getAllItems();

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void TC_CUST_ITEM_005_getItem_invalidId_throwsException() {
        when(menuItemRepo.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> menuItemService.getItem(99L));

        assertEquals("Menu item not found", ex.getMessage());
    }
}