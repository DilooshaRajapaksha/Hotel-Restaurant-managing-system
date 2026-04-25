package com.hotel.backend.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "HOTEL_IMAGE")
@Data
public class HotelImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Rimage_id")
    private Long rimageId;

    @Column(name = "room_id")
    private Long roomId;

    @Column(name = "Rimage_url")
    private String rimageUrl;

    @Column(name = "is_main")
    private Boolean isMain;

    @Column(name = "is_360")
    private Boolean is360 = false;

    @Column(name = "uploaded_at")
    private java.time.LocalDateTime uploadedAt;
}