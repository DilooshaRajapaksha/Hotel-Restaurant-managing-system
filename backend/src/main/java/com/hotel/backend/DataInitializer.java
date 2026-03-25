package com.hotel.backend;

import com.hotel.backend.Entity.RoomType;
import com.hotel.backend.Repo.RoomTypeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoomTypeRepo roomTypeRepo;

    @Override
    public void run(String... args) {

        if (roomTypeRepo.count() > 0) {
            System.out.println("✅ ROOM_TYPES already has data — skipping initialization.");
            return;
        }

        System.out.println("🏨 ROOM_TYPES table is empty — inserting default room types...");

        List<RoomType> defaultTypes = List.of(
                makeType("Two-Bedroom Villa",
                        "Bedroom with extra-large double bed, Living area",
                        4),
                makeType("Budget Twin Room",
                        "Comfortable room for two guests with double bed",
                        2),
                makeType("Double Room with Balcony",
                        "Double Bed Room size 28m², features air conditioning",
                        2),
                makeType("Triple Room with Balcony",
                        "Double Bed Room size 31m², equipped with air conditioning",
                        3),
                makeType("Double Room with Private Bathroom",
                        "Double Bed Room size 25m², features air conditioning",
                        2),
                makeType("Triple Room with Bathroom",
                        "Triple Room size 31m², features air conditioning",
                        3),
                makeType("Family Room",
                        "Large room designed for families with multiple beds",
                        4)
        );

        roomTypeRepo.saveAll(defaultTypes);

        System.out.println("✅ " + defaultTypes.size() + " room types inserted successfully!");
    }

    private RoomType makeType(String name, String description, int capacity) {
        RoomType rt = new RoomType();
        rt.setRoomTypeName(name);
        rt.setRoomDescription(description);
        rt.setCapacity(capacity);
        return rt;
    }
}
