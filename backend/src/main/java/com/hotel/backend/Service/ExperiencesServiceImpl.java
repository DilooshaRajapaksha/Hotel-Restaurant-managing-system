package com.hotel.backend.Service;

import com.hotel.backend.Entity.Experiences;
import com.hotel.backend.Repo.ExperiencesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ExperiencesServiceImpl implements ExperienceServices {

    @Autowired
    private ExperiencesRepository experiencesRepository;

    @Override
    public List<Experiences> getAllExperiences() {
        return experiencesRepository.findByIsActiveTrueOrderByCreatedAtDesc();
    }

    @Override
    public Experiences getExperienceById(Long id) {
        return experiencesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Experience not found"));
    }

    @Override
    public Experiences createExperience(Experiences experience) {
        return experiencesRepository.save(experience);
    }

    @Override
    public Experiences updateExperience(Long id, Experiences experience) {
        Experiences existing = experiencesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Experience not found"));
        existing.setTitle(experience.getTitle());
        existing.setDescription(experience.getDescription());
        existing.setImageUrl(experience.getImageUrl());
        existing.setLocation(experience.getLocation());
        existing.setPrice(experience.getPrice());
        return experiencesRepository.save(existing);
    }

    @Override
    public void deleteExperience(Long id) {
        Experiences existing = experiencesRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Experience not found"));
        existing.setIsActive(false);
        experiencesRepository.save(existing);
    }
}