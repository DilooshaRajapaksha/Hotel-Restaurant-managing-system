package com.hotel.backend.Controller;

import com.hotel.backend.DTO.BookingRequestDTO;
import com.hotel.backend.Entity.Booking;
import com.hotel.backend.Entity.BookingStatus;
import com.hotel.backend.Service.BookingService;
import com.hotel.backend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/customer/bookings")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class CustomerBookingController {

    @Autowired private BookingService bookingService;
    @Autowired private UserService    userService;

    private Long getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userService.getUserByEmail(email).getUserId();
    }

    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings() {
        return ResponseEntity.ok(bookingService.getBookingsByUserId(getCurrentUserId()));
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequestDTO dto) {
        try {
            Long userId = getCurrentUserId();
            Booking saved = bookingService.createBookingForCustomer(
                    userId,
                    dto.getRoomId(),
                    LocalDate.parse(dto.getCheckInDate()),
                    LocalDate.parse(dto.getCheckOutDate()),
                    dto.getNumberOfGuest(),
                    dto.getSpecialRequest()
            );
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "An unexpected error occurred."));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBooking(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        Optional<Booking> bookingOpt = bookingService.getBookingById(id)
                .filter(b -> b.getUserId().equals(userId));
        if (bookingOpt.isPresent()) {
            return ResponseEntity.ok(bookingOpt.get());
        } else {
            return ResponseEntity.status(403).body(Map.of("message", "This booking does not belong to you"));
        }
    }

    @PatchMapping("/{id}/cancel")
    public ResponseEntity<?> cancelMyBooking(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        Booking booking = bookingService.getBookingById(id)
                .filter(b -> b.getUserId().equals(userId))
                .orElseThrow(() -> new RuntimeException("Booking not found or not yours"));

        // FIX: use standalone BookingStatus enum, not Booking.BookingStatus
        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            return ResponseEntity.badRequest().body(Map.of("message", "Booking is already cancelled"));
        }
        bookingService.updateBookingStatus(id, BookingStatus.CANCELLED);
        return ResponseEntity.ok(Map.of("message", "Booking cancelled successfully"));
    }
}