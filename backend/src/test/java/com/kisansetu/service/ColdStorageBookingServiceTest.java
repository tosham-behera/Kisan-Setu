package com.kisansetu.service;

import com.kisansetu.entity.ColdStorageBooking;
import com.kisansetu.exception.InvalidBookingException;
import com.kisansetu.repository.ColdStorageBookingRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Automated unit tests (JUnit 5 + Mockito) for the two business rules
 * implemented in {@link ColdStorageBookingService}.
 *
 * The repository is mocked, so no MySQL database is required.
 */
@ExtendWith(MockitoExtension.class)
class ColdStorageBookingServiceTest {

    @Mock
    private ColdStorageBookingRepository repository;

    @InjectMocks
    private ColdStorageBookingService service;

    @Captor
    private ArgumentCaptor<ColdStorageBooking> bookingCaptor;

    /** Builds a booking with valid values; callers override what they test. */
    private ColdStorageBooking validBooking() {
        ColdStorageBooking booking = new ColdStorageBooking();
        booking.setProduceType("Paddy");
        booking.setQuantity(100.0);
        booking.setUnit("quintal");
        booking.setDurationDays(15);
        booking.setStartDate(LocalDate.now().plusDays(1));
        booking.setDistrict("Trichy");
        booking.setFarmerName("Test Farmer");
        booking.setMobile("9876543210");
        return booking;
    }

    // ----- Test 1: valid quantity + valid date -----

    @Test
    void test1_validQuantityAndValidDate_bookingIsAcceptedAndSaved() {
        ColdStorageBooking booking = validBooking();
        when(repository.save(any(ColdStorageBooking.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        ColdStorageBooking result = service.createBooking(booking);

        // Repository save operation IS called.
        verify(repository, times(1)).save(bookingCaptor.capture());

        // Booking receives the expected initial status and timestamp.
        assertEquals("PENDING", bookingCaptor.getValue().getStatus());
        assertNotNull(bookingCaptor.getValue().getCreatedAt());
        assertEquals("PENDING", result.getStatus());
        assertEquals(100.0, result.getQuantity());
    }

    // ----- Test 2: invalid quantity -----

    @Test
    void test2_invalidQuantity_throwsAndNeverSaves() {
        ColdStorageBooking booking = validBooking();
        booking.setQuantity(-10.0);

        InvalidBookingException exception = assertThrows(
                InvalidBookingException.class,
                () -> service.createBooking(booking));

        assertTrue(exception.getMessage().toLowerCase().contains("quantity"));
        // Repository save operation is NEVER called.
        verify(repository, never()).save(any(ColdStorageBooking.class));
    }

    // ----- Test 3: past booking date -----

    @Test
    void test3_pastBookingDate_throwsAndNeverSaves() {
        ColdStorageBooking booking = validBooking();
        booking.setStartDate(LocalDate.now().minusDays(1));

        InvalidBookingException exception = assertThrows(
                InvalidBookingException.class,
                () -> service.createBooking(booking));

        assertTrue(exception.getMessage().toLowerCase().contains("date"));
        // Repository save operation is NEVER called.
        verify(repository, never()).save(any(ColdStorageBooking.class));
    }

    // ----- Test 4: missing required values (null quantity / null start date) -----

    @Test
    void test4_missingRequiredValues_rejectedAndNothingPersisted() {
        // Case A: null quantity
        ColdStorageBooking bookingWithNullQuantity = validBooking();
        bookingWithNullQuantity.setQuantity(null);
        InvalidBookingException quantityException = assertThrows(
                InvalidBookingException.class,
                () -> service.createBooking(bookingWithNullQuantity));
        assertTrue(quantityException.getMessage().toLowerCase().contains("quantity"));

        // Case B: null start date
        ColdStorageBooking bookingWithNullDate = validBooking();
        bookingWithNullDate.setStartDate(null);
        InvalidBookingException dateException = assertThrows(
                InvalidBookingException.class,
                () -> service.createBooking(bookingWithNullDate));
        assertTrue(dateException.getMessage().toLowerCase().contains("date"));

        // Nothing was persisted for either invalid booking.
        verify(repository, never()).save(any(ColdStorageBooking.class));
    }
}
