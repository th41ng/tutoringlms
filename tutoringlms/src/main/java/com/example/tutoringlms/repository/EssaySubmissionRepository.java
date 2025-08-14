package com.example.tutoringlms.repository;

import com.example.tutoringlms.model.EssaySubmission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EssaySubmissionRepository extends JpaRepository<EssaySubmission, Long> {
    Optional<EssaySubmission> findByAssignmentIdAndStudentId(Long assignmentId, Long studentId);

}
