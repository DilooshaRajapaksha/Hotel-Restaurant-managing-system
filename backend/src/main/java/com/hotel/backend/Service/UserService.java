package com.hotel.backend.Service;

import com.hotel.backend.Entity.User;
import com.hotel.backend.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(String firstName, String lastName, String email, String password, String phoneNumber, String role) {
        if (userRepo.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        if (!role.equals("CUSTOMER") && !role.equals("ADMIN") && !role.equals("DELIVERY_STAFF")) {
            throw new RuntimeException("Invalid role");
        }

        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setPhoneNumber(phoneNumber);
        user.setRole(role);
        return userRepo.save(user);
    }

    // Backward compatibility for customer
    public User registerUser(String firstName, String lastName, String email, String password, String phoneNumber) {
        return registerUser(firstName, lastName, email, password, phoneNumber, "CUSTOMER");
    }

    public User loginUser(String email, String password) {
        Optional<User> optionalUser = userRepo.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (passwordEncoder.matches(password, user.getPasswordHash())) {
                user.setPasswordHash(null);
                return user;
            }
        }
        throw new RuntimeException("Invalid email or password");
    }

    public boolean existsByEmail(String email) {
        return userRepo.findByEmail(email).isPresent();
    }

    public void changePassword(String email, String newPassword) {
        Optional<User> optionalUser = userRepo.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            user.setPasswordHash(passwordEncoder.encode(newPassword));
            userRepo.save(user);
        } else {
            throw new RuntimeException("User not found");
        }
    }

    public User findOrCreateSocialUser(String email, String firstName, String lastName) {
        Optional<User> optionalUser = userRepo.findByEmail(email);
        if (optionalUser.isPresent()) {
            return optionalUser.get();
        }
        User user = new User();
        user.setFirstName(firstName != null ? firstName : "Social");
        user.setLastName(lastName != null ? lastName : "User");
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode("social"));
        user.setPhoneNumber("0000000000");
        user.setRole("CUSTOMER");
        return userRepo.save(user);
    }
    public User getUserByEmail(String email) {
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateProfile(Long userId, String firstName, String lastName,
                              String email, String phoneNumber, String userImage) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Optional: check if email changed and already exists
        if (!user.getEmail().equals(email) && userRepo.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPhoneNumber(phoneNumber);

        if (userImage != null && !userImage.isEmpty()) {
            user.setUserImage(userImage);   // save base64
        }

        return userRepo.save(user);
    }

}