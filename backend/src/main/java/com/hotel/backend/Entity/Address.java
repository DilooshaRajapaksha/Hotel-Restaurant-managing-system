package com.hotel.backend.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Entity
@Table(name = "ADDRESS")
public class Address {

    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "address_id")
    private Long addressId;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Setter
    @Column(name = "street", nullable = false)
    private String street;

    @Setter
    @Column(name = "city", nullable = false)
    private String city;

    @Setter
    @Column(name = "district", nullable = false)
    private String district;

    @Setter
    @Column(name = "postal_code")
    private String postalCode;

    @Setter
    @Column(name = "is_default")
    private Boolean isDefault;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

}