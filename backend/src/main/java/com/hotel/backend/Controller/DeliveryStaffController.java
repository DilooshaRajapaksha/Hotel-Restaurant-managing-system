package com.hotel.backend.Controller;

import com.hotel.backend.Entity.DeliveryStaff;
import com.hotel.backend.Entity.FoodOrder;
import com.hotel.backend.Service.DeliveryStaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/delivery")
@CrossOrigin(origins = "http://localhost:5173")
public class DeliveryStaffController {

    @Autowired
    private DeliveryStaffService staffService;

    @GetMapping("/staff")
    public ResponseEntity<List<DeliveryStaff>> getAllStaff() {
        return ResponseEntity.ok(staffService.getAllStaff());
    }

    @GetMapping("/staff/{id}")
    public ResponseEntity<?> getStaffById(@PathVariable Long id) {
        return staffService.getStaffById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/staff/{id}/assignments/count")
    public ResponseEntity<Long> getAssignmentCount(@PathVariable Long id) {
        return ResponseEntity.ok(staffService.countAssignments(id));
    }

    @PostMapping("/staff")
    public ResponseEntity<?> addStaff(@RequestBody DeliveryStaff staff) {
        try {
            DeliveryStaff saved = staffService.addStaff(staff);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/staff/{id}")
    public ResponseEntity<?> updateStaff(@PathVariable Long id,
                                         @RequestBody DeliveryStaff staff) {
        try {
            return ResponseEntity.ok(staffService.updateStaff(id, staff));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/staff/{id}")
    public ResponseEntity<String> deleteStaff(@PathVariable Long id) {
        try {
            staffService.deleteStaff(id);
            return ResponseEntity.ok("Staff member deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/orders")
    public ResponseEntity<List<FoodOrder>> getAllOrders() {
        return ResponseEntity.ok(staffService.getAllOrders());
    }

    @GetMapping("/orders/unassigned")
    public ResponseEntity<List<FoodOrder>> getUnassignedOrders() {
        return ResponseEntity.ok(staffService.getUnassignedOrders());
    }

    @GetMapping("/orders/staff/{staffId}")
    public ResponseEntity<List<FoodOrder>> getOrdersByStaff(@PathVariable Long staffId) {
        return ResponseEntity.ok(staffService.getOrdersByStaff(staffId));
    }

    @PatchMapping("/orders/{orderId}/assign")
    public ResponseEntity<?> assignStaff(@PathVariable Long orderId,
                                         @RequestBody Map<String, Long> body) {
        Long staffId = body.get("staffId");
        if (staffId == null)
            return ResponseEntity.badRequest().body("'staffId' is required");
        try {
            FoodOrder updated = staffService.assignStaffToOrder(orderId, staffId);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/orders/{orderId}/unassign")
    public ResponseEntity<?> unassignStaff(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok(staffService.unassignStaffFromOrder(orderId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/orders/{orderId}/reassign")
    public ResponseEntity<?> reassignStaff(@PathVariable Long orderId,
                                           @RequestBody Map<String, Long> body) {
        Long staffId = body.get("staffId");
        if (staffId == null)
            return ResponseEntity.badRequest().body("'staffId' is required");
        try {
            return ResponseEntity.ok(staffService.reassignStaff(orderId, staffId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PatchMapping("/orders/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long orderId,
                                               @RequestBody Map<String, String> body) {
        String statusStr = body.get("status");
        if (statusStr == null)
            return ResponseEntity.badRequest().body("'status' is required");
        try {
            FoodOrder.OrderStatus status = FoodOrder.OrderStatus.valueOf(statusStr.toUpperCase());
            return ResponseEntity.ok(staffService.updateOrderStatus(orderId, status));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    "Invalid status. Use: PENDING, CONFIRMED, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
