package com.hotel.backend.Entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "EXPERIENCES")
public class Experiences {

    @Setter
    @Getter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "experience_id")
    private Long experienceId;

    @Setter
    @Getter
    @Column(name = "title", nullable = false)
    private String title;

    @Setter
    @Getter
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Setter
    @Getter
    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    @Setter
    @Getter
    @Column(name = "location")
    private String location;

    @Setter
    @Getter
    @Column(name = "price", nullable = false)
    private Double price;

    @Setter
    @Getter
    @Column(name = "is_active", columnDefinition = "BOOLEAN DEFAULT TRUE")
    private Boolean isActive = true;

    @JsonIgnore
    @Setter
    @Getter
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}