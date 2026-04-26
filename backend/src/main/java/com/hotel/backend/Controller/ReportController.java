package com.hotel.backend.Controller;

import com.hotel.backend.Entity.Booking;
import com.hotel.backend.Entity.BookingStatus;
import com.hotel.backend.Entity.Room;
import com.hotel.backend.Repo.BookingRepo;
import com.hotel.backend.Repo.RoomRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/reports")
@CrossOrigin(origins = "http://localhost:5173")
public class ReportController {

    @Autowired private BookingRepo bookingRepo;
    @Autowired private RoomRepo    roomRepo;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummary() {
        Map<String, Object> data = new LinkedHashMap<>();

        List<Room> allRooms = roomRepo.findAll();
        data.put("totalRooms",       allRooms.size());
        data.put("availableRooms",   allRooms.stream().filter(r -> r.getRoomStatus() == Room.RoomStatus.AVAILABLE).count());
        // Team schema only has AVAILABLE and MAINTENANCE — no "unavailable"
        data.put("unavailableRooms", 0);
        data.put("maintenanceRooms", allRooms.stream().filter(r -> r.getRoomStatus() == Room.RoomStatus.MAINTENANCE).count());

        List<Booking> allBookings = bookingRepo.findAll();
        data.put("totalBookings",     allBookings.size());
        data.put("pendingBookings",   allBookings.stream().filter(b -> b.getBookingStatus() == BookingStatus.PENDING).count());
        data.put("confirmedBookings", allBookings.stream().filter(b -> b.getBookingStatus() == BookingStatus.CONFIRMED).count());
        data.put("cancelledBookings", allBookings.stream().filter(b -> b.getBookingStatus() == BookingStatus.CANCELLED).count());

        BigDecimal revenue = allBookings.stream()
                .filter(b -> b.getBookingStatus() == BookingStatus.CONFIRMED)
                .map(Booking::getTotalPrice)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        data.put("totalRevenue", revenue);

        // TODO: inject MenuItemRepo, MenuRepo, UserRepo after team merge in Sprint 3
        data.put("totalMenuItems",      0);
        data.put("totalMenuCategories", 0);
        data.put("totalUsers",          0);

        Map<Long, Long> roomCount = allBookings.stream()
                .collect(Collectors.groupingBy(Booking::getRoomId, Collectors.counting()));
        List<Map<String, Object>> topRooms = roomCount.entrySet().stream()
                .sorted(Map.Entry.<Long, Long>comparingByValue().reversed())
                .limit(5)
                .map(e -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("roomId", e.getKey());
                    m.put("count",  e.getValue());
                    // Try to get real room name
                    roomRepo.findById(e.getKey()).ifPresent(r -> m.put("roomName", r.getRoomName()));
                    return m;
                })
                .collect(Collectors.toList());
        data.put("topBookedRooms", topRooms);

        int year = LocalDate.now().getYear();
        long[]       monthlyBookings = new long[12];
        BigDecimal[] monthlyRevenue  = new BigDecimal[12];
        Arrays.fill(monthlyRevenue, BigDecimal.ZERO);

        allBookings.stream()
                .filter(b -> b.getCheckInDate() != null && b.getCheckInDate().getYear() == year)
                .forEach(b -> {
                    int m = b.getCheckInDate().getMonthValue() - 1;
                    monthlyBookings[m]++;
                    if (b.getBookingStatus() == BookingStatus.CONFIRMED && b.getTotalPrice() != null)
                        monthlyRevenue[m] = monthlyRevenue[m].add(b.getTotalPrice());
                });

        data.put("monthlyBookings", monthlyBookings);
        data.put("monthlyRevenue",  monthlyRevenue);
        data.put("currentYear",     year);

        return ResponseEntity.ok(data);
    }
}