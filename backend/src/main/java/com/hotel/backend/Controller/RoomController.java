package com.hotel.backend.Controller;

import com.hotel.backend.DTO.RoomResponse;
import com.hotel.backend.Service.RoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api")
public class RoomController {

    private final RoomService roomService;

    public RoomController(RoomService roomService) {
        this.roomService = roomService;
    }

    @GetMapping("/rooms")
    public List<RoomResponse> getAllRooms() {
        return roomService.getAllRooms();
    }

    @GetMapping("/rooms/{id}")
    public ResponseEntity<RoomResponse> getRoom(@PathVariable Long id) {
        RoomResponse room = roomService.getRoomById(id);
        if (room == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(room);
import com.hotel.backend.Entity.Room;
import com.hotel.backend.Entity.RoomType;
import com.hotel.backend.Service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/rooms")
@CrossOrigin(origins = "http://localhost:5173")
public class RoomController {

    @Autowired
    private RoomService roomService;

    // GET all room types
    @GetMapping("/types")
    public ResponseEntity<List<RoomType>> getAllRoomTypes() {
        return ResponseEntity.ok(roomService.getAllRoomTypes());
    }

    @PostMapping("/types")
    public ResponseEntity<?> addRoomType(
            @RequestParam String roomTypeName,
            @RequestParam String roomDescription,
            @RequestParam Integer capacity) {
        try {
            RoomType saved = roomService.addRoomType(roomTypeName, roomDescription, capacity);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getRoomById(@PathVariable Long id) {
        return roomService.getRoomById(id)
                .<ResponseEntity<?>>map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/images")
    public ResponseEntity<List<HotelImage>> getRoomImages(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getImagesByRoomId(id));
    }

    @PostMapping
    public ResponseEntity<?> addRoom(
            @RequestParam String roomName,
            @RequestParam String roomTypeName,
            @RequestParam BigDecimal roomPrice,
            @RequestParam(required = false, defaultValue = "AVAILABLE") String roomStatus,
            @RequestParam(required = false) List<MultipartFile> images
    ) throws IOException {
        try {
            Room.RoomStatus status = parseStatus(roomStatus);
            Room saved = roomService.addRoom(roomName, roomTypeName, roomPrice, status, images);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateRoom(
            @PathVariable Long id,
            @RequestParam(required = false) String roomName,
            @RequestParam(required = false) String roomTypeName,
            @RequestParam(required = false) BigDecimal roomPrice,
            @RequestParam(required = false) String roomStatus,
            @RequestParam(required = false) List<MultipartFile> images
    ) throws IOException {
        try {
            Room.RoomStatus status = roomStatus != null ? parseStatus(roomStatus) : null;
            Room updated = roomService.updateRoom(id, roomName, roomTypeName, roomPrice, status, images);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateRoomStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String statusStr = body.get("status");
        if (statusStr == null)
            return ResponseEntity.badRequest().body("'status' field is required");
        try {
            Room.RoomStatus newStatus = Room.RoomStatus.valueOf(statusStr.toUpperCase());
            Room updated = roomService.updateRoomStatus(id, newStatus);
            return ResponseEntity.ok(updated);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status. Use: AVAILABLE or MAINTENANCE");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.ok("Room deleted successfully");
    }

    @DeleteMapping("/images/{imageId}")
    public ResponseEntity<String> deleteImage(@PathVariable Long imageId) {
        roomService.deleteImage(imageId);
        return ResponseEntity.ok("Image deleted successfully");
    }

    private Room.RoomStatus parseStatus(String status) {
        try {
            return Room.RoomStatus.valueOf(status.toUpperCase());
        } catch (Exception e) {
            return Room.RoomStatus.AVAILABLE;
        }
    }
}