package com.hotel.backend.Repo;

import com.hotel.backend.Entity.HotelImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelImageRepo extends JpaRepository<HotelImage, Long> {
    List<HotelImage> findByRoomId(Long roomId);
}