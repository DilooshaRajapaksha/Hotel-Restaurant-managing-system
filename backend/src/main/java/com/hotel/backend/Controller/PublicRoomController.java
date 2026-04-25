package com.hotel.backend.Controller;

import com.hotel.backend.Entity.HotelImage;
import com.hotel.backend.Entity.Room;
import com.hotel.backend.Service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/rooms")
@CrossOrigin(origins = "http://localhost:5173")
public class PublicRoomController {

    @Autowired
    private RoomService roomService;

    @GetMapping
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getRoomById(@PathVariable Long id) {
        return roomService.getRoomById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/images")
    public ResponseEntity<List<HotelImage>> getRoomImages(@PathVariable Long id) {
        return ResponseEntity.ok(roomService.getImagesByRoomId(id));
    }
}