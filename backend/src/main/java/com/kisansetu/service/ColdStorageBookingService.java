package com.kisansetu.service;

import com.kisansetu.entity.ColdStorageBooking;
import com.kisansetu.exception.InvalidBookingException;
import com.kisansetu.repository.ColdStorageBookingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Service layer: contains the business logic between Controller and Repository.
 * The controller never talks to the repository directly.
 */
@Service
public class ColdStorageBookingService {

    private final ColdStorageBookingRepository repository;

    public ColdStorageBookingService(ColdStorageBookingRepository repository) {
        this.repository = repository;
    }

    /**
     * Create a new booking: applies the business rules, sets defaults,
     * then saves it to MySQL.
     *
     * If a business rule is broken, an InvalidBookingException is thrown
     * BEFORE anything is saved, and the GlobalExceptionHandler returns
     * HTTP 400 with a clear message.
     */
    public ColdStorageBooking createBooking(ColdStorageBooking booking) {
        validateBooking(booking);

        if (booking.getStatus() == null || booking.getStatus().isBlank()) {
            booking.setStatus("PENDING");
        }
        booking.setCreatedAt(LocalDateTime.now());
        return repository.save(booking);
    }

    /**
     * Business rules for a cold storage booking (Requirement 6).
     *
     * Rule 1 - Quantity validation: quantity must be present and greater than zero.
     * Rule 2 - Booking date validation: start date must be present and cannot be
     *          earlier than today (today and future dates are allowed).
     *
     * Both rules live in the Service layer only — never in the Controller.
     */
    private void validateBooking(ColdStorageBooking booking) {
        // Rule 1: quantity must not be null and must be greater than zero.
        if (booking.getQuantity() == null) {
            throw new InvalidBookingException("Quantity is required.");
        }
        if (booking.getQuantity() <= 0) {
            throw new InvalidBookingException("Quantity must be greater than zero.");
        }
        if (booking.getStartDate() == null) {
            throw new InvalidBookingException("Start date is required.");
        }
        if (booking.getStartDate().isBefore(LocalDate.now())) {
            throw new InvalidBookingException("Start date cannot be in the past.");
        }
    }
    public List<ColdStorageBooking> getAllBookings() {
        return repository.findAll();
    }
    public Optional<ColdStorageBooking> getBookingById(Long id) {
        return repository.findById(id);
    }
}
