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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MenuCategoryServiceTest {

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
        category1.setCategoryName("Rice");
        category1.setDescription("Rice meals");
        category1.setIsActive(true);

        category2 = new MenuCategory();
        category2.setCategoryId(2L);
        category2.setCategoryName("Drinks");
        category2.setDescription("Cold drinks");
        category2.setIsActive(false);
    }

    @Test
    void TC001_getAllCategories_returnsAllCategories() {
        when(repo.findAll()).thenReturn(List.of(category1, category2));

        List<MenuCategoryDTO> result = menuCategoryService.getAllCategories();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals("Rice", result.get(0).getCategory_name());
        assertEquals("Drinks", result.get(1).getCategory_name());
    }

    @Test
    void TC002_getCategoryById_validId_returnsCategory() {
        when(repo.findById(1L)).thenReturn(Optional.of(category1));

        MenuCategoryDTO result = menuCategoryService.getCategoryById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getCategory_id());
        assertEquals("Rice", result.getCategory_name());
    }

    @Test
    void TC003_getCategoryById_invalidId_throwsException() {
        when(repo.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> menuCategoryService.getCategoryById(99L));

        assertEquals("Category not found.", ex.getMessage());
    }

    @Test
    void TC004_saveCategory_validData_savesSuccessfully() {
        MenuCategoryDTO dto = new MenuCategoryDTO();
        dto.setCategory_name("Desserts");
        dto.setDescription("Sweet items");
        dto.setIs_active(true);

        MenuCategory savedCategory = new MenuCategory();
        savedCategory.setCategoryId(3L);
        savedCategory.setCategoryName("Desserts");
        savedCategory.setDescription("Sweet items");
        savedCategory.setIsActive(true);

        when(repo.existsByCategoryNameIgnoreCase("Desserts")).thenReturn(false);
        when(repo.save(any(MenuCategory.class))).thenReturn(savedCategory);

        MenuCategoryDTO result = menuCategoryService.saveCategory(dto);

        assertNotNull(result);
        assertEquals(3L, result.getCategory_id());
        assertEquals("Desserts", result.getCategory_name());
        assertTrue(result.getIs_active());
    }

    @Test
    void TC005_saveCategory_emptyName_throwsException() {
        MenuCategoryDTO dto = new MenuCategoryDTO();
        dto.setCategory_name("   ");

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> menuCategoryService.saveCategory(dto));

        assertEquals("Category name is required.", ex.getMessage());
    }

    @Test
    void TC006_saveCategory_duplicateName_throwsException() {
        MenuCategoryDTO dto = new MenuCategoryDTO();
        dto.setCategory_name("Rice");

        when(repo.existsByCategoryNameIgnoreCase("Rice")).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> menuCategoryService.saveCategory(dto));

        assertEquals("Category name already exists.", ex.getMessage());
    }

    @Test
    void TC007_updateCategory_validData_updatesSuccessfully() {
        MenuCategoryDTO dto = new MenuCategoryDTO();
        dto.setCategory_name("Main Meals");
        dto.setDescription("Updated description");
        dto.setIs_active(true);

        when(repo.findById(1L)).thenReturn(Optional.of(category1));
        when(repo.existsByCategoryNameIgnoreCaseAndCategoryIdNot("Main Meals", 1L)).thenReturn(false);
        when(repo.save(any(MenuCategory.class))).thenAnswer(invocation -> invocation.getArgument(0));

        MenuCategoryDTO result = menuCategoryService.updateCategory(1L, dto);

        assertNotNull(result);
        assertEquals("Main Meals", result.getCategory_name());
        assertEquals("Updated description", result.getDescription());
        assertTrue(result.getIs_active());
    }

    @Test
    void TC008_updateCategory_invalidId_throwsException() {
        MenuCategoryDTO dto = new MenuCategoryDTO();
        dto.setCategory_name("Updated");

        when(repo.findById(55L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> menuCategoryService.updateCategory(55L, dto));

        assertEquals("Category not found.", ex.getMessage());
    }

    @Test
    void TC009_updateCategory_emptyName_throwsException() {
        MenuCategoryDTO dto = new MenuCategoryDTO();
        dto.setCategory_name("   ");

        when(repo.findById(1L)).thenReturn(Optional.of(category1));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> menuCategoryService.updateCategory(1L, dto));

        assertEquals("Category name is required.", ex.getMessage());
    }

    @Test
    void TC010_updateCategory_duplicateName_throwsException() {
        MenuCategoryDTO dto = new MenuCategoryDTO();
        dto.setCategory_name("Drinks");

        when(repo.findById(1L)).thenReturn(Optional.of(category1));
        when(repo.existsByCategoryNameIgnoreCaseAndCategoryIdNot("Drinks", 1L)).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> menuCategoryService.updateCategory(1L, dto));

        assertEquals("Category name already exists.", ex.getMessage());
    }

    @Test
    void TC011_deleteCategory_validId_deletesSuccessfully() {
        when(repo.findById(1L)).thenReturn(Optional.of(category1));
        when(menuItemRepo.existsByCategoryId(1L)).thenReturn(false);

        assertDoesNotThrow(() -> menuCategoryService.deleteCategory(1L));

        verify(repo, times(1)).delete(category1);
    }

    @Test
    void TC012_deleteCategory_linkedToMenuItems_throwsException() {
        when(repo.findById(1L)).thenReturn(Optional.of(category1));
        when(menuItemRepo.existsByCategoryId(1L)).thenReturn(true);

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> menuCategoryService.deleteCategory(1L));

        assertEquals("Cannot delete category because it is linked to menu items.", ex.getMessage());
    }

    @Test
    void TC013_deleteCategory_invalidId_throwsException() {
        when(repo.findById(99L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> menuCategoryService.deleteCategory(99L));

        assertEquals("Category not found.", ex.getMessage());
    }
}