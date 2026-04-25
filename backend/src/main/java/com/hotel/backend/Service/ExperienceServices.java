package com.hotel.backend.Service;

import com.hotel.backend.Entity.Experiences;
import java.util.List;

public interface ExperienceServices {
    List<Experiences> getAllExperiences();
    Experiences getExperienceById(Long id);
    Experiences createExperience(Experiences experience);
    Experiences updateExperience(Long id, Experiences experience);
    void deleteExperience(Long id);
}