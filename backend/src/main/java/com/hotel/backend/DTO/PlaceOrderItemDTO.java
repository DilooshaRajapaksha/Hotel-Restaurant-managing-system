package com.hotel.backend.DTO;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class PlaceOrderItemDTO {
    private Long       itemId;
    private Integer    quantity;
    private String     selectedSize;  // "HALF" | "FULL" | "DEFAULT"
    private BigDecimal unitPrice;     // actual price from cart (already resolved to half/full/default)
}

