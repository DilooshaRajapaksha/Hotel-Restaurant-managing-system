package com.hotel.backend.Controller;

import com.hotel.backend.Entity.Experiences;
import com.hotel.backend.Service.ExperienceServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/experiences")
@CrossOrigin(origins = "*")
public class ExperiencesController {

    @Autowired
    private ExperienceServices experiencesService;

    @GetMapping
    public ResponseEntity<List<Experiences>> getAllExperiences() {
        return ResponseEntity.ok(experiencesService.getAllExperiences());
    }

    @PostMapping
    public ResponseEntity<Experiences> createExperience(@RequestBody Experiences experience) {
        Experiences saved = experiencesService.createExperience(experience);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Experiences> updateExperience(@PathVariable Long id, @RequestBody Experiences experience) {
        Experiences updated = experiencesService.updateExperience(id, experience);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExperience(@PathVariable Long id) {
        experiencesService.deleteExperience(id);
        return ResponseEntity.noContent().build();
    }
}