package com.hotel.backend.Repo;

import com.hotel.backend.Entity.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoomTypeRepo extends JpaRepository<RoomType, Long> {
	Optional<RoomType> findFirstByRoomTypeName(String roomTypeName);
}