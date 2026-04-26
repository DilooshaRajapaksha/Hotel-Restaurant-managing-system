package com.hotel.backend.DTO;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PlaceOrderRequestDTO {
    private String customerName;
    private String email;
    private String phone;

    private String houseNo;
    private String street;
    private String area;
    private String city;
    private String notes;

    private String paymentMethod;

    private Double latitude;
    private Double longitude;
    private String formattedAddress;

    private List<PlaceOrderItemDTO> items;
}
