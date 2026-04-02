package com.hotel.backend.Controller;

import com.hotel.backend.DTO.BookingRequestDTO;
import com.hotel.backend.Entity.Booking;
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
@CrossOrigin(origins = "http://localhost:5173")
public class CustomerBookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserService userService;

    private Long getCurrentUserId() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userService.getUserByEmail(email).getUserId();
    }

    @GetMapping("/my")
    public ResponseEntity<List<Booking>> getMyBookings() {
        Long userId = getCurrentUserId();
        List<Booking> myBookings = bookingService.getBookingsByUserId(userId);
        return ResponseEntity.ok(myBookings);
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
            return ResponseEntity.badRequest().body(Map.of("message", "An unexpected error occurred while processing your booking."));
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

        if (booking.getBookingStatus() == Booking.BookingStatus.CANCELLED) {
            return ResponseEntity.badRequest().body(Map.of("message", "Booking is already cancelled"));
        }

        booking.setBookingStatus(Booking.BookingStatus.CANCELLED);
        bookingService.updateBookingStatus(id, Booking.BookingStatus.CANCELLED);

        return ResponseEntity.ok(Map.of("message", "Booking cancelled successfully"));
    }
}