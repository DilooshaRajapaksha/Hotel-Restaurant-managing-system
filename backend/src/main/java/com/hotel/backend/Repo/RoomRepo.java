package com.hotel.backend.Repo;

import com.hotel.backend.Entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepo extends JpaRepository<Room, Long> {

    List<Room> findByRoomStatus(Room.RoomStatus roomStatus);
}
