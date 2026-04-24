package com.hotel.backend.Service;

import com.hotel.backend.Entity.DeliveryStaff;
import com.hotel.backend.Entity.FoodOrder;
import com.hotel.backend.Repo.DeliveryStaffRepo;
import com.hotel.backend.Repo.FoodOrderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DeliveryStaffService {

    @Autowired private DeliveryStaffRepo staffRepo;
    @Autowired private FoodOrderRepo     orderRepo;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public List<DeliveryStaff> getAllStaff() {
        return staffRepo.findAll();
    }

    public Optional<DeliveryStaff> getStaffById(Long id) {
        return staffRepo.findById(id);
    }

    public DeliveryStaff addStaff(DeliveryStaff staff) {
        if (staffRepo.existsByEmail(staff.getEmail())) {
            throw new RuntimeException("Email already registered: " + staff.getEmail());
        }
        // Hash the password before saving
        staff.setPasswardHash(encoder.encode(staff.getPasswardHash()));
        return staffRepo.save(staff);
    }

    public DeliveryStaff updateStaff(Long id, DeliveryStaff updated) {
        DeliveryStaff existing = staffRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found: " + id));
        if (updated.getSName()         != null) existing.setSName(updated.getSName());
        if (updated.getContactNumber() != null) existing.setContactNumber(updated.getContactNumber());
        if (updated.getEmail()         != null) existing.setEmail(updated.getEmail());
        return staffRepo.save(existing);
    }

    public void deleteStaff(Long id) {
        staffRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found: " + id));

        List<FoodOrder> assigned = orderRepo.findByStaffId(id);
        for (FoodOrder o : assigned) {
            o.setStaffId(null);
            orderRepo.save(o);
        }
        staffRepo.deleteById(id);
    }

    public long countAssignments(Long staffId) {
        return orderRepo.countByStaffId(staffId);
    }

    public List<FoodOrder> getAllOrders() {
        return orderRepo.findAll();
    }

    public List<FoodOrder> getUnassignedOrders() {
        return orderRepo.findByStaffIdIsNull();
    }

    public List<FoodOrder> getOrdersByStaff(Long staffId) {
        return orderRepo.findByStaffId(staffId);
    }

    public FoodOrder assignStaffToOrder(Long orderId, Long staffId) {
        FoodOrder order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        staffRepo.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found: " + staffId));

        if (order.getOrderStatus() == FoodOrder.OrderStatus.DELIVERED ||
                order.getOrderStatus() == FoodOrder.OrderStatus.CANCELLED) {
            throw new RuntimeException(
                    "Cannot assign staff to a " + order.getOrderStatus() + " order.");
        }

        order.setStaffId(staffId);
        if (order.getOrderStatus() == FoodOrder.OrderStatus.CONFIRMED ||
                order.getOrderStatus() == FoodOrder.OrderStatus.PREPARING) {
            order.setOrderStatus(FoodOrder.OrderStatus.OUT_FOR_DELIVERY);
        }
        return orderRepo.save(order);
    }

    public FoodOrder unassignStaffFromOrder(Long orderId) {
        FoodOrder order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
        order.setStaffId(null);
        return orderRepo.save(order);
    }

    public FoodOrder reassignStaff(Long orderId, Long newStaffId) {
        FoodOrder order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
        staffRepo.findById(newStaffId)
                .orElseThrow(() -> new RuntimeException("Staff not found: " + newStaffId));
        order.setStaffId(newStaffId);
        return orderRepo.save(order);
    }

    public FoodOrder updateOrderStatus(Long orderId, FoodOrder.OrderStatus newStatus) {
        FoodOrder order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
        order.setOrderStatus(newStatus);
        return orderRepo.save(order);
    }
}
