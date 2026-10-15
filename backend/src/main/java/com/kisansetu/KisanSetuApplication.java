package com.kisansetu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point of the Kisan Setu backend.
 *
 * @SpringBootApplication = @Configuration + @EnableAutoConfiguration + @ComponentScan
 * so Spring scans this package (and sub-packages) for Controllers, Services, Repositories.
 */
@SpringBootApplication
public class KisanSetuApplication {

    public static void main(String[] args) {
        SpringApplication.run(KisanSetuApplication.class, args);
    }
}
