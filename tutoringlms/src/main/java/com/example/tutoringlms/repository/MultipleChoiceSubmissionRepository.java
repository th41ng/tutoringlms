package com.example.tutoringlms.repository;

import com.example.tutoringlms.model.MultipleChoiceSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface MultipleChoiceSubmissionRepository extends JpaRepository<MultipleChoiceSubmission, Long> {

    // Tìm bài nộp theo assignmentId và studentId
    Optional<MultipleChoiceSubmission> findByAssignmentIdAndStudentId(Long assignmentId, Long studentId);

}
