package com.hotel.backend.Entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "menu_items")
public class MenuItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "item_id")
    private Long itemId;

    // NOT NULL foreign key id (matches your requirement)
    @Column(name = "category_id", nullable = false)
    private Long categoryId;

    @Column(name = "item_name", nullable = false, length = 255)
    private String itemName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "half_price", precision = 10, scale = 2)
    private BigDecimal halfPrice;

    @Column(name = "full_price", precision = 10, scale = 2)
    private BigDecimal fullPrice;

    @Column(name = "price", nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "is_available")
    private Boolean isAvailable = true;

    @Column(name = "preparation_time")
    private Integer preparationTime;

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getItemName() { return itemName; }
    public void setItemName(String itemName) { this.itemName = itemName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getHalfPrice() { return halfPrice; }
    public void setHalfPrice(BigDecimal halfPrice) { this.halfPrice = halfPrice; }

    public BigDecimal getFullPrice() { return fullPrice; }
    public void setFullPrice(BigDecimal fullPrice) { this.fullPrice = fullPrice; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Boolean getIsAvailable() { return isAvailable; }
    public void setIsAvailable(Boolean isAvailable) { this.isAvailable = isAvailable; }

    public Integer getPreparationTime() { return preparationTime; }
    public void setPreparationTime(Integer preparationTime) { this.preparationTime = preparationTime; }
}
