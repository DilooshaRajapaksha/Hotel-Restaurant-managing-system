package com.hotel.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "rooms")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String roomName;

    @Column(nullable = false)
    private String roomType;

    @Column(nullable = false)
    private Double pricePerNight;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer capacity;

    // Stores amenities as comma-separated string e.g. "WiFi,AC,Balcony"
    @Column(columnDefinition = "TEXT")
    private String amenities;

    @Column(nullable = false)
    private String availability; // "available", "unavailable", "maintenance"

    // Stores image filenames as comma-separated string
    @Column(columnDefinition = "TEXT")
    private String images;

    private String media360;
}