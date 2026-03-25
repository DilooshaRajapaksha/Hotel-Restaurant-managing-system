package com.hotel.backend.Entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "ROOM_TYPES")
@Data
public class RoomType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_type_id")
    private Long roomTypeId;

    @Column(name = "room_type_name", nullable = false)
    private String roomTypeName;

    @Column(name = "room_description", nullable = false, columnDefinition = "TEXT")
    private String roomDescription;

    @Column(name = "capacity", nullable = false)
    private Integer capacity;
}
