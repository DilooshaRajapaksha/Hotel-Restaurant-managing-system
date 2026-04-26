package com.hotel.backend.Repo;

import com.hotel.backend.Entity.Experiences;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExperiencesRepository extends JpaRepository<Experiences, Long> {

    @Query("SELECT e FROM Experiences e WHERE e.isActive = true OR e.isActive IS NULL ORDER BY e.createdAt DESC")
    List<Experiences> findByIsActiveTrueOrderByCreatedAtDesc();
}
