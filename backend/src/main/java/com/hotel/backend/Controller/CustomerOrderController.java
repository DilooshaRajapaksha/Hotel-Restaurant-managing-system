package com.hotel.backend.Controller.customer;

import com.hotel.backend.DTO.OrderResponseDTO;
import com.hotel.backend.Service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerOrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    private Long getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userService.getUserByEmail(email).getUserId();
    }

    // GET /api/customer/orders/my
    @GetMapping("/my")
    public ResponseEntity<List<OrderResponseDTO>> getMyOrders() {
        Long userId = getCurrentUserId();
        List<OrderResponseDTO> myOrders = orderService.getMyOrders(userId);
        return ResponseEntity.ok(myOrders);
    }

    // GET /api/customer/orders/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getMyOrder(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        OrderResponseDTO order = orderService.getOrderById(id);

        if (!order.getUser_id().equals(userId)) {
            return ResponseEntity.status(403).body("This order does not belong to you");
        }
        return ResponseEntity.ok(order);
    }

    // (Optional) Cancel my own order
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelMyOrder(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        OrderResponseDTO order = orderService.getOrderById(id);

        if (!order.getUser_id().equals(userId)) {
            return ResponseEntity.status(403).body("This order does not belong to you");
        }

        return ResponseEntity.ok(orderService.cancelOrder(id));
    }
}