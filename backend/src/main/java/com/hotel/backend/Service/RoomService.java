package com.hotel.backend.Service;

import com.hotel.backend.Entity.Booking;
import com.hotel.backend.Entity.BookingStatus;
import com.hotel.backend.Entity.HotelImage;
import com.hotel.backend.Entity.Room;
import com.hotel.backend.Entity.RoomType;
import com.hotel.backend.Repo.BookingRepo;
import com.hotel.backend.Repo.HotelImageRepo;
import com.hotel.backend.Repo.RoomRepo;
import com.hotel.backend.Repo.RoomTypeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class RoomService {

    @Autowired private RoomRepo       roomRepo;
    @Autowired private RoomTypeRepo   roomTypeRepo;
    @Autowired private HotelImageRepo hotelImageRepo;
    @Autowired private BookingRepo    bookingRepo;

    private final String UPLOAD_DIR = "uploads/rooms/";

    public List<RoomType> getAllRoomTypes() {
        return roomTypeRepo.findAll();
    }

    public RoomType addRoomType(String roomTypeName, String roomDescription, Integer capacity) {
        Optional<RoomType> existing = roomTypeRepo.findFirstByRoomTypeName(roomTypeName);
        if (existing.isPresent()) return existing.get();
        RoomType rt = new RoomType();
        rt.setRoomTypeName(roomTypeName);
        rt.setRoomDescription(roomDescription);
        rt.setCapacity(capacity);
        return roomTypeRepo.save(rt);
    }

    public List<Room> getAllRooms() {
        return roomRepo.findAll();
    }

    public Optional<Room> getRoomById(Long id) {
        return roomRepo.findById(id);
    }

    public Room addRoom(String roomName, String roomTypeName, BigDecimal roomPrice, Room.RoomStatus roomStatus, String description, List<MultipartFile> images, MultipartFile panorama) throws IOException {
        RoomType roomType = roomTypeRepo.findFirstByRoomTypeName(roomTypeName).orElseThrow(() -> new RuntimeException("Room type not found: '" + roomTypeName + "'"));
        Room room = new Room();
        room.setRoomName(roomName);
        room.setRoomType(roomType);
        room.setRoomPrice(roomPrice);
        room.setRoomStatus(roomStatus != null ? roomStatus : Room.RoomStatus.AVAILABLE);
        if (description != null && !description.isBlank()) room.setDescription(description);
        Room saved = roomRepo.save(room);

        if (images != null && !images.isEmpty()) {
            boolean first = true;
            for (MultipartFile image : images) {
                if (image == null || image.isEmpty()) continue;
                String fileName = saveFile(image);
                HotelImage hi = new HotelImage();
                hi.setRoomId(saved.getRoomId());
                hi.setRimageUrl("/uploads/rooms/" + fileName);
                hi.setIsMain(first);
                hi.setIs360(false);
                hi.setUploadedAt(LocalDateTime.now());
                hotelImageRepo.save(hi);
                first = false;
            }
        }

        if (panorama != null && !panorama.isEmpty()) {
            String fileName = saveFile(panorama);
            HotelImage hi = new HotelImage();
            hi.setRoomId(saved.getRoomId());
            hi.setRimageUrl("/uploads/rooms/" + fileName);
            hi.setIsMain(false);
            hi.setIs360(true);
            hi.setUploadedAt(LocalDateTime.now());
            hotelImageRepo.save(hi);
        }
        return saved;
    }

    public Room updateRoom(Long id, String roomName, String roomTypeName, BigDecimal roomPrice, Room.RoomStatus roomStatus, String description, List<MultipartFile> images, MultipartFile panorama) throws IOException {
        Room room = roomRepo.findById(id).orElseThrow(() -> new RuntimeException("Room not found: " + id));
        if (roomName != null && !roomName.isBlank()) room.setRoomName(roomName);
        if (roomPrice != null) room.setRoomPrice(roomPrice);
        if (roomStatus != null) room.setRoomStatus(roomStatus);
        if (description != null && !description.isBlank()) room.setDescription(description);
        if (roomTypeName != null && !roomTypeName.isBlank()) {
            RoomType rt = roomTypeRepo.findFirstByRoomTypeName(roomTypeName).orElseThrow(() -> new RuntimeException("Room type not found: '" + roomTypeName + "'"));
            room.setRoomType(rt);
        }
        Room saved = roomRepo.save(room);

        if (images != null && !images.isEmpty()) {
            for (MultipartFile image : images) {
                if (image == null || image.isEmpty()) continue;
                String fileName = saveFile(image);
                HotelImage hi = new HotelImage();
                hi.setRoomId(saved.getRoomId());
                hi.setRimageUrl("/uploads/rooms/" + fileName);
                hi.setIsMain(false);
                hi.setIs360(false);
                hi.setUploadedAt(LocalDateTime.now());
                hotelImageRepo.save(hi);
            }
        }

        if (panorama != null && !panorama.isEmpty()) {
            String fileName = saveFile(panorama);
            HotelImage hi = new HotelImage();
            hi.setRoomId(saved.getRoomId());
            hi.setRimageUrl("/uploads/rooms/" + fileName);
            hi.setIsMain(false);
            hi.setIs360(true);
            hi.setUploadedAt(LocalDateTime.now());
            hotelImageRepo.save(hi);
        }
        return saved;
    }

    public Room updateRoomStatus(Long id, Room.RoomStatus newStatus) {
        Room room = roomRepo.findById(id).orElseThrow(() -> new RuntimeException("Room not found: " + id));
        room.setRoomStatus(newStatus);
        return roomRepo.save(room);
    }

    @Transactional
    public void deleteRoom(Long id) {
        roomRepo.findById(id).orElseThrow(() -> new RuntimeException("Room not found: " + id));
        boolean hasActive = bookingRepo.hasActiveBookings(id, BookingStatus.PENDING, BookingStatus.CONFIRMED);
        if (hasActive) throw new RuntimeException("Cannot delete this room. It has active bookings (PENDING or CONFIRMED). Please cancel all bookings first.");
        roomRepo.deleteById(id);
    }

    public List<HotelImage> getImagesByRoomId(Long roomId) {
        return hotelImageRepo.findByRoomId(roomId);
    }

    public void deleteImage(Long imageId) {
        hotelImageRepo.deleteById(imageId);
    }

    private String saveFile(MultipartFile file) throws IOException {
        Files.createDirectories(Paths.get(UPLOAD_DIR));
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Files.write(Paths.get(UPLOAD_DIR + fileName), file.getBytes());
        return fileName;
    }
}