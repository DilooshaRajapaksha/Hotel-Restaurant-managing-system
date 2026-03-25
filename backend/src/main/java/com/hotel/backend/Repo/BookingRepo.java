package com.hotel.backend.Repo;

import com.hotel.backend.Entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface BookingRepo extends JpaRepository<Booking, Long> {

    // Find all bookings by status
    List<Booking> findByBookingStatus(Booking.BookingStatus status);

    // Find by room ID
    List<Booking> findByRoomId(Long roomId);

    // Find by user ID
    List<Booking> findByUserId(Long userId);

    // Search by booking ID, room ID, or user ID
    @Query("SELECT b FROM Booking b WHERE " +
            "CAST(b.roomId AS string) LIKE %:keyword% OR " +
            "CAST(b.userId AS string) LIKE %:keyword% OR " +
            "CAST(b.bookingId AS string) LIKE %:keyword%")
    List<Booking> searchBookings(@Param("keyword") String keyword);

    @Query("SELECT b FROM Booking b WHERE " +
            "b.roomId = :roomId AND " +
            "b.bookingStatus IN (:pending, :confirmed) AND " +
            "b.checkInDate < :checkOut AND " +
            "b.checkOutDate > :checkIn")
    List<Booking> findOverlappingBookings(
            @Param("roomId")    Long                   roomId,
            @Param("checkIn")   LocalDate              checkIn,
            @Param("checkOut")  LocalDate              checkOut,
            @Param("pending")   Booking.BookingStatus  pending,
            @Param("confirmed") Booking.BookingStatus  confirmed);
}