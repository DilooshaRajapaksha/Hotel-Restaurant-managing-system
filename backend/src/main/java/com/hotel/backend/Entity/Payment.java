package com.hotel.backend.Entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Entity
@Table(name = "PAYMENT")
public class Payment {

    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private Long paymentId;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Setter
    @Column(name = "booking_id")
    private Long bookingId;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private FoodOrder order;

    @Setter
    @Column(name = "amount", nullable = false)
    private BigDecimal amount;

    @Setter
    @Column(name = "payment_method", nullable = false)
    private String paymentMethod;

    @Setter
    @Column(name = "payment_status")
    private String paymentStatus;

    @Setter
    @Column(name = "transaction_references")
    private String transactionReferences;

    @Column(name = "payment_date", insertable = false, updatable = false)
    private LocalDateTime paymentDate;

}
