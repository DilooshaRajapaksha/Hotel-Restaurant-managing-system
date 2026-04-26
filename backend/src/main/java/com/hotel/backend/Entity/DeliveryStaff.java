package com.hotel.backend.Entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "DELIVERY_STAFF")
@Data
public class DeliveryStaff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "staff_id")
    private Long staffId;

    @Column(name = "s_name", nullable = false)
    private String sName;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "contact_number", nullable = false)
    private String contactNumber;

    @Column(name = "role" , nullable = false)
    private String role;

    @Column(name = "join_time", updatable = false)
    private LocalDateTime joinTime = LocalDateTime.now();
}
