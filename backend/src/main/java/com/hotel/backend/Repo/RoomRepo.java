package com.hotel.backend.Repo;

import com.hotel.backend.Entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomRepo extends JpaRepository<Room, Long> {
}
import java.util.List;

@Repository
public interface RoomRepo extends JpaRepository<Room, Long> {

    // Find rooms by type e.g. "Deluxe"
    List<Room> findByRoomType(String roomType);

    // Find rooms by availability
    List<Room> findByAvailability(String availability);
}
