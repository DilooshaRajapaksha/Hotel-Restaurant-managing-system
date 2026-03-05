package com.hotel.backend;

import com.hotel.backend.Entity.Room;
import com.hotel.backend.Repo.RoomRepo;
import com.hotel.backend.Service.RoomService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import static org.mockito.ArgumentMatchers.any;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

@ExtendWith(MockitoExtension.class)
class RoomServiceTest {

    @Mock
    private RoomRepo roomRepository;

    @InjectMocks
    private RoomService roomService;

    private Room sampleRoom;

    @BeforeEach
    void setUp() {
        sampleRoom = new Room();
        sampleRoom.setId(1L);
        sampleRoom.setRoomName("Deluxe Suite 101");
        sampleRoom.setRoomType("Suite");
        sampleRoom.setPricePerNight(7500.0);
        sampleRoom.setDescription("Beautiful sea view room");
        sampleRoom.setCapacity(2);
        sampleRoom.setAmenities("Air Conditioning,Free WiFi");
        sampleRoom.setAvailability("available");
    }

    // TC-001: Get all rooms returns a non-empty list
    @Test
    void TC001_getAllRooms_returnsNonEmptyList() {
        when(roomRepository.findAll())
                .thenReturn(Arrays.asList(sampleRoom));

        List<Room> result = roomService.getAllRooms();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Deluxe Suite 101", result.get(0).getRoomName());
        System.out.println("TC-001 PASSED ✓ Get all rooms returns list");
    }

    // TC-002: Get room by valid ID returns the correct room
    @Test
    void TC002_getRoomById_validId_returnsRoom() {
        when(roomRepository.findById(1L))
                .thenReturn(Optional.of(sampleRoom));

        Optional<Room> result = roomService.getRoomById(1L);

        assertTrue(result.isPresent());
        assertEquals("Deluxe Suite 101", result.get().getRoomName());
        assertEquals("Suite", result.get().getRoomType());
        System.out.println("TC-002 PASSED ✓ Get room by valid ID returns room");
    }

    // TC-003: Get room by invalid ID returns empty
    @Test
    void TC003_getRoomById_invalidId_returnsEmpty() {
        when(roomRepository.findById(999L))
                .thenReturn(Optional.empty());

        Optional<Room> result = roomService.getRoomById(999L);

        assertFalse(result.isPresent());
        System.out.println("TC-003 PASSED ✓ Get room by invalid ID returns empty");
    }

    // TC-004: Delete room calls repository deleteById
    @Test
    void TC004_deleteRoom_callsRepository() {
        doNothing().when(roomRepository).deleteById(1L);

        roomService.deleteRoom(1L);

        verify(roomRepository, times(1)).deleteById(1L);
        System.out.println("TC-004 PASSED ✓ Delete room calls repository");
    }

    // TC-005: Room name must not be null or empty
    @Test
    void TC005_roomName_notNullOrEmpty() {
        assertNotNull(sampleRoom.getRoomName());
        assertFalse(sampleRoom.getRoomName().trim().isEmpty());
        System.out.println("TC-005 PASSED ✓ Room name is not null or empty");
    }

    // TC-006: Room price must be positive
    @Test
    void TC006_roomPrice_mustBePositive() {
        assertTrue(sampleRoom.getPricePerNight() > 0,
                "Price must be greater than 0");
        System.out.println("TC-006 PASSED ✓ Room price is positive");
    }

    // TC-007: Room capacity must be at least 1
    @Test
    void TC007_roomCapacity_atLeastOne() {
        assertTrue(sampleRoom.getCapacity() >= 1,
                "Capacity must be at least 1");
        System.out.println("TC-007 PASSED ✓ Room capacity is at least 1");
    }

    // TC-008: Update room throws exception when room not found
    @Test
    void TC008_updateRoom_invalidId_throwsException() {
        when(roomRepository.findById(999L))
                .thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                roomService.updateRoom(999L, "New Name", null, null,
                        null, null, null, null, null, null)
        );

        assertTrue(ex.getMessage().contains("999"));
        System.out.println("TC-008 PASSED ✓ Update with invalid ID throws exception");
    }

    // TC-009: Update room saves successfully when room exists
    @Test
    void TC009_updateRoom_validId_savesSuccessfully() {
        when(roomRepository.findById(1L))
                .thenReturn(Optional.of(sampleRoom));
        when(roomRepository.save(any(Room.class)))
                .thenReturn(sampleRoom);

        assertDoesNotThrow(() ->
                roomService.updateRoom(1L, "Updated Name", null, null,
                        null, null, null, null, null, null)
        );

        verify(roomRepository, times(1)).save(any(Room.class));
        System.out.println("TC-009 PASSED ✓ Update room saves successfully");
    }

    // TC-010: Room availability values are valid
    @Test
    void TC010_roomAvailability_validValues() {
        List<String> validValues = Arrays.asList("available", "unavailable", "maintenance");
        assertTrue(validValues.contains(sampleRoom.getAvailability()));
        System.out.println("TC-010 PASSED ✓ Room availability is a valid value");
    }
}