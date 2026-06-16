package com.hotel.backend.Service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class FileStorageService {

    private final Cloudinary cloudinary;

    // ✅ FIXED: Uses Cloudinary instead of local disk
    // No more images lost on Render restart
    public FileStorageService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String saveMenuImage(MultipartFile file) throws IOException {
        // Upload to Cloudinary under goldenstays/menu/ folder
        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "goldenstays/menu",
                        "resource_type", "image"
                )
        );

        // Returns a permanent HTTPS URL like:
        // https://res.cloudinary.com/your-cloud/image/upload/goldenstays/menu/abc123.jpg
        return (String) uploadResult.get("secure_url");
    }

    public void deleteByUrl(String imageUrl) {
        // Extract Cloudinary public_id from the URL and delete it
        // URL format: https://res.cloudinary.com/cloud/image/upload/v123/goldenstays/menu/filename.jpg
        // public_id  = goldenstays/menu/filename  (no extension)
        try {
            if (imageUrl == null || !imageUrl.contains("cloudinary.com")) return;

            // Get the part after /upload/
            String afterUpload = imageUrl.substring(imageUrl.indexOf("/upload/") + 8);

            // Remove version prefix if present (v1234567890/)
            if (afterUpload.matches("v\\d+/.*")) {
                afterUpload = afterUpload.substring(afterUpload.indexOf('/') + 1);
            }

            // Remove file extension
            String publicId = afterUpload.substring(0, afterUpload.lastIndexOf('.'));

            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (Exception ignored) {
            // If delete fails, not critical — Cloudinary has its own storage
        }
    }
}