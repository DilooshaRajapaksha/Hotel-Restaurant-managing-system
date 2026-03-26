package com.hotel.backend.Entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "HOTEL_IMAGE")
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

    public Long getRimageId() { return rimageId; }
    public void setRimageId(Long rimageId) { this.rimageId = rimageId; }

    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }

    public String getRimageUrl() { return rimageUrl; }
    public void setRimageUrl(String rimageUrl) { this.rimageUrl = rimageUrl; }

    public Boolean getIsMain() { return isMain; }
    public void setIsMain(Boolean isMain) { this.isMain = isMain; }

    public LocalDateTime getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(LocalDateTime uploadedAt) { this.uploadedAt = uploadedAt; }
}
