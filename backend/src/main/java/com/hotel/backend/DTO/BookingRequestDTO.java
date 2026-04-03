package com.hotel.backend.DTO;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
public class BookingRequestDTO {
    private Long roomId;
    private String checkInDate;
    private String checkOutDate;
    private Integer numberOfGuest;
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String specialRequest;
    private BigDecimal totalPrice;
}