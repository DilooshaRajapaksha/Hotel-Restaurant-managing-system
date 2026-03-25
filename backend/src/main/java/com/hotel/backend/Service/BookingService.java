package com.hotel.backend.Service;

import com.hotel.backend.Entity.Booking;
import com.hotel.backend.Entity.Room;
import com.hotel.backend.Repo.BookingRepo;
import com.hotel.backend.Repo.RoomRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepo bookingRepo;

    @Autowired
    private RoomRepo roomRepo;

    // ── Get all bookings ───────────────────────────────────────────────────
    public List<Booking> getAllBookings() {
        return bookingRepo.findAll();
    }

    // ── Get booking by ID ──────────────────────────────────────────────────
    public Optional<Booking> getBookingById(Long id) {
        return bookingRepo.findById(id);
    }

    // ── Get bookings by status ─────────────────────────────────────────────
    public List<Booking> getBookingsByStatus(Booking.BookingStatus status) {
        return bookingRepo.findByBookingStatus(status);
    }

    public Booking createBooking(Long userId,
                                 Long roomId,
                                 LocalDate checkInDate,
                                 LocalDate checkOutDate,
                                 Integer numberOfGuest,
                                 String specialRequest) {

        // 1. Validate room exists
        Room room = roomRepo.findById(roomId)
                .orElseThrow(() -> new RuntimeException(
                        "Room not found with id: " + roomId));

        // 2. Validate dates
        if (!checkOutDate.isAfter(checkInDate)) {
            throw new RuntimeException(
                    "Check-out date must be after check-in date.");
        }
        if (checkInDate.isBefore(LocalDate.now())) {
            throw new RuntimeException(
                    "Check-in date cannot be in the past.");
        }

        // 3. Check for overlapping bookings — pass enum values as params
        //    (avoids the Booking$BookingStatus syntax error in JPQL)
        List<Booking> overlapping = bookingRepo.findOverlappingBookings(
                roomId,
                checkInDate,
                checkOutDate,
                Booking.BookingStatus.PENDING,
                Booking.BookingStatus.CONFIRMED
        );
        if (!overlapping.isEmpty()) {
            Booking conflict = overlapping.get(0);
            throw new RuntimeException(
                    "Room is already booked from "
                            + conflict.getCheckInDate()
                            + " to " + conflict.getCheckOutDate()
                            + ". Please choose different dates.");
        }

        // 4. Auto-calculate total price: roomPrice × nights
        long nights = ChronoUnit.DAYS.between(checkInDate, checkOutDate);
        BigDecimal totalPrice = room.getRoomPrice()
                .multiply(BigDecimal.valueOf(nights));

        // 5. Build booking
        Booking booking = new Booking();
        booking.setUserId(userId);
        booking.setRoomId(roomId);
        booking.setCheckInDate(checkInDate);
        booking.setCheckOutDate(checkOutDate);
        booking.setNumberOfGuest(numberOfGuest);
        booking.setSpecialRequest(specialRequest);
        booking.setTotalPrice(totalPrice);
        booking.setBookingStatus(Booking.BookingStatus.PENDING);

        // 6. Save — catch FK violation for missing user_id in USER table
        try {
            return bookingRepo.save(booking);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException(
                    "User with id " + userId + " does not exist. "
                            + "The user must be registered before making a booking.");
        }
    }

    // ── Update booking status ──────────────────────────────────────────────
    public Booking updateBookingStatus(Long id, Booking.BookingStatus newStatus) {
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new RuntimeException(
                        "Booking not found with id: " + id));
        booking.setBookingStatus(newStatus);
        return bookingRepo.save(booking);
    }

    // ── Delete booking ─────────────────────────────────────────────────────
    public void deleteBooking(Long id) {
        bookingRepo.deleteById(id);
    }

    // ── Search bookings ────────────────────────────────────────────────────
    public List<Booking> searchBookings(String keyword) {
        return bookingRepo.searchBookings(keyword);
    }
}