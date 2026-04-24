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
        Path menuDir = root.resolve("menu").normalize();
        Files.createDirectories(menuDir);

        String original = StringUtils.cleanPath(
                file.getOriginalFilename() == null ? "image" : file.getOriginalFilename()
        );

        String ext = "";
        int dot = original.lastIndexOf('.');
        if (dot >= 0) {
            ext = original.substring(dot);
        }

        String filename = UUID.randomUUID() + ext;
        Path target = menuDir.resolve(filename);

        Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);

        return "/uploads/menu/" + filename;
    }

    public void deleteByUrl(String urlPath) {
        try {
            Path relativePath = Paths.get(urlPath.replaceFirst("^/uploads/", ""));
            Path file = root.resolve(relativePath).normalize();
            Files.deleteIfExists(file);
        } catch (Exception ignored) {
        }
    }
}