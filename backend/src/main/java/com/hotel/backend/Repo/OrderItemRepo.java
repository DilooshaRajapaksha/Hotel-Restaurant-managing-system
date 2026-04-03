package com.hotel.backend.Repo;

import com.hotel.backend.Entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderItemRepo extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderOrderId(Long orderId);
}