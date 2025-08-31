package com.example.tutoringlms.service;//package com.example.tutoringlms.service;

import com.example.tutoringlms.model.EssayAssignment;
import com.example.tutoringlms.model.EssaySubmission;
import com.example.tutoringlms.model.Student;
import com.example.tutoringlms.repository.EssayAssignmentRepository;
import com.example.tutoringlms.repository.EssaySubmissionRepository;
import com.example.tutoringlms.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

//// EssaySubmissionService.java
//@Service
//@RequiredArgsConstructor
//public class EssaySubmissionService {
//    private final EssaySubmissionRepository essaySubmissionRepository;
//    private final EssayAssignmentRepository essayAssignmentRepository;
//    private final StudentRepository studentRepository;
//
//    public EssaySubmission submitEssay(Long assignmentId, Long studentId, String content, String fileUrl) {
//        EssayAssignment assignment = essayAssignmentRepository.findById(assignmentId)
//                .orElseThrow(() -> new RuntimeException("Essay assignment not found"));
//
//        Student student = studentRepository.findById(studentId)
//                .orElseThrow(() -> new RuntimeException("Student not found"));
//
//        LocalDateTime now = LocalDateTime.now();
//        boolean isLate = assignment.getDeadline() != null && now.isAfter(assignment.getDeadline());
//
//        EssaySubmission submission = new EssaySubmission();
//        submission.setAssignment(assignment);
//        submission.setStudent(student);
//        submission.setContent(content);
//        submission.setFileUrl(fileUrl);
//        submission.setSubmittedAt(now);
//        submission.setIsLate(isLate);
//
//        return essaySubmissionRepository.save(submission);
//    }
//
//    public Optional<EssaySubmission> findByAssignmentIdAndStudentId(Long assignmentId, Long studentId) {
//        return essaySubmissionRepository.findByAssignmentIdAndStudentId(assignmentId, studentId);
//    }
//
//}

@Service
@RequiredArgsConstructor
public class EssaySubmissionService {
    private final EssaySubmissionRepository essaySubmissionRepository;
    private final EssayAssignmentRepository essayAssignmentRepository;
    private final StudentRepository studentRepository;

    public EssaySubmission submitEssay(Long assignmentId, Long studentId, String content, String fileUrl) {
        EssayAssignment assignment = essayAssignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Essay assignment not found"));

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        LocalDateTime now = LocalDateTime.now();
        boolean isLate = assignment.getDeadline() != null && now.isAfter(assignment.getDeadline());

        // 🔹 Kiểm tra xem đã có bài nộp chưa
        Optional<EssaySubmission> existingOpt = essaySubmissionRepository.findByAssignmentIdAndStudentId(assignmentId, studentId);

        EssaySubmission submission;
        if (existingOpt.isPresent()) {
            // Nếu có → Update
            submission = existingOpt.get();
            submission.setContent(content);
            submission.setFileUrl(fileUrl);
            submission.setSubmittedAt(now);
            submission.setIsLate(isLate);
        } else {
            // Nếu chưa → Create
            submission = new EssaySubmission();
            submission.setAssignment(assignment);
            submission.setStudent(student);
            submission.setContent(content);
            submission.setFileUrl(fileUrl);
            submission.setSubmittedAt(now);
            submission.setIsLate(isLate);
        }

        return essaySubmissionRepository.save(submission);
    }

    public Optional<EssaySubmission> findByAssignmentIdAndStudentId(Long assignmentId, Long studentId) {
        return essaySubmissionRepository.findByAssignmentIdAndStudentId(assignmentId, studentId);
    }
}