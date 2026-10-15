package com.kisansetu.exception;

/**
 * Thrown by the Service layer when a booking breaks a business rule.
 *
 * The {@code GlobalExceptionHandler} turns this into HTTP 400 Bad Request
 * with a clear message — no stack traces are exposed to the client.
 */
public class InvalidBookingException extends RuntimeException {

    public InvalidBookingException(String message) {
        super(message);
    }
}
