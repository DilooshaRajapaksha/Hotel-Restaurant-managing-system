package com.hotel.backend.Repo;

import com.hotel.backend.Entity.FoodOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface FoodOrderRepo extends JpaRepository<FoodOrder, Long> {

    @Query("""
        SELECT fo
        FROM FoodOrder fo
        JOIN fo.user u
        WHERE (:status IS NULL OR fo.orderStatus = :status)
          AND (:date IS NULL OR FUNCTION('DATE', fo.orderDate) = :date)
          AND (
                :customer IS NULL OR
                LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(CONCAT('%', :customer, '%')) OR
                LOWER(u.email) LIKE LOWER(CONCAT('%', :customer, '%')) OR
                LOWER(u.phoneNumber) LIKE LOWER(CONCAT('%', :customer, '%'))
              )
        ORDER BY fo.orderId DESC
    """)
    List<FoodOrder> searchOrders(String status, LocalDate date, String customer);

    List<FoodOrder> findByUserUserIdOrderByOrderDateDesc(Long userId);
}