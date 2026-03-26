package com.hotel.backend.Controller;

import com.hotel.backend.Entity.Booking;
import com.hotel.backend.Service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/bookings")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id) {
        return bookingService.getBookingById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Booking>> getByStatus(@PathVariable String status) {
        try {
            Booking.BookingStatus bs = Booking.BookingStatus.valueOf(status.toUpperCase());
            return ResponseEntity.ok(bookingService.getBookingsByStatus(bs));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Booking>> search(@RequestParam String keyword) {
        return ResponseEntity.ok(bookingService.searchBookings(keyword));
    }

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Map<String, Object> body) {
        try {
            Long userId        = Long.valueOf(body.get("userId").toString());
            Long roomId        = Long.valueOf(body.get("roomId").toString());
            LocalDate checkIn  = LocalDate.parse(body.get("checkInDate").toString());
            LocalDate checkOut = LocalDate.parse(body.get("checkOutDate").toString());
            Integer guests     = Integer.valueOf(body.get("numberOfGuest").toString());
            String special     = body.get("specialRequest") != null
                    ? body.get("specialRequest").toString()
                    : null;

            Booking saved = bookingService.createBooking(
                    userId, roomId, checkIn, checkOut, guests, special);

            return ResponseEntity.ok(saved);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid request. Please check all fields.");
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            String statusStr = body.get("status");
            if (statusStr == null) return ResponseEntity.badRequest().body("status field is required");
            Booking.BookingStatus newStatus = Booking.BookingStatus.valueOf(statusStr.toUpperCase());
            Booking updated = bookingService.updateBookingStatus(id, newStatus);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status value. Use: PENDING, CONFIRMED, CANCELLED");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBooking(@PathVariable Long id) {
        bookingService.deleteBooking(id);
        return ResponseEntity.ok("Booking deleted successfully");
    }
}