package com.kisansetu.controller;

import com.kisansetu.entity.ColdStorageBooking;
import com.kisansetu.service.ColdStorageBookingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for the Cold Storage Booking feature.
 *
 * POST /api/bookings      -> create a booking (returns 201 + the saved booking)
 * GET  /api/bookings      -> list all bookings (returns 200)
 * GET  /api/bookings/{id} -> one booking (200, or 404 if not found)
 */
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final ColdStorageBookingService service;

    public BookingController(ColdStorageBookingService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<ColdStorageBooking> createBooking(@RequestBody ColdStorageBooking booking) {
        ColdStorageBooking saved = service.createBooking(booking);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping
    public List<ColdStorageBooking> getAllBookings() {
        return service.getAllBookings();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ColdStorageBooking> getBookingById(@PathVariable Long id) {
        return service.getBookingById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
