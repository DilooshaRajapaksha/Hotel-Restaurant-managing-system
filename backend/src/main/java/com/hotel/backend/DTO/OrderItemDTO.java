package com.hotel.backend.DTO;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
public class OrderItemDTO {

    private Long order_item_id;
    private Long item_id;
    private String item_name;
    private Integer quantity;
    private BigDecimal unit_price;
    private BigDecimal subtotal;

}
