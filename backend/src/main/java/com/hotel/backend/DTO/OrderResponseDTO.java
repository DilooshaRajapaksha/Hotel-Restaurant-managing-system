package com.hotel.backend.DTO;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
public class OrderResponseDTO {

    private Long order_id;
    private LocalDateTime order_date;
    private BigDecimal total_amount;
    private String order_status;

    private Long user_id;
    private String customer_name;
    private String customer_email;
    private String customer_phone;

    private Long address_id;
    private String street;
    private String city;
    private String district;
    private String postal_code;

    private String payment_method;
    private String payment_status;

    private List<OrderItemDTO> items;

}
