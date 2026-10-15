package com.kisansetu.entity;

import jakarta.persistence.*;

/**
 * Second domain entity of Kisan Setu: a physical cold storage facility.
 *
 * Kisan Setu lets farmers request cold storage space; facilities are the
 * real places that store the produce. This entity is intentionally kept
 * minimal (id, name, district, capacity) — no relationships or allocation
 * logic in Phase 1.
 *
 * Hibernate creates/updates the "cold_storage_facility" table automatically
 * (spring.jpa.hibernate.ddl-auto=update).
 */
@Entity
@Table(name = "cold_storage_facility")
public class ColdStorageFacility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "district", nullable = false, length = 50)
    private String district;

    // Total storage capacity of the facility in kilograms.
    @Column(name = "capacity", nullable = false)
    private Double capacity;

    // ----- constructors -----

    public ColdStorageFacility() {
    }

    // ----- getters and setters -----

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDistrict() {
        return district;
    }

    public void setDistrict(String district) {
        this.district = district;
    }

    public Double getCapacity() {
        return capacity;
    }

    public void setCapacity(Double capacity) {
        this.capacity = capacity;
    }
}
