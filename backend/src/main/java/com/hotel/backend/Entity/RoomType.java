package com.hotel.backend.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ROOM_TYPES")
public class RoomType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_type_id")
    private Long roomTypeId;

    @Column(name = "room_type_name", nullable = false)
    private String roomTypeName;

    @Column(name = "room_description", nullable = false)
    private String roomDescription;

    @Column(name = "capacity", nullable = false)
    private Integer capacity;

    public int getCapacity() { return capacity; }
    public void setCapacity(int capacity) { this.capacity = capacity; }
}
