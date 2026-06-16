package com.hotel.backend.Config;

import com.hotel.backend.Security.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        // Preflight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // Auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/public/**").permitAll()

                        // Static uploads — always public so images load on customer pages
                        .requestMatchers("/uploads/**").permitAll()

                        // WebSocket
                        .requestMatchers("/ws/**").permitAll()

                        // Experiences GET — public (Home page uses it without token)
                        .requestMatchers(HttpMethod.GET, "/api/experiences").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/experiences/**").permitAll()

                        // Public room + menu browsing
                        .requestMatchers(HttpMethod.GET, "/api/rooms/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/menu/**").permitAll()

                        // Image upload — admin only
                        .requestMatchers(HttpMethod.POST, "/api/upload/**").hasRole("ADMIN")

                        // Customer routes
                        .requestMatchers("/api/customer/**").hasRole("CUSTOMER")

                        // Admin routes
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/delivery/**").hasAnyRole("ADMIN", "DELIVERY_STAFF")

                        // Experiences write — admin only
                        .requestMatchers(HttpMethod.POST,   "/api/experiences/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,    "/api/experiences/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/experiences/**").hasRole("ADMIN")

                        .anyRequest().authenticated()
                )
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // ✅ FIXED: Added Vercel + any custom domain alongside localhost
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:*",          // local dev
                "https://*.vercel.app",        // Vercel preview & production URLs
                "https://goldenstays.vercel.app" // your specific Vercel domain
        ));

        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}