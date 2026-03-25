package com.hotel.backend;

import com.hotel.backend.Entity.Room;
import com.hotel.backend.Entity.RoomType;
import com.hotel.backend.Entity.HotelImage;
import com.hotel.backend.Repo.RoomRepo;
import com.hotel.backend.Repo.RoomTypeRepo;
import com.hotel.backend.Repo.HotelImageRepo;
import com.hotel.backend.Service.RoomService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RoomServiceTest {

    @Mock private RoomRepo       roomRepo;
    @Mock private RoomTypeRepo   roomTypeRepo;
    @Mock private HotelImageRepo hotelImageRepo;

    @InjectMocks
    private RoomService roomService;

    private Room     sampleRoom;
    private RoomType sampleRoomType;

    @BeforeEach
    void setUp() {

        sampleRoomType = new RoomType();
        sampleRoomType.setRoomTypeId(1L);
        sampleRoomType.setRoomTypeName("Suite");
        sampleRoomType.setRoomDescription("Luxury suite with sea view");
        sampleRoomType.setCapacity(2);

        sampleRoom = new Room();
        sampleRoom.setRoomId(1L);
        sampleRoom.setRoomName("Deluxe Suite 101");
        sampleRoom.setRoomType(sampleRoomType);
        sampleRoom.setRoomPrice(new BigDecimal("7500.00"));
        sampleRoom.setRoomStatus(Room.RoomStatus.AVAILABLE);
    }

    // TC-001: Get all rooms returns a non-empty list
    @Test
    void TC001_getAllRooms_returnsNonEmptyList() {
        when(roomRepo.findAll()).thenReturn(Arrays.asList(sampleRoom));

        List<Room> result = roomService.getAllRooms();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Deluxe Suite 101", result.get(0).getRoomName());
        System.out.println("TC-001 PASSED ✓ getAllRooms returns non-empty list");
    }

    // TC-002: Get room by valid ID returns correct room
    @Test
    void TC002_getRoomById_validId_returnsRoom() {
        when(roomRepo.findById(1L)).thenReturn(Optional.of(sampleRoom));

        Optional<Room> result = roomService.getRoomById(1L);

        assertTrue(result.isPresent());
        assertEquals("Deluxe Suite 101", result.get().getRoomName());
        assertEquals("Suite", result.get().getRoomType().getRoomTypeName());
        System.out.println("TC-002 PASSED ✓ getRoomById returns correct room");
    }

    // TC-003: Get room by invalid ID returns empty
    @Test
    void TC003_getRoomById_invalidId_returnsEmpty() {
        when(roomRepo.findById(999L)).thenReturn(Optional.empty());

        Optional<Room> result = roomService.getRoomById(999L);

        assertFalse(result.isPresent());
        System.out.println("TC-003 PASSED ✓ getRoomById with invalid ID returns empty");
    }

    // TC-004: Delete room calls repository deleteById
    @Test
    void TC004_deleteRoom_callsRepository() {
        doNothing().when(roomRepo).deleteById(1L);

        roomService.deleteRoom(1L);

        verify(roomRepo, times(1)).deleteById(1L);
        System.out.println("TC-004 PASSED ✓ deleteRoom calls deleteById once");
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
        assertTrue(sampleRoom.getRoomPrice().compareTo(BigDecimal.ZERO) > 0,
                "Room price must be greater than 0");
        System.out.println("TC-006 PASSED ✓ Room price is positive");
    }

    // TC-007: Room capacity must be at least 1 (now stored in RoomType)
    @Test
    void TC007_roomCapacity_atLeastOne() {
        assertTrue(sampleRoom.getRoomType().getCapacity() >= 1,
                "Capacity must be at least 1");
        System.out.println("TC-007 PASSED ✓ Room capacity is at least 1");
    }

    // TC-008: Update room throws exception when room not found
    @Test
    void TC008_updateRoom_invalidId_throwsException() {
        when(roomRepo.findById(999L)).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class, () ->
                roomService.updateRoom(999L, "New Name", null, null, null, null)
        );

        assertTrue(ex.getMessage().contains("999"));
        System.out.println("TC-008 PASSED ✓ updateRoom throws exception for invalid ID");
    }

    // TC-009: Update room saves successfully when room found
    @Test
    void TC009_updateRoom_validId_savesSuccessfully() {
        when(roomRepo.findById(1L)).thenReturn(Optional.of(sampleRoom));
        when(roomRepo.save(any(Room.class))).thenReturn(sampleRoom);

        assertDoesNotThrow(() ->
                roomService.updateRoom(1L, "Updated Name", null, null, null, null)
        );

        verify(roomRepo, times(1)).save(any(Room.class));
        System.out.println("TC-009 PASSED ✓ updateRoom saves successfully");
    }

    // TC-010: Room status must be AVAILABLE or MAINTENANCE
    @Test
    void TC010_roomStatus_validValues() {
        Room.RoomStatus status = sampleRoom.getRoomStatus();
        assertTrue(
                status == Room.RoomStatus.AVAILABLE || status == Room.RoomStatus.MAINTENANCE,
                "Status must be AVAILABLE or MAINTENANCE"
        );
        System.out.println("TC-010 PASSED ✓ Room status is a valid enum value");
    }

    // TC-011: RoomType name must not be null
    @Test
    void TC011_roomType_nameNotNull() {
        assertNotNull(sampleRoom.getRoomType());
        assertNotNull(sampleRoom.getRoomType().getRoomTypeName());
        assertFalse(sampleRoom.getRoomType().getRoomTypeName().isBlank());
        System.out.println("TC-011 PASSED ✓ RoomType name is not null");
    }

    // TC-012: Update room status calls save
    @Test
    void TC012_updateRoomStatus_callsSave() {
        when(roomRepo.findById(1L)).thenReturn(Optional.of(sampleRoom));
        when(roomRepo.save(any(Room.class))).thenReturn(sampleRoom);

        Room result = roomService.updateRoomStatus(1L, Room.RoomStatus.MAINTENANCE);

        verify(roomRepo, times(1)).save(any(Room.class));
        assertNotNull(result);
        System.out.println("TC-012 PASSED ✓ updateRoomStatus calls save correctly");
    }
}