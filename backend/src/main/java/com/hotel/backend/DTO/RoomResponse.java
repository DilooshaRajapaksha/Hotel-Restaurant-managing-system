package com.hotel.backend.DTO;

import java.math.BigDecimal;

public record RoomResponse(Long id, String name, BigDecimal price, String status, String imageUrl, int capacity,
                           String description) {

}