package com.hotel.backend.Service;

import com.hotel.backend.DTO.NotificationPayloadDTO;
import com.hotel.backend.DTO.OrderItemDTO;
import com.hotel.backend.DTO.OrderResponseDTO;
import com.hotel.backend.DTO.PlaceOrderItemDTO;
import com.hotel.backend.DTO.PlaceOrderRequestDTO;
import com.hotel.backend.Entity.Address;
import com.hotel.backend.Entity.FoodOrder;
import com.hotel.backend.Entity.OrderStatus;
import com.hotel.backend.Entity.OrderItem;
import com.hotel.backend.Entity.Payment;
import com.hotel.backend.Entity.User;
import com.hotel.backend.Repo.AddressRepo;
import com.hotel.backend.Repo.FoodOrderRepo;
import com.hotel.backend.Repo.MenuItemRepo;
import com.hotel.backend.Repo.OrderItemRepo;
import com.hotel.backend.Repo.PaymentRepo;
import com.hotel.backend.Repo.UserRepo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final FoodOrderRepo foodOrderRepo;
    private final OrderItemRepo orderItemRepo;
    private final PaymentRepo paymentRepo;
    private final UserRepo userRepo;
    private final MenuItemRepo menuItemRepo;
    private final AddressRepo addressRepo;
    private final SimpMessagingTemplate messagingTemplate;

    public OrderService(FoodOrderRepo foodOrderRepo,
                        OrderItemRepo orderItemRepo,
                        PaymentRepo paymentRepo,
                        UserRepo userRepo,
                        MenuItemRepo menuItemRepo,
                        AddressRepo addressRepo,
                        SimpMessagingTemplate messagingTemplate) {
        this.foodOrderRepo     = foodOrderRepo;
        this.orderItemRepo     = orderItemRepo;
        this.paymentRepo       = paymentRepo;
        this.userRepo          = userRepo;
        this.menuItemRepo      = menuItemRepo;
        this.addressRepo       = addressRepo;
        this.messagingTemplate = messagingTemplate;
    }

    public OrderResponseDTO placeOrder(Long userId, PlaceOrderRequestDTO request) {
        if (request.getItems() == null || request.getItems().isEmpty())
            throw new RuntimeException("Order must contain at least one item");

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getCustomerName() == null || request.getCustomerName().isBlank())
            throw new RuntimeException("Customer name is required");
        if (request.getEmail() == null || request.getEmail().isBlank())
            throw new RuntimeException("Email is required");
        if (request.getPhone() == null || request.getPhone().isBlank())
            throw new RuntimeException("Phone number is required");
        if (request.getStreet() == null || request.getStreet().isBlank() ||
                request.getCity() == null || request.getCity().isBlank())
            throw new RuntimeException("Street and city are required");
        if (request.getLatitude() == null || request.getLongitude() == null)
            throw new RuntimeException("Location coordinates are required");

        Address address = new Address();
        address.setUser(user);
        address.setHouseNo(request.getHouseNo());
        address.setStreet(request.getStreet());
        address.setArea(request.getArea());
        address.setCity(request.getCity());
        address.setNotes(request.getNotes());
        address.setIsDefault(true);
        address.setLatitude(request.getLatitude());
        address.setLongitude(request.getLongitude());
        address.setFormattedAddress(request.getFormattedAddress());

        Address savedAddress = addressRepo.save(address);

        FoodOrder order = new FoodOrder();
        order.setUser(user);
        order.setAddress(savedAddress);
        order.setOrderDate(LocalDateTime.now());
        // FIX: set enum value, not String
        order.setOrderStatus(OrderStatus.PENDING);
        order.setTotalAmount(BigDecimal.ZERO);

        FoodOrder savedOrder = foodOrderRepo.save(order);

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (PlaceOrderItemDTO reqItem : request.getItems()) {
            if (reqItem.getItemId() == null)
                throw new RuntimeException("Item id is required");
            if (reqItem.getQuantity() == null || reqItem.getQuantity() <= 0)
                throw new RuntimeException("Invalid quantity for item: " + reqItem.getItemId());

            var menuItem = menuItemRepo.findById(reqItem.getItemId())
                    .orElseThrow(() -> new RuntimeException("Menu item not found: " + reqItem.getItemId()));

            if (menuItem.getIsAvailable() == null || !menuItem.getIsAvailable())
                throw new RuntimeException("Menu item is unavailable: " + menuItem.getItemName());

            BigDecimal unitPrice = menuItem.getPrice();
            BigDecimal subtotal  = unitPrice.multiply(BigDecimal.valueOf(reqItem.getQuantity()));
            totalAmount = totalAmount.add(subtotal);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setMenuItem(menuItem);
            orderItem.setQuantity(reqItem.getQuantity());
            orderItem.setUnitPrice(unitPrice);
            orderItem.setSubtotal(subtotal);
            orderItemRepo.save(orderItem);
        }

        savedOrder.setTotalAmount(totalAmount);
        foodOrderRepo.save(savedOrder);

        Payment payment = new Payment();
        payment.setUser(user);
        payment.setOrder(savedOrder);
        payment.setAmount(totalAmount);
        payment.setPaymentMethod(
                request.getPaymentMethod() != null && !request.getPaymentMethod().isBlank()
                        ? request.getPaymentMethod() : "CASH");
        payment.setPaymentStatus("PENDING");
        payment.setTransactionReferences(null);
        paymentRepo.save(payment);

        OrderResponseDTO result = getOrderById(savedOrder.getOrderId());

        String customerName = user.getFirstName() + " " + user.getLastName();
        String msg = customerName + " · LKR " + totalAmount.toPlainString();
        NotificationPayloadDTO notif = new NotificationPayloadDTO(
                NotificationPayloadDTO.Type.ORDER,
                savedOrder.getOrderId(),
                "New Order #" + savedOrder.getOrderId(),
                msg
        );
        messagingTemplate.convertAndSend("/topic/admin-notifications", notif);

        return result;
    }

    public List<OrderResponseDTO> getAllOrders(String status, LocalDate date, String customer) {
        String fixedStatus   = (status == null || status.isBlank() || status.equalsIgnoreCase("ALL")) ? null : status;
        String fixedCustomer = (customer == null || customer.isBlank()) ? null : customer;
        return foodOrderRepo.searchOrders(fixedStatus, date, fixedCustomer)
                .stream().map(this::toListDTO).collect(Collectors.toList());
    }

    public OrderResponseDTO getOrderById(Long orderId) {
        FoodOrder order = foodOrderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return toDetailsDTO(order);
    }

    public OrderResponseDTO updateOrderStatus(Long orderId, String newStatus) {
        FoodOrder order = foodOrderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        // FIX: compare enum values, not strings
        OrderStatus parsed = parseStatus(newStatus);
        if (order.getOrderStatus() == OrderStatus.CANCELLED)
            throw new RuntimeException("Cancelled order cannot be updated");
        if (order.getOrderStatus() == OrderStatus.DELIVERED)
            throw new RuntimeException("Delivered order cannot be updated");
        order.setOrderStatus(parsed);
        foodOrderRepo.save(order);
        return toDetailsDTO(order);
    }

    public OrderResponseDTO cancelOrder(Long orderId) {
        FoodOrder order = foodOrderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        // FIX: compare enum values
        if (order.getOrderStatus() == OrderStatus.DELIVERED)
            throw new RuntimeException("Delivered order cannot be cancelled");
        if (order.getOrderStatus() == OrderStatus.CANCELLED)
            throw new RuntimeException("Order is already cancelled");
        order.setOrderStatus(OrderStatus.CANCELLED);
        foodOrderRepo.save(order);
        return toDetailsDTO(order);
    }

    // FIX: parse String -> enum safely
    private OrderStatus parseStatus(String status) {
        try {
            return OrderStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new RuntimeException("Invalid order status: " + status);
        }
    }

    private OrderResponseDTO toListDTO(FoodOrder order) {
        OrderResponseDTO dto = new OrderResponseDTO();
        dto.setOrder_id(order.getOrderId());
        dto.setOrder_date(order.getOrderDate());
        dto.setTotal_amount(order.getTotalAmount());
        // FIX: convert enum to String for DTO
        dto.setOrder_status(order.getOrderStatus() != null ? order.getOrderStatus().name() : null);
        dto.setUser_id(order.getUser().getUserId());
        dto.setCustomer_name(order.getUser().getFirstName() + " " + order.getUser().getLastName());
        dto.setCustomer_email(order.getUser().getEmail());
        dto.setCustomer_phone(order.getUser().getPhoneNumber());
        dto.setAddress_id(order.getAddress().getAddressId());
        dto.setHouse_no(order.getAddress().getHouseNo());
        dto.setStreet(order.getAddress().getStreet());
        dto.setArea(order.getAddress().getArea());
        dto.setCity(order.getAddress().getCity());
        dto.setNotes(order.getAddress().getNotes());
        dto.setFormatted_address(order.getAddress().getFormattedAddress());
        dto.setLatitude(order.getAddress().getLatitude());
        dto.setLongitude(order.getAddress().getLongitude());
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
                .stream().map(this::toItemDTO).collect(Collectors.toList());
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

    public List<OrderResponseDTO> getMyOrders(Long userId) {
        return foodOrderRepo.findByUserUserIdOrderByOrderDateDesc(userId)
                .stream().map(this::toListDTO).collect(Collectors.toList());
    }
}