package com.hotel.backend.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

@Entity
@Table(name = "ROOM")
@Data
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private Long roomId;

    @Column(name = "room_name", nullable = false)
    private String roomName;


     @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_type_id", nullable = false)
    private RoomType roomType;

    @Column(name = "room_price", nullable = false)
    private BigDecimal roomPrice;

    @Column(name = "room_status")
    @Enumerated(EnumType.STRING)
    private RoomStatus roomStatus = RoomStatus.AVAILABLE;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    public enum RoomStatus {
        AVAILABLE, MAINTENANCE
    }

}