package com.hotel.backend.Entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "ROOM")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private Long roomId;

    @Column(name = "room_name", nullable = false)
    private String roomName;

    @Column(name = "room_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal roomPrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "room_status")
    private RoomStatus roomStatus = RoomStatus.AVAILABLE;

    @ManyToOne
    @JoinColumn(name = "room_type_id", nullable = false)
    private RoomType roomType;

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }

    public BigDecimal getRoomPrice() { return roomPrice; }
    public void setRoomPrice(BigDecimal roomPrice) { this.roomPrice = roomPrice; }

    public RoomStatus getRoomStatus() { return roomStatus; }
    public void setRoomStatus(RoomStatus roomStatus) { this.roomStatus = roomStatus; }

    public RoomType getRoomType() { return roomType; }
    public void setRoomType(RoomType roomType) { this.roomType = roomType; }
}