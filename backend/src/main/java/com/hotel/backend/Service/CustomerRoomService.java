package com.hotel.backend.Service;

import com.hotel.backend.DTO.RoomResponse;
import com.hotel.backend.Entity.HotelImage;
import com.hotel.backend.Entity.Room;
import com.hotel.backend.Repo.HotelImageRepo;
import com.hotel.backend.Repo.RoomRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomerRoomService {

    private final RoomRepo roomRepository;
    private final HotelImageRepo hotelImageRepo;

    public CustomerRoomService(RoomRepo roomRepository, HotelImageRepo hotelImageRepo) {
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
        String imageUrl = hotelImageRepo.findByRoomId(r.getRoomId()).stream()
                .filter(HotelImage::getIsMain)
                .findFirst()
                .map(HotelImage::getRimageUrl)
                .orElse("/images/no-image.jpg");

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