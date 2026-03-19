package com.hotel.backend.DTO;

import java.math.BigDecimal;

public class RoomResponse {
    private Long id;
    private String name;
    private BigDecimal price;
    private String status;
    private String imageUrl;
    private int capacity;
    private String description;

    public RoomResponse(Long id, String name, BigDecimal price, String status, String imageUrl, int capacity, String description) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.status = status;
        this.imageUrl = imageUrl;
        this.capacity = capacity;
        this.description = description;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public BigDecimal getPrice() { return price; }
    public String getStatus() { return status; }
    public String getImageUrl() { return imageUrl; }
    public int getCapacity() { return capacity; }
    public String getDescription() { return description; }
}