package com.kisansetu.repository;

import com.kisansetu.entity.ColdStorageBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for cold_storage_booking.
 *
 * We write NO SQL: JpaRepository gives us save(), findAll(), findById(), etc.
 * for free. Custom queries can be added later with method names or @Query.
 */
@Repository
public interface ColdStorageBookingRepository extends JpaRepository<ColdStorageBooking, Long> {
}
