package com.hotel.backend.Service;

import com.hotel.backend.Entity.Address;
import com.hotel.backend.Entity.DeliveryStaff;
import com.hotel.backend.Entity.FoodOrder;
import com.hotel.backend.Entity.OrderStatus;
import com.hotel.backend.Repo.AddressRepo;
import com.hotel.backend.Repo.DeliveryStaffRepo;
import com.hotel.backend.Repo.FoodOrderRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class DeliveryStaffService {

    @Autowired private DeliveryStaffRepo staffRepo;
    @Autowired private FoodOrderRepo     orderRepo;
    @Autowired private AddressRepo       addressRepo;
    @Autowired private PasswordEncoder   passwordEncoder;

    // ── CRUD ──────────────────────────────────────────────────────────────────

    public List<DeliveryStaff> getAllStaff() { return staffRepo.findAll(); }

    public Optional<DeliveryStaff> getStaffById(Long id) { return staffRepo.findById(id); }

    public DeliveryStaff addStaff(DeliveryStaff staff) {
        if (staffRepo.existsByEmail(staff.getEmail()))
            throw new RuntimeException("Email already registered: " + staff.getEmail());
        staff.setPasswordHash(passwordEncoder.encode(staff.getPasswordHash()));
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

    @Transactional
    public void deleteStaff(Long id) {
        staffRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found: " + id));
        List<FoodOrder> assigned = orderRepo.findByStaffId(id);
        for (FoodOrder o : assigned) { o.setStaffId(null); orderRepo.save(o); }
        staffRepo.deleteById(id);
    }

    public long countAssignments(Long staffId) { return orderRepo.countByStaffId(staffId); }

    // ── Admin: Staff profile (by ID) ──────────────────────────────────────────

    public Map<String, Object> getStaffProfile(Long staffId) {
        DeliveryStaff staff = staffRepo.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found: " + staffId));
        return buildProfile(staff);
    }

    // ── Delivery staff: "me" profile (by JWT email) ───────────────────────────
    // NEW: delivery person calls this to get their own dashboard data

    public Map<String, Object> getMeProfile(String email) {
        DeliveryStaff staff = staffRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Delivery staff not found for email: " + email));
        return buildProfile(staff);
    }

    private Map<String, Object> buildProfile(DeliveryStaff staff) {
        List<FoodOrder> allOrders = orderRepo.findByStaffId(staff.getStaffId());

        List<FoodOrder> activeOrders = allOrders.stream()
                .filter(o -> o.getOrderStatus() != OrderStatus.DELIVERED &&
                        o.getOrderStatus() != OrderStatus.CANCELLED)
                .toList();

        List<FoodOrder> historyOrders = allOrders.stream()
                .filter(o -> o.getOrderStatus() == OrderStatus.DELIVERED ||
                        o.getOrderStatus() == OrderStatus.CANCELLED)
                .toList();

        Map<String, Object> profile = new HashMap<>();
        profile.put("staff",          staff);
        profile.put("activeOrders",   activeOrders.stream().map(this::enrichOrderWithAddress).toList());
        profile.put("historyOrders",  historyOrders.stream().map(this::enrichOrderWithAddress).toList());
        profile.put("totalDelivered", historyOrders.stream()
                .filter(o -> o.getOrderStatus() == OrderStatus.DELIVERED).count());
        return profile;
    }

    // ── Delivery staff: self-assign an available order ────────────────────────
    // NEW: delivery person picks an unassigned order from the available list

    public FoodOrder selfAssignOrder(Long orderId, String email) {
        DeliveryStaff staff = staffRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Delivery staff not found for email: " + email));

        FoodOrder order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));

        if (order.getStaffId() != null)
            throw new RuntimeException("This order is already assigned to another delivery person.");

        if (order.getOrderStatus() == OrderStatus.DELIVERED ||
                order.getOrderStatus() == OrderStatus.CANCELLED)
            throw new RuntimeException("Cannot take a " + order.getOrderStatus() + " order.");

        order.setStaffId(staff.getStaffId());
        // Auto-advance to OUT_FOR_DELIVERY when delivery person picks it up
        if (order.getOrderStatus() == OrderStatus.CONFIRMED ||
                order.getOrderStatus() == OrderStatus.PREPARING)
            order.setOrderStatus(OrderStatus.OUT_FOR_DELIVERY);

        return orderRepo.save(order);
    }

    // ── Order helpers ─────────────────────────────────────────────────────────

    private Map<String, Object> enrichOrderWithAddress(FoodOrder order) {
        Map<String, Object> enriched = new HashMap<>();
        enriched.put("order", order);
        try {
            Address address = order.getAddress();
            enriched.put("address", address);
            if (address != null) {
                String mapQuery = String.join("+",
                        address.getStreet() != null ? address.getStreet().replace(" ", "+") : "",
                        address.getCity()   != null ? address.getCity().replace(" ", "+") : "",
                        address.getArea()   != null ? address.getArea().replace(" ", "+") : "",
                        "Sri+Lanka"
                );
                enriched.put("mapsUrl", "https://www.google.com/maps/search/?api=1&query=" + mapQuery);
            } else {
                enriched.put("mapsUrl", null);
            }
        } catch (Exception e) {
            enriched.put("address", null);
            enriched.put("mapsUrl", null);
        }
        return enriched;
    }

    public List<FoodOrder> getAllOrders()            { return orderRepo.findAll(); }
    public List<FoodOrder> getUnassignedOrders()     { return orderRepo.findByStaffIdIsNull(); }
    public List<FoodOrder> getOrdersByStaff(Long id) { return orderRepo.findByStaffId(id); }

    public FoodOrder assignStaffToOrder(Long orderId, Long staffId) {
        FoodOrder order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
        staffRepo.findById(staffId)
                .orElseThrow(() -> new RuntimeException("Staff not found: " + staffId));

        if (order.getOrderStatus() == OrderStatus.DELIVERED ||
                order.getOrderStatus() == OrderStatus.CANCELLED)
            throw new RuntimeException("Cannot assign staff to a " + order.getOrderStatus() + " order.");

        order.setStaffId(staffId);
        if (order.getOrderStatus() == OrderStatus.CONFIRMED ||
                order.getOrderStatus() == OrderStatus.PREPARING)
            order.setOrderStatus(OrderStatus.OUT_FOR_DELIVERY);

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

    public FoodOrder updateOrderStatus(Long orderId, OrderStatus newStatus) {
        FoodOrder order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found: " + orderId));
        order.setOrderStatus(newStatus);
        return orderRepo.save(order);
    }
}
