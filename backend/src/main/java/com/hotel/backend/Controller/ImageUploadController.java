package com.hotel.backend.Controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/upload")
public class ImageUploadController {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @PostMapping("/image")
    public ResponseEntity<?> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", defaultValue = "general") String folder) {

        // Validate: only accept image MIME types
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Only image files are allowed (jpg, png, webp, gif)."));
        }

        // Validate: max 10 MB (spring already enforces this but double-check)
        if (file.getSize() > 10 * 1024 * 1024) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "File size must be under 10 MB."));
        }

        try {
            // Build target directory:  uploads/experiences  or  uploads/rooms
            Path targetDir = Paths.get(uploadDir, folder).toAbsolutePath().normalize();
            Files.createDirectories(targetDir); // creates folder if it doesn't exist

            // Generate a unique filename so uploads never overwrite each other
            String originalName = file.getOriginalFilename();
            String extension = "";
            if (originalName != null && originalName.contains(".")) {
                extension = originalName.substring(originalName.lastIndexOf('.'));
            }
            String uniqueName = UUID.randomUUID().toString().replace("-", "") + extension;

            // Save the file
            Path targetPath = targetDir.resolve(uniqueName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // Return the public URL the frontend can use as imageUrl
            String publicUrl = "/uploads/" + folder + "/" + uniqueName;
            return ResponseEntity.ok(Map.of("url", publicUrl));

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to save file: " + e.getMessage()));
        }
    }
}
