package com.hotel.backend.Entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "DELIVERY_STAFF")
@Data
public class DeliveryStaff {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "staff_id")
    private Long staffId;

    @Column(name = "role_id", nullable = false)
    private Long roleId;

    @Column(name = "s_name", nullable = false)
    private String sName;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "passward_hash", nullable = false)
    private String passwardHash;

    @Column(name = "contact_number", nullable = false)
    private String contactNumber;

    @Column(name = "join_time", updatable = false)
    private LocalDateTime joinTime = LocalDateTime.now();
}
