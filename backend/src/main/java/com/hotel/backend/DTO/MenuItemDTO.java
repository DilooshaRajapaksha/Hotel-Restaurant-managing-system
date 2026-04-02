package com.hotel.backend.DTO;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
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

}

