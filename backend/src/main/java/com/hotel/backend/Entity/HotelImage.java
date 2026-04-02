package com.hotel.backend.Entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "HOTEL_IMAGE")
@Data
public class HotelImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "Rimage_id")
    private Long rimageId;

    @Column(name = "room_id", nullable = false)
    private Long roomId;

    @Column(name = "Rimage_url", nullable = false, length = 500)
    private String rimageUrl;

    @Column(name = "is_main")
    private Boolean isMain = false;

    @Column(name = "uploaded_at")
    private LocalDateTime uploadedAt = LocalDateTime.now();

}