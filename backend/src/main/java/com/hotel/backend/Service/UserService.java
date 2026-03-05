package com.hotel.backend.Service;

import com.hotel.backend.Entity.User;
import com.hotel.backend.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;

    public User registerUser(String firstName, String lastName, String email, String password, String phoneNumber) {
        if (userRepo.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        User user = new User();
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPasswardHash(password);
        user.setPhoneNumber(phoneNumber);
        return userRepo.save(user);
    }

    public User loginUser(String email, String password) {
        Optional<User> optionalUser = userRepo.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getPasswardHash().equals(password)) {
                user.setPasswardHash(null);
                return user;
            }
        }
        throw new RuntimeException("Invalid email or password");
    }
}