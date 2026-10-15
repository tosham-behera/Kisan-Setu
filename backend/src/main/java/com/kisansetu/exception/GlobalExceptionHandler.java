package com.kisansetu.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

/**
 * Translates service-layer business-rule violations into clean HTTP responses.
 *
 * InvalidBookingException (thrown by ColdStorageBookingService)  ->  400 Bad Request
 * with a JSON body like { "error": "Quantity must be greater than zero." }
 *
 * Only the message we explicitly throw is returned — no stack traces or
 * technical details are exposed to the client.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidBookingException.class)
    public ResponseEntity<Map<String, String>> handleInvalidBooking(InvalidBookingException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", ex.getMessage()));
    }
}
