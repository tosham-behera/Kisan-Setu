package com.kisansetu.controller;

import com.kisansetu.entity.ColdStorageBooking;
import com.kisansetu.exception.GlobalExceptionHandler;
import com.kisansetu.repository.ColdStorageBookingRepository;
import com.kisansetu.service.ColdStorageBookingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * HTTP-level tests for the booking REST endpoints, using Spring's MockMvc
 * (standalone setup) with the REAL service and a MOCKED repository —
 * so no MySQL database is required.
 *
 * Verifies:
 * - POST /api/bookings valid   -> 201 Created
 * - POST /api/bookings invalid -> 400 Bad Request (nothing saved)
 * - GET  /api/bookings         -> 200 OK (endpoint unchanged)
 */
class BookingControllerTest {

    private MockMvc mockMvc;
    private ColdStorageBookingRepository repository;

    @BeforeEach
    void setUp() {
        repository = mock(ColdStorageBookingRepository.class);
        ColdStorageBookingService service = new ColdStorageBookingService(repository);
        mockMvc = MockMvcBuilders
                .standaloneSetup(new BookingController(service))
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    private String validJson() {
        return """
                {
                  "produceType": "Paddy",
                  "quantity": 100,
                  "unit": "quintal",
                  "durationDays": 15,
                  "startDate": "%s",
                  "district": "Trichy",
                  "farmerName": "Test Farmer",
                  "mobile": "9876543210"
                }
                """.formatted(LocalDate.now().plusDays(1));
    }

    @Test
    void postValidBooking_returns201AndSaves() throws Exception {
        when(repository.save(any(ColdStorageBooking.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        mockMvc.perform(post("/api/bookings")
                        .contentType("application/json")
                        .content(validJson()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andExpect(jsonPath("$.quantity").value(100));

        verify(repository, times(1)).save(any(ColdStorageBooking.class));
    }

    @Test
    void postInvalidQuantity_returns400AndDoesNotSave() throws Exception {
        String invalidJson = validJson().replace("\"quantity\": 100", "\"quantity\": -10");

        mockMvc.perform(post("/api/bookings")
                        .contentType("application/json")
                        .content(invalidJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").exists());

        verify(repository, never()).save(any(ColdStorageBooking.class));
    }

    @Test
    void postPastStartDate_returns400AndDoesNotSave() throws Exception {
        String invalidJson = validJson().replace(
                LocalDate.now().plusDays(1).toString(),
                LocalDate.now().minusDays(1).toString());

        mockMvc.perform(post("/api/bookings")
                        .contentType("application/json")
                        .content(invalidJson))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").exists());

        verify(repository, never()).save(any(ColdStorageBooking.class));
    }

    @Test
    void getAllBookings_returns200AndEndpointIsUnchanged() throws Exception {
        when(repository.findAll()).thenReturn(List.of());

        mockMvc.perform(get("/api/bookings"))
                .andExpect(status().isOk());
    }
}
