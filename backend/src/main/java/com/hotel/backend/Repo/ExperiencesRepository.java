package com.hotel.backend.Repo;

import com.hotel.backend.Entity.Experiences;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExperiencesRepository extends JpaRepository<Experiences, Long> {

        @Query(value = "SELECT * FROM EXPERIENCES WHERE is_active = 1 ORDER BY created_at DESC",
            nativeQuery = true)
    List<Experiences> findByIsActiveTrueOrderByCreatedAtDesc();
}