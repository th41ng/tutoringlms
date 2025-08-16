package com.example.tutoringlms.repository;

import com.example.tutoringlms.model.ClassSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ClassSessionRepository extends JpaRepository<ClassSession, Long> {

    @Query("""
        SELECT cs FROM ClassSession cs
        WHERE cs.date = :today
          AND :now BETWEEN cs.startTime AND cs.endTime
    """)
    List<ClassSession> findCurrentSessions(@Param("today") LocalDate today,
                                           @Param("now") LocalTime now);
}
