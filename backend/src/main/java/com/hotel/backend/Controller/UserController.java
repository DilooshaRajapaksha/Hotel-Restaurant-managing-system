package com.hotel.backend.Controller;

import com.hotel.backend.Entity.DeliveryStaff;
import com.hotel.backend.Entity.User;
import com.hotel.backend.JwtResponse;
import com.hotel.backend.Repo.DeliveryStaffRepo;
import com.hotel.backend.Security.JwtUtil;
import com.hotel.backend.Service.EmailService;
import com.hotel.backend.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired private UserService        userService;
    @Autowired private JwtUtil            jwtUtil;
    @Autowired private EmailService       emailService;
    @Autowired private DeliveryStaffRepo  deliveryStaffRepo;
    @Autowired private PasswordEncoder    passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> registerCustomer(@RequestBody Map<String, String> body) {
        return register(body, "CUSTOMER");
    }

    @PostMapping("/register-admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> registerAdmin(@RequestBody Map<String, String> body) {
        return register(body, "ADMIN");
    }

    @PostMapping("/register-delivery")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> registerDelivery(@RequestBody Map<String, String> body) {
        return register(body, "DELIVERY_STAFF");
    }

    @PostMapping("/bootstrap-admin")
    public ResponseEntity<?> bootstrapAdmin(@RequestBody Map<String, String> body) {
        return register(body, "ADMIN");
    }

    private ResponseEntity<?> register(Map<String, String> body, String role) {
        try {
            String firstName   = body.get("firstName");
            String lastName    = body.get("lastName");
            String email       = body.get("email");
            String password    = body.get("password");
            String phoneNumber = body.get("phoneNumber");

            if (firstName == null || lastName == null || email == null || password == null || phoneNumber == null) {
                return ResponseEntity.badRequest().body("All fields are required");
            }

            User savedUser = userService.registerUser(firstName, lastName, email, password, phoneNumber, role);
            savedUser.setPasswordHash(null);
            return ResponseEntity.ok(savedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    /**
     * Unified login endpoint for CUSTOMER, ADMIN, and DELIVERY_STAFF.
     *
     * FIX: Previously only checked the USER table, so delivery staff (stored in
     * DELIVERY_STAFF table) always got "Invalid email or password".  Now we fall
     * back to the DELIVERY_STAFF table and return a response shaped identically
     * to a normal JwtResponse so the frontend mapUserFromAuth() works unchanged.
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email    = body.get("email");
        String password = body.get("password");
        if (email == null || password == null) {
            return ResponseEntity.badRequest().body("Email and password required");
        }

        // ── 1. Try regular USER table ──────────────────────────────────────
        try {
            User user  = userService.loginUser(email, password);
            String token = jwtUtil.generateToken(email, user.getRole());
            return ResponseEntity.ok(new JwtResponse(token, user));
        } catch (RuntimeException ignored) {
            // Not found in USER table — fall through to delivery staff check
        }

        // ── 2. Try DELIVERY_STAFF table ────────────────────────────────────
        Optional<DeliveryStaff> staffOpt = deliveryStaffRepo.findByEmail(email);
        if (staffOpt.isPresent()) {
            DeliveryStaff staff = staffOpt.get();
            if (passwordEncoder.matches(password, staff.getPasswordHash())) {
                String role  = staff.getRole() != null ? staff.getRole() : "DELIVERY_STAFF";
                String token = jwtUtil.generateToken(email, role);

                // Build a response shaped like JwtResponse so the frontend
                // mapUserFromAuth() can read .user.firstName, .user.email, etc.
                Map<String, Object> userMap = new HashMap<>();
                userMap.put("firstName",   staff.getSName());   // sName → firstName
                userMap.put("lastName",    "");
                userMap.put("email",       staff.getEmail());
                userMap.put("phoneNumber", staff.getContactNumber());
                userMap.put("role",        role);
                userMap.put("userImage",   null);
                userMap.put("picture",     null);

                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("user",  userMap);
                return ResponseEntity.ok(response);
            }
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password");
    }

    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) {
        try {
            String idToken = body.get("idToken");
            if (idToken == null) return ResponseEntity.badRequest().body("idToken required");

            RestTemplate restTemplate = new RestTemplate();
            String url = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;
            Map<String, Object> googleResponse = restTemplate.getForObject(url, Map.class);
            if (googleResponse == null || !"true".equals(googleResponse.get("email_verified"))) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Google token");
            }
            String email     = (String) googleResponse.get("email");
            String firstName = (String) googleResponse.get("given_name");
            String lastName  = (String) googleResponse.get("family_name");
            User user = userService.findOrCreateSocialUser(email, firstName, lastName);
            user.setPasswordHash(null);
            String token = jwtUtil.generateToken(email, user.getRole());
            return ResponseEntity.ok(new JwtResponse(token, user));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Google login failed");
        }
    }

    @PostMapping("/facebook-login")
    public ResponseEntity<?> facebookLogin(@RequestBody Map<String, String> body) {
        try {
            String accessToken = body.get("accessToken");
            if (accessToken == null) return ResponseEntity.badRequest().body("accessToken required");

            RestTemplate restTemplate = new RestTemplate();
            String url = "https://graph.facebook.com/me?access_token=" + accessToken + "&fields=email,first_name,last_name";
            Map<String, Object> fbResponse = restTemplate.getForObject(url, Map.class);
            if (fbResponse == null || fbResponse.get("email") == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid Facebook token or no email");
            }
            String email     = (String) fbResponse.get("email");
            String firstName = (String) fbResponse.get("first_name");
            String lastName  = (String) fbResponse.get("last_name");
            User user = userService.findOrCreateSocialUser(email, firstName, lastName);
            user.setPasswordHash(null);
            String token = jwtUtil.generateToken(email, user.getRole());
            return ResponseEntity.ok(new JwtResponse(token, user));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Facebook login failed");
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null) return ResponseEntity.badRequest().body("Email required");
        if (!userService.existsByEmail(email)) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");

        String resetToken = jwtUtil.generateResetToken(email);
        String resetLink  = "http://localhost:5173/reset-password?token=" + resetToken;
        emailService.sendResetPasswordEmail(email, resetLink);
        return ResponseEntity.ok("Reset link sent to your email");
    }

    @PostMapping("/update-password")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> body) {
        String oldPassword = body.get("oldPassword");
        String newPassword = body.get("newPassword");
        if (oldPassword == null || newPassword == null) {
            return ResponseEntity.badRequest().body("Old and new password required");
        }
        String currentEmail = Objects.requireNonNull(SecurityContextHolder.getContext().getAuthentication()).getName();
        try {
            userService.loginUser(currentEmail, oldPassword);
            userService.changePassword(currentEmail, newPassword);
            return ResponseEntity.ok("Password updated successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid old password");
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> body) {
        String token       = body.get("token");
        String newPassword = body.get("newPassword");
        if (token == null || newPassword == null) return ResponseEntity.badRequest().body("Token and new password required");

        String email = jwtUtil.extractEmailFromResetToken(token);
        if (email == null) return ResponseEntity.badRequest().body("Invalid or expired token");

        userService.changePassword(email, newPassword);
        return ResponseEntity.ok("Password reset successfully");
    }

    @PostMapping("/update-profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> body) {
        try {
            String currentEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            User currentUser = userService.getUserByEmail(currentEmail);

            String firstName   = (String) body.get("firstName");
            String lastName    = (String) body.get("lastName");
            String email       = (String) body.get("email");
            String phoneNumber = (String) body.get("phoneNumber");
            String userImage   = (String) body.get("userImage");

            if (firstName == null || lastName == null || email == null || phoneNumber == null) {
                return ResponseEntity.badRequest().body("Required fields missing");
            }

            User updated = userService.updateProfile(
                    currentUser.getUserId(), firstName, lastName, email, phoneNumber, userImage
            );
            updated.setPasswordHash(null);

            String newToken = jwtUtil.generateToken(updated.getEmail(), updated.getRole());
            return ResponseEntity.ok(new JwtResponse(newToken, updated));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
