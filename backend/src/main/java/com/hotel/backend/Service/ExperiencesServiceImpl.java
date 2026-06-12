package com.hotel.backend.Service;

import com.hotel.backend.Entity.Experiences;
import com.hotel.backend.Repo.ExperiencesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ExperiencesServiceImpl implements ExperienceServices {

    @Autowired
    private ExperiencesRepository experiencesRepository;

    @Override
    public List<Experiences> getAllExperiences() {
        // FIX: replaced the broken JPQL query (e.isActive = true caused
        // IllegalArgumentException in Hibernate 6) with findAll() + Java
        // stream filtering. This is version-agnostic and always reliable.
        return experiencesRepository.findAll().stream()
                .filter(e -> e.getIsActive() == null || Boolean.TRUE.equals(e.getIsActive()))
                .sorted(Comparator.comparing(
                        Experiences::getCreatedAt,
                        Comparator.nullsLast(Comparator.reverseOrder())
                ))
                .collect(Collectors.toList());
    }

    @Override
    public Experiences getExperienceById(Long id) {
        return experiencesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Experience not found with id: " + id));
    }

    @Override
    public Experiences createExperience(Experiences experience) {
        if (experience.getIsActive() == null) {
            experience.setIsActive(true);
        }
        return experiencesRepository.save(experience);
    }

    @Override
    public Experiences updateExperience(Long id, Experiences experience) {
        Experiences existing = experiencesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Experience not found with id: " + id));
        existing.setTitle(experience.getTitle());
        existing.setDescription(experience.getDescription());
        existing.setImageUrl(experience.getImageUrl());
        existing.setLocation(experience.getLocation());
        existing.setPrice(experience.getPrice());
        // preserve isActive — don't reset it on update
        return experiencesRepository.save(existing);
    }

    @Override
    public void deleteExperience(Long id) {
        Experiences existing = experiencesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Experience not found with id: " + id));
        existing.setIsActive(false);
        experiencesRepository.save(existing);
    }
}
