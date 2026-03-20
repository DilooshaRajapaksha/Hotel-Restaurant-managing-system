package com.hotel.backend.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path root;

    public FileStorageService(@Value("${app.upload.dir}") String uploadDir) {
        this.root = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    public String saveMenuImage(MultipartFile file) throws IOException {
        Files.createDirectories(root);

        String original = StringUtils.cleanPath(file.getOriginalFilename() == null ? "image" : file.getOriginalFilename());
        String ext = "";

        int dot = original.lastIndexOf('.');
        if (dot >= 0) ext = original.substring(dot);

        String filename = UUID.randomUUID() + ext;
        Path target = root.resolve(filename);

        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        // This is the URL path React using:
        // http://localhost:8081/uploads/menu/<filename>
        return "/uploads/menu/" + filename;
    }

    public void deleteByUrl(String urlPath) {
        try {
            // urlPath like "/uploads/menu/abc.png"
            String filename = Paths.get(urlPath).getFileName().toString();
            Path file = root.resolve(filename).normalize();
            Files.deleteIfExists(file);
        } catch (Exception ignored) {}
    }
}
