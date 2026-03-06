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
import com.hotel.backend.Service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/admin/rooms")
@CrossOrigin(origins = "http://localhost:5173") // Allow React frontend
public class RoomController {

    @Autowired
    private RoomService roomService;

    // GET all rooms → http://localhost:8081/api/admin/rooms
    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    // GET one room → http://localhost:8081/api/admin/rooms/1
    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable Long id) {
        return roomService.getRoomById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST add new room → http://localhost:8081/api/admin/rooms
    @PostMapping
    public ResponseEntity<Room> addRoom(
            @RequestParam String roomName,
            @RequestParam String roomType,
            @RequestParam Double pricePerNight,
            @RequestParam String description,
            @RequestParam Integer capacity,
            @RequestParam String amenities,
            @RequestParam String availability,
            @RequestParam(required = false) List<MultipartFile> images,
            @RequestParam(required = false) MultipartFile media360
    ) throws IOException {
        Room saved = roomService.addRoom(
                roomName, roomType, pricePerNight, description,
                capacity, amenities, availability, images, media360
        );
        return ResponseEntity.ok(saved);
    }

    // PUT update room → http://localhost:8081/api/admin/rooms/1
    @PutMapping("/{id}")
    public ResponseEntity<Room> updateRoom(
            @PathVariable Long id,
            @RequestParam(required = false) String roomName,
            @RequestParam(required = false) String roomType,
            @RequestParam(required = false) Double pricePerNight,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Integer capacity,
            @RequestParam(required = false) String amenities,
            @RequestParam(required = false) String availability,
            @RequestParam(required = false) List<MultipartFile> images,
            @RequestParam(required = false) MultipartFile media360
    ) throws IOException {
        Room updated = roomService.updateRoom(
                id, roomName, roomType, pricePerNight, description,
                capacity, amenities, availability, images, media360
        );
        return ResponseEntity.ok(updated);
    }

    // DELETE room → http://localhost:8081/api/admin/rooms/1
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRoom(@PathVariable Long id) {
        roomService.deleteRoom(id);
        return ResponseEntity.ok("Room deleted successfully");
    }
}