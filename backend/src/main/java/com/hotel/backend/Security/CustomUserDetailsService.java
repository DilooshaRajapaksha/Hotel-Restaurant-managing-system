package com.hotel.backend.Security;

import com.hotel.backend.Entity.DeliveryStaff;
import com.hotel.backend.Entity.User;
import com.hotel.backend.Repo.DeliveryStaffRepo;
import com.hotel.backend.Repo.UserRepo;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepo         userRepo;
    private final DeliveryStaffRepo deliveryStaffRepo;

    public CustomUserDetailsService(UserRepo userRepo, DeliveryStaffRepo deliveryStaffRepo) {
        this.userRepo          = userRepo;
        this.deliveryStaffRepo = deliveryStaffRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {

        // ── 1. Check regular USER table first ──────────────────────────────
        Optional<User> userOpt = userRepo.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            String role = user.getRole() != null ? user.getRole().toUpperCase() : "CUSTOMER";
            return new org.springframework.security.core.userdetails.User(
                    user.getEmail(),
                    user.getPasswordHash(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
            );
        }

        // ── 2. Fall back to DELIVERY_STAFF table ───────────────────────────
        // FIX: delivery staff are stored separately; without this lookup their
        //      JWT tokens are rejected on every request (UsernameNotFoundException
        //      was silently swallowed in JwtAuthenticationFilter, leaving the
        //      request unauthenticated and returning 403).
        Optional<DeliveryStaff> staffOpt = deliveryStaffRepo.findByEmail(email);
        if (staffOpt.isPresent()) {
            DeliveryStaff staff = staffOpt.get();
            String role = staff.getRole() != null ? staff.getRole().toUpperCase() : "DELIVERY_STAFF";
            return new org.springframework.security.core.userdetails.User(
                    staff.getEmail(),
                    staff.getPasswordHash(),
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role))
            );
        }

        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}
