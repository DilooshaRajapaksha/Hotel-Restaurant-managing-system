package com.hotel.backend.Controller;

import com.hotel.backend.DTO.RoomResponse;
import com.hotel.backend.Service.CustomerRoomService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@CrossOrigin(origins = "http://localhost:5173")
public class PublicRoomController {   // ← Renamed for clarity

    private final CustomerRoomService customerRoomService;

    public PublicRoomController(CustomerRoomService customerRoomService) {
        this.customerRoomService = customerRoomService;
    }

    @GetMapping("/rooms")
    public List<RoomResponse> getAllRooms() {
        return customerRoomService.getAllRooms();
    }

    @GetMapping("/rooms/{id}")
    public ResponseEntity<RoomResponse> getRoomById(@PathVariable Long id) {
        RoomResponse room = customerRoomService.getRoomById(id);
        return room != null
                ? ResponseEntity.ok(room)
                : ResponseEntity.notFound().build();
    }
}