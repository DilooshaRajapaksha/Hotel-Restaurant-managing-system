package com.hotel.backend.Service;

import com.hotel.backend.DTO.MenuCategoryDTO;
import com.hotel.backend.Entity.MenuCategory;
import com.hotel.backend.Repo.MenuCategoryRepo;
import com.hotel.backend.Repo.MenuItemRepo;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class MenuCategoryCustomerViewTest {

    @Mock
    private MenuCategoryRepo repo;

    @Mock
    private MenuItemRepo menuItemRepo;

    @InjectMocks
    private MenuCategoryService menuCategoryService;

    private MenuCategory category1;
    private MenuCategory category2;

    @BeforeEach
    void setUp() {
        category1 = new MenuCategory();
        category1.setCategoryId(1L);
        category1.setCategoryName("Rice & Curry");
        category1.setDescription("Main meal category");
        category1.setIsActive(true);

        category2 = new MenuCategory();
        category2.setCategoryId(2L);
        category2.setCategoryName("Beverages");
        category2.setDescription("Drinks category");
        category2.setIsActive(true);
    }

    @Test
    void TC_CUST_CAT_001_getAllCategories_returnsCategoriesForCustomerFoodPage() {
        when(repo.findAll()).thenReturn(List.of(category1, category2));

        List<MenuCategoryDTO> result = menuCategoryService.getAllCategories();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Rice & Curry", result.get(0).getCategory_name());
        assertEquals("Beverages", result.get(1).getCategory_name());
    }

    @Test
    void TC_CUST_CAT_002_getAllCategories_returnsEmptyList_whenNoCategoriesExist() {
        when(repo.findAll()).thenReturn(List.of());

        List<MenuCategoryDTO> result = menuCategoryService.getAllCategories();

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void TC_CUST_CAT_003_getCategoryById_returnsCategoryDetailsForCustomerView() {
        when(repo.findById(1L)).thenReturn(Optional.of(category1));

        MenuCategoryDTO result = menuCategoryService.getCategoryById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getCategory_id());
        assertEquals("Rice & Curry", result.getCategory_name());
        assertEquals("Main meal category", result.getDescription());
        assertTrue(result.getIs_active());
    }

    @Test
    void TC_CUST_CAT_004_getCategoryById_invalidId_throwsException() {
        when(repo.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> menuCategoryService.getCategoryById(99L));

        assertEquals("Category not found.", ex.getMessage());
    }
}