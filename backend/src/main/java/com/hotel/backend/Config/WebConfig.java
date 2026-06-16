package com.hotel.backend.Config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // ✅ Reads upload dir from env variable (set in application.properties)
    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // ✅ FIXED: Added Vercel + any custom domain alongside localhost
                .allowedOriginPatterns(
                        "http://localhost:*",           // local dev
                        "https://*.vercel.app",         // Vercel preview & production URLs
                        "https://goldenstays.vercel.app" // your specific Vercel domain
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true);
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // ✅ FIXED: Uses the env-variable-driven uploadDir instead of hardcoded "uploads"
        // This works both locally and on Render (where UPLOAD_DIR env var is set)
        Path uploadRoot = Paths.get(uploadDir).toAbsolutePath().normalize();
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadRoot.toUri().toString());
    }
}