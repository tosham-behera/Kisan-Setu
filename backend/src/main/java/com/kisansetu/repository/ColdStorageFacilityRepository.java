package com.kisansetu.repository;

import com.kisansetu.entity.ColdStorageFacility;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for cold_storage_facility.
 *
 * Like the booking repository, no SQL is written by hand:
 * JpaRepository provides save(), findAll(), findById(), etc. for free.
 */
@Repository
public interface ColdStorageFacilityRepository extends JpaRepository<ColdStorageFacility, Long> {
}
