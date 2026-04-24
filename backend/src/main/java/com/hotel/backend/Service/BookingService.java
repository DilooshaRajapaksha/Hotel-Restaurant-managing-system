package com.hotel.backend.Service;

import com.hotel.backend.DTO.BookingRequestDTO;
import com.hotel.backend.DTO.NotificationPayloadDTO;
import com.hotel.backend.Entity.Booking;
import com.hotel.backend.Entity.Room;
import com.hotel.backend.Entity.Role;
import com.hotel.backend.Entity.User;
import com.hotel.backend.Repo.BookingRepo;
import com.hotel.backend.Repo.RoleRepo;
import com.hotel.backend.Repo.RoomRepo;
import com.hotel.backend.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired private BookingRepo bookingRepo;
    @Autowired private RoomRepo    roomRepo;
    @Autowired private UserRepo    userRepo;
    @Autowired private RoleRepo    roleRepo;
    @Autowired private SimpMessagingTemplate messagingTemplate;   // Message

    public List<Booking> getAllBookings()                           { return bookingRepo.findAll(); }
    public Optional<Booking> getBookingById(Long id)               { return bookingRepo.findById(id); }
    public List<Booking> getBookingsByStatus(Booking.BookingStatus s) { return bookingRepo.findByBookingStatus(s); }
    public List<Booking> getBookingsByUserId(Long userId)          { return bookingRepo.findByUserId(userId); }
    public List<Booking> searchBookings(String keyword)            { return bookingRepo.searchBookings(keyword); }

    public Booking createBookingForCustomer(Long userId, Long roomId,
                                            LocalDate checkInDate, LocalDate checkOutDate,
                                            Integer numberOfGuest, String specialRequest) {
        return createBooking(userId, roomId, checkInDate, checkOutDate, numberOfGuest, specialRequest);
    }

    public Booking createBooking(Long userId, Long roomId,
                                 LocalDate checkInDate, LocalDate checkOutDate,
                                 Integer numberOfGuest, String specialRequest) {

        Room room = roomRepo.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + roomId));

        if (!checkOutDate.isAfter(checkInDate))
            throw new RuntimeException("Check-out date must be after check-in date.");
        if (checkInDate.isBefore(LocalDate.now()))
            throw new RuntimeException("Check-in date cannot be in the past.");

        List<Booking> overlapping = bookingRepo.findOverlappingBookings(
                roomId, checkInDate, checkOutDate,
                Booking.BookingStatus.PENDING, Booking.BookingStatus.CONFIRMED);
        if (!overlapping.isEmpty()) {
            Booking c = overlapping.get(0);
            throw new RuntimeException(
                    "Room is already booked from " + c.getCheckInDate() +
                            " to " + c.getCheckOutDate() + ". Please choose different dates.");
        }

        long nights = ChronoUnit.DAYS.between(checkInDate, checkOutDate);
        BigDecimal totalPrice = room.getRoomPrice().multiply(BigDecimal.valueOf(nights));

        Booking booking = new Booking();
        booking.setUserId(userId);
        booking.setRoomId(roomId);
        booking.setCheckInDate(checkInDate);
        booking.setCheckOutDate(checkOutDate);
        booking.setNumberOfGuest(numberOfGuest);
        booking.setSpecialRequest(specialRequest);
        booking.setTotalPrice(totalPrice);
        booking.setBookingStatus(Booking.BookingStatus.PENDING);

        Booking saved;
        try {
            saved = bookingRepo.save(booking);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("User with id " + userId + " does not exist.");
        }

        // Push WebSocket notification to admin
        User user = userRepo.findById(userId).orElse(null);
        String customerName = user != null
                ? user.getFirstName() + " " + user.getLastName()
                : "Guest";
        String msg = customerName + " · " + room.getRoomName()
                + " · " + checkInDate + " → " + checkOutDate;
        NotificationPayloadDTO notif = new NotificationPayloadDTO(
                NotificationPayloadDTO.Type.BOOKING,
                saved.getBookingId(),
                "New Booking #" + saved.getBookingId(),
                msg
        );
        messagingTemplate.convertAndSend("/topic/admin-notifications", notif);

        return saved;
    }

    public Booking updateBookingStatus(Long id, Booking.BookingStatus newStatus) {
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
        booking.setBookingStatus(newStatus);
        return bookingRepo.save(booking);
    }

    public void deleteBooking(Long id) { bookingRepo.deleteById(id); }

    public Booking createBooking(BookingRequestDTO dto) {
        LocalDate checkIn  = LocalDate.parse(dto.getCheckInDate());
        LocalDate checkOut = LocalDate.parse(dto.getCheckOutDate());

        User user = userRepo.findByEmail(dto.getEmail())
                .orElseGet(() -> {
                    User nu = new User();
                    nu.setFirstName(dto.getFirstName());
                    nu.setLastName(dto.getLastName() != null ? dto.getLastName() : "");
                    nu.setEmail(dto.getEmail());
                    nu.setPhoneNumber(dto.getPhoneNumber());
                    nu.setPasswordHash("temp-no-password");
                    Role r = roleRepo.findByName("CUSTOMER")
                            .orElseThrow(() -> new RuntimeException("Default customer role not found"));
                    nu.setRole(String.valueOf(r));
                    return userRepo.save(nu);
                });

        return createBooking(user.getUserId(), dto.getRoomId(), checkIn, checkOut,
                dto.getNumberOfGuest(), dto.getSpecialRequest());
    }
}
