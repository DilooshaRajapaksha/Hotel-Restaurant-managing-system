package com.hotel.backend.Service;

import com.hotel.backend.DTO.OrderItemDTO;
import com.hotel.backend.DTO.OrderResponseDTO;
import com.hotel.backend.Entity.FoodOrder;
import com.hotel.backend.Entity.OrderItem;
import com.hotel.backend.Entity.Payment;
import com.hotel.backend.Repo.FoodOrderRepo;
import com.hotel.backend.Repo.OrderItemRepo;
import com.hotel.backend.Repo.PaymentRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final FoodOrderRepo foodOrderRepo;
    private final OrderItemRepo orderItemRepo;
    private final PaymentRepo paymentRepo;

    public OrderService(FoodOrderRepo foodOrderRepo,
                        OrderItemRepo orderItemRepo,
                        PaymentRepo paymentRepo) {
        this.foodOrderRepo = foodOrderRepo;
        this.orderItemRepo = orderItemRepo;
        this.paymentRepo = paymentRepo;
    }

    public List<OrderResponseDTO> getAllOrders(String status, LocalDate date, String customer) {
        String fixedStatus = (status == null || status.isBlank() || status.equalsIgnoreCase("ALL")) ? null : status;
        String fixedCustomer = (customer == null || customer.isBlank()) ? null : customer;

        return foodOrderRepo.searchOrders(fixedStatus, date, fixedCustomer)
                .stream()
                .map(this::toListDTO)
                .collect(Collectors.toList());
    }

    public OrderResponseDTO getOrderById(Long orderId) {
        FoodOrder order = foodOrderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return toDetailsDTO(order);
    }

    public OrderResponseDTO updateOrderStatus(Long orderId, String newStatus) {
        FoodOrder order = foodOrderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        validateStatus(newStatus);

        if ("CANCELLED".equalsIgnoreCase(order.getOrderStatus())) {
            throw new RuntimeException("Cancelled order cannot be updated");
        }

        if ("DELIVERED".equalsIgnoreCase(order.getOrderStatus())) {
            throw new RuntimeException("Delivered order cannot be updated");
        }

        order.setOrderStatus(newStatus);
        foodOrderRepo.save(order);

        notifyCustomer(order, "Your order status changed to " + newStatus);

        return toDetailsDTO(order);
    }

    public OrderResponseDTO cancelOrder(Long orderId) {
        FoodOrder order = foodOrderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if ("DELIVERED".equalsIgnoreCase(order.getOrderStatus())) {
            throw new RuntimeException("Delivered order cannot be cancelled");
        }

        if ("CANCELLED".equalsIgnoreCase(order.getOrderStatus())) {
            throw new RuntimeException("Order is already cancelled");
        }

        order.setOrderStatus("CANCELLED");
        foodOrderRepo.save(order);

        notifyCustomer(order, "Your order has been cancelled");

        return toDetailsDTO(order);
    }

    private void validateStatus(String status) {
        List<String> allowed = List.of(
                "PENDING",
                "CONFIRMED",
                "PREPARING",
                "OUT_FOR_DELIVERY",
                "DELIVERED",
                "CANCELLED"
        );

        if (status == null || !allowed.contains(status)) {
            throw new RuntimeException("Invalid order status: " + status);
        }
    }

    private void notifyCustomer(FoodOrder order, String message) {
        System.out.println("Notify customer -> " +
                order.getUser().getEmail() + " | " +
                order.getUser().getPhoneNumber() + " | " +
                message);
    }

    private OrderResponseDTO toListDTO(FoodOrder order) {
        OrderResponseDTO dto = new OrderResponseDTO();

        dto.setOrder_id(order.getOrderId());
        dto.setOrder_date(order.getOrderDate());
        dto.setTotal_amount(order.getTotalAmount());
        dto.setOrder_status(order.getOrderStatus());

        dto.setUser_id(order.getUser().getUserId());
        dto.setCustomer_name(order.getUser().getFirstName() + " " + order.getUser().getLastName());
        dto.setCustomer_email(order.getUser().getEmail());
        dto.setCustomer_phone(order.getUser().getPhoneNumber());

        dto.setAddress_id(order.getAddress().getAddressId());
        dto.setStreet(order.getAddress().getStreet());
        dto.setCity(order.getAddress().getCity());
        dto.setDistrict(order.getAddress().getDistrict());
        dto.setPostal_code(order.getAddress().getPostalCode());

        Payment payment = paymentRepo.findByOrderOrderId(order.getOrderId()).orElse(null);
        if (payment != null) {
            dto.setPayment_method(payment.getPaymentMethod());
            dto.setPayment_status(payment.getPaymentStatus());
        }

        return dto;
    }

    private OrderResponseDTO toDetailsDTO(FoodOrder order) {
        OrderResponseDTO dto = toListDTO(order);

        List<OrderItemDTO> items = orderItemRepo.findByOrderOrderId(order.getOrderId())
                .stream()
                .map(this::toItemDTO)
                .collect(Collectors.toList());

        dto.setItems(items);

        return dto;
    }

    private OrderItemDTO toItemDTO(OrderItem item) {
        OrderItemDTO dto = new OrderItemDTO();

        dto.setOrder_item_id(item.getOrderItemId());
        dto.setItem_id(item.getMenuItem().getItemId());
        dto.setItem_name(item.getMenuItem().getItemName());
        dto.setQuantity(item.getQuantity());
        dto.setUnit_price(item.getUnitPrice());
        dto.setSubtotal(item.getSubtotal());

        return dto;
    }
}