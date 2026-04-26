package com.hotel.backend.Controller;

import com.hotel.backend.Entity.DeliveryStaff;
import com.hotel.backend.Entity.FoodOrder;
import com.hotel.backend.Entity.OrderStatus;
import com.hotel.backend.Service.DeliveryStaffService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/delivery")
@CrossOrigin(origins = "http://localhost:5173")
public class DeliveryStaffController {

    @Autowired
    private DeliveryStaffService staffService;

    // ── Admin: Staff CRUD ─────────────────────────────────────────────────────

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

    /** Admin: view any staff member's profile by their ID */
    @GetMapping("/staff/{id}/profile")
    public ResponseEntity<?> getStaffProfile(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(staffService.getStaffProfile(id));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/staff/{id}/assignments/count")
    public ResponseEntity<Long> getAssignmentCount(@PathVariable Long id) {
        return ResponseEntity.ok(staffService.countAssignments(id));
    }

    @PostMapping("/staff")
    public ResponseEntity<?> addStaff(@RequestBody DeliveryStaff staff) {
        try {
            return ResponseEntity.ok(staffService.addStaff(staff));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/staff/{id}")
    public ResponseEntity<?> updateStaff(@PathVariable Long id, @RequestBody DeliveryStaff staff) {
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

    // ── Delivery staff: "me" endpoints (uses JWT identity) ───────────────────

    /**
     * NEW — Delivery person calls this to get their own dashboard:
     * profile info + active orders + history + stats.
     * Uses email from the JWT token — no ID needed.
     */
    @GetMapping("/me/profile")
    public ResponseEntity<?> getMyProfile() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            return ResponseEntity.ok(staffService.getMeProfile(email));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    /**
     * NEW — Delivery person self-assigns an available (unassigned) order.
     * Uses their email from JWT to look up their staffId — no manual ID passing.
     */
    @PatchMapping("/orders/{orderId}/self-assign")
    public ResponseEntity<?> selfAssignOrder(@PathVariable Long orderId) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        try {
            return ResponseEntity.ok(staffService.selfAssignOrder(orderId, email));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ── Order management (admin + delivery staff) ─────────────────────────────

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
        if (staffId == null) return ResponseEntity.badRequest().body("'staffId' is required");
        try {
            return ResponseEntity.ok(staffService.assignStaffToOrder(orderId, staffId));
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
        if (staffId == null) return ResponseEntity.badRequest().body("'staffId' is required");
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
        if (statusStr == null) return ResponseEntity.badRequest().body("'status' is required");
        try {
            OrderStatus status = OrderStatus.valueOf(statusStr.toUpperCase());
            return ResponseEntity.ok(staffService.updateOrderStatus(orderId, status));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    "Invalid status. Use: PENDING, CONFIRMED, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
