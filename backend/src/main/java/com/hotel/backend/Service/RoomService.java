package com.hotel.backend.Service;

import com.hotel.backend.DTO.RoomResponse;
import com.hotel.backend.Entity.HotelImage;
import com.hotel.backend.Entity.Room;
import com.hotel.backend.Repo.HotelImageRepo;
import com.hotel.backend.Repo.RoomRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import com.hotel.backend.Entity.Room;
import com.hotel.backend.Repo.RoomRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class RoomService {

    private final RoomRepo roomRepository;
    private final HotelImageRepo hotelImageRepo;

    public RoomService(RoomRepo roomRepository, HotelImageRepo hotelImageRepo) {
        this.roomRepository = roomRepository;
        this.hotelImageRepo = hotelImageRepo;
    }

    public List<RoomResponse> getAllRooms() {
        return roomRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public RoomResponse getRoomById(Long id) {
        return roomRepository.findById(id)
                .map(this::mapToResponse)
                .orElse(null);
    }

    private RoomResponse mapToResponse(Room r) {
        String imageUrl = hotelImageRepo.findMainImageByRoomId(r.getRoomId())
                .map(HotelImage::getRimageUrl)
                .orElse("https://images.unsplash.com/photo-1611892440504-42a79208a498?w=800");

        return new RoomResponse(
                r.getRoomId(),
                r.getRoomName(),
                r.getRoomPrice(),
                r.getRoomStatus().name(),
                imageUrl,
                r.getRoomType().getCapacity(),
                r.getRoomType().getRoomDescription()
        );
    }
}
    @Autowired
    private RoomRepo roomRepository;

    // Folder where uploaded images will be saved on the server
    private final String UPLOAD_DIR = "uploads/rooms/";

    // ── Get all rooms ──────────────────────────────────────────────────────
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    // ── Get one room by ID ─────────────────────────────────────────────────
    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findById(id);
    }

    // ── Add new room ───────────────────────────────────────────────────────
    public Room addRoom(String roomName,
                        String roomType,
                        Double pricePerNight,
                        String description,
                        Integer capacity,
                        String amenities,
                        String availability,
                        List<MultipartFile> images,
                        MultipartFile media360) throws IOException {

        Room room = new Room();
        room.setRoomName(roomName);
        room.setRoomType(roomType);
        room.setPricePerNight(pricePerNight);
        room.setDescription(description);
        room.setCapacity(capacity);
        room.setAmenities(amenities);
        room.setAvailability(availability);

        // Save images to local folder
        if (images != null && !images.isEmpty()) {
            List<String> imageNames = new ArrayList<>();
            for (MultipartFile image : images) {
                String fileName = saveFile(image, UPLOAD_DIR);
                imageNames.add(fileName);
            }
            room.setImages(String.join(",", imageNames));
        }

        // Save 360 media
        if (media360 != null && !media360.isEmpty()) {
            String media360Name = saveFile(media360, UPLOAD_DIR);
            room.setMedia360(media360Name);
        }

        return roomRepository.save(room);
    }

    // ── Update room ────────────────────────────────────────────────────────
    public Room updateRoom(Long id,
                           String roomName,
                           String roomType,
                           Double pricePerNight,
                           String description,
                           Integer capacity,
                           String amenities,
                           String availability,
                           List<MultipartFile> images,
                           MultipartFile media360) throws IOException {

        Room room = roomRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Room not found with id: " + id));

        if (roomName    != null) room.setRoomName(roomName);
        if (roomType    != null) room.setRoomType(roomType);
        if (pricePerNight != null) room.setPricePerNight(pricePerNight);
        if (description != null) room.setDescription(description);
        if (capacity    != null) room.setCapacity(capacity);
        if (amenities   != null) room.setAmenities(amenities);
        if (availability != null) room.setAvailability(availability);

        if (images != null && !images.isEmpty()) {
            List<String> imageNames = new ArrayList<>();
            for (MultipartFile image : images) {
                String fileName = saveFile(image, UPLOAD_DIR);
                imageNames.add(fileName);
            }
            room.setImages(String.join(",", imageNames));
        }

        if (media360 != null && !media360.isEmpty()) {
            String media360Name = saveFile(media360, UPLOAD_DIR);
            room.setMedia360(media360Name);
        }

        return roomRepository.save(room);
    }

    // ── Delete room ────────────────────────────────────────────────────────
    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }

    // ── Helper: save file to local folder ─────────────────────────────────
    private String saveFile(MultipartFile file, String directory) throws IOException {
        Files.createDirectories(Paths.get(directory));
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(directory + fileName);
        Files.write(filePath, file.getBytes());
        return fileName;
    }
}
