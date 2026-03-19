package com.hotel.backend.Repo;

import com.hotel.backend.Entity.HotelImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface HotelImageRepo extends JpaRepository<HotelImage, Long> {
    @Query("SELECT hi FROM HotelImage hi WHERE hi.roomId = :roomId AND hi.isMain = true")
    Optional<HotelImage> findMainImageByRoomId(Long roomId);
}