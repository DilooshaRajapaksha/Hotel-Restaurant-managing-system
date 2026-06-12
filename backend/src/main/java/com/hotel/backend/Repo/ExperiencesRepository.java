package com.hotel.backend.Repo;

import com.hotel.backend.Entity.Experiences;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExperiencesRepository extends JpaRepository<Experiences, Long> {

}
