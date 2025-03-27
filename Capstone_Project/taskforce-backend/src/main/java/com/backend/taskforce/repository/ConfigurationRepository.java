package com.backend.taskforce.repository;

import com.backend.taskforce.model.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ConfigurationRepository extends JpaRepository<Configuration, Long> {
    @Query("SELECT c FROM Configuration c ORDER BY c.id ASC LIMIT 1")
    Optional<Configuration> findLatestConfiguration();

}

