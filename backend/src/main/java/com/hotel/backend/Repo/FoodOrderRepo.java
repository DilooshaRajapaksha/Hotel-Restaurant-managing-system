package com.hotel.backend.Repo;

import com.hotel.backend.Entity.FoodOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoodOrderRepo extends JpaRepository<FoodOrder, Long> {

    List<FoodOrder> findByStaffId(Long staffId);

    List<FoodOrder> findByStaffIdIsNull();

    List<FoodOrder> findByOrderStatus(FoodOrder.OrderStatus status);

    List<FoodOrder> findByUserId(Long userId);

    long countByStaffId(Long staffId);
}