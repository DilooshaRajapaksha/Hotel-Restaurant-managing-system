package com.hotel.backend.Repo;

import com.hotel.backend.Entity.FoodOrder;
import com.hotel.backend.Entity.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FoodOrderRepo extends JpaRepository<FoodOrder, Long> {

    List<FoodOrder> findByStaffId(Long staffId);

    List<FoodOrder> findByStaffIdIsNull();

    // FIX: field is now OrderStatus enum, Spring Data derives correct query
    List<FoodOrder> findByOrderStatus(OrderStatus status);

    // FIX: FoodOrder has @ManyToOne User (no direct userId column), use derived path
    List<FoodOrder> findByUserUserId(Long userId);

    long countByStaffId(Long staffId);

    List<FoodOrder> findByUserUserIdOrderByOrderDateDesc(Long userId);
    @Query("SELECT o FROM FoodOrder o WHERE " +
            "(:status IS NULL OR CAST(o.orderStatus AS string) = :status) AND " +
            "(:date IS NULL OR CAST(o.orderDate AS date) = :date) AND " +
            "(:customer IS NULL OR CONCAT(o.user.firstName, ' ', o.user.lastName) LIKE %:customer%)")
    List<FoodOrder> searchOrders(
            @Param("status") String status,
            @Param("date") LocalDate date,
            @Param("customer") String customer
    );
}