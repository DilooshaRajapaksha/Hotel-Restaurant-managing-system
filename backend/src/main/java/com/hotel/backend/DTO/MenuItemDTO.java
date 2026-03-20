package com.hotel.backend.DTO;

import java.math.BigDecimal;

public class MenuItemDTO {

    private Long item_id;
    private Long category_id;
    private String item_name;
    private String description;
    private BigDecimal price;
    private BigDecimal half_price;
    private BigDecimal full_price;
    private Integer preparation_time;
    private Boolean is_available;

    public Long getItem_id() { return item_id; }
    public void setItem_id(Long item_id) { this.item_id = item_id; }

    public Long getCategory_id() { return category_id; }
    public void setCategory_id(Long category_id) { this.category_id = category_id; }

    public String getItem_name() { return item_name; }
    public void setItem_name(String item_name) { this.item_name = item_name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public BigDecimal getHalf_price() { return half_price; }
    public void setHalf_price(BigDecimal half_price) { this.half_price = half_price; }

    public BigDecimal getFull_price() { return full_price; }
    public void setFull_price(BigDecimal full_price) { this.full_price = full_price; }

    public Integer getPreparation_time() { return preparation_time; }
    public void setPreparation_time(Integer preparation_time) { this.preparation_time = preparation_time; }

    public Boolean getIs_available() { return is_available; }
    public void setIs_available(Boolean is_available) { this.is_available = is_available; }
}

