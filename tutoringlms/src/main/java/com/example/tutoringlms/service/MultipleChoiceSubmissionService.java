//package com.example.tutoringlms.service;
//
//import com.example.tutoringlms.model.MultipleChoiceAssignment;
//import com.example.tutoringlms.model.MultipleChoiceSubmission;
//import com.example.tutoringlms.model.Question;
//import com.example.tutoringlms.model.Student;
//import com.example.tutoringlms.repository.MultipleChoiceAssignmentRepository;
//import com.example.tutoringlms.repository.MultipleChoiceSubmissionRepository;
//import com.example.tutoringlms.repository.StudentRepository;
//import com.nimbusds.jose.shaded.gson.Gson;
//import lombok.RequiredArgsConstructor;
//import org.springframework.stereotype.Service;
//
//import java.time.LocalDateTime;
//import java.util.Map;
//
//@Service
//@RequiredArgsConstructor
//public class MultipleChoiceSubmissionService {
//    private final MultipleChoiceSubmissionRepository mcSubmissionRepository;
//    private final MultipleChoiceAssignmentRepository mcAssignmentRepository;
//    private final StudentRepository studentRepository;
//
//    public MultipleChoiceSubmission submitMultipleChoice(Long assignmentId, Long studentId, Map<Long, Long> answers) {
//        MultipleChoiceAssignment assignment = mcAssignmentRepository.findById(assignmentId)
//                .orElseThrow(() -> new RuntimeException("Assignment not found"));
//        Student student = studentRepository.findById(studentId)
//                .orElseThrow(() -> new RuntimeException("Student not found"));
//
//        LocalDateTime now = LocalDateTime.now();
//        boolean isLate = assignment.getDeadline() != null && now.isAfter(assignment.getDeadline());
//
//        // Tính điểm
//        float score = 0;
//        int total = assignment.getQuestions().size();
//        for (Question q : assignment.getQuestions()) {
//            Long chosenAnswerId = answers.get(q.getId());
//            if (q.getAnswers().stream().anyMatch(a -> a.getId().equals(chosenAnswerId) && Boolean.TRUE.equals(a.getIsCorrect()))) {
//                score++;
//            }
//        }
//        score = (score / total) * 10; // điểm trên 10
//
//        MultipleChoiceSubmission submission = new MultipleChoiceSubmission();
//        submission.setAssignment(assignment);
//        submission.setStudent(student);
//        submission.setSubmittedAt(now);
//        submission.setIsLate(isLate);
//        submission.setScore(score);
//        submission.setSelectedAnswersJson(new Gson().toJson(answers));
//
//        return mcSubmissionRepository.save(submission);
//    }
//}
package com.example.tutoringlms.service;

import com.example.tutoringlms.model.MultipleChoiceAssignment;
import com.example.tutoringlms.model.MultipleChoiceSubmission;
import com.example.tutoringlms.model.Question;
import com.example.tutoringlms.model.Student;
import com.example.tutoringlms.repository.MultipleChoiceAssignmentRepository;
import com.example.tutoringlms.repository.MultipleChoiceSubmissionRepository;
import com.example.tutoringlms.repository.StudentRepository;
import com.nimbusds.jose.shaded.gson.Gson;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MultipleChoiceSubmissionService {

    private final MultipleChoiceSubmissionRepository mcSubmissionRepository;
    private final MultipleChoiceAssignmentRepository mcAssignmentRepository;
    private final StudentRepository studentRepository;

    /** Lấy bài làm đã nộp nếu có */
    public Optional<MultipleChoiceSubmission> getSubmissionByAssignmentAndStudent(Long assignmentId, Long studentId) {
        return mcSubmissionRepository.findByAssignmentIdAndStudentId(assignmentId, studentId);
    }

    public MultipleChoiceSubmission submitOrUpdateMultipleChoice(Long assignmentId, Long studentId, Map<Long, Long> answers) {
        MultipleChoiceAssignment assignment = mcAssignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        LocalDateTime now = LocalDateTime.now();
        boolean isLate = assignment.getDeadline() != null && now.isAfter(assignment.getDeadline());

        // Tính điểm
        float score = 0;
        int total = assignment.getQuestions().size();
        for (Question q : assignment.getQuestions()) {
            Long chosenAnswerId = answers.get(q.getId());
            if (chosenAnswerId != null && q.getAnswers().stream()
                    .anyMatch(a -> a.getId().equals(chosenAnswerId) && Boolean.TRUE.equals(a.getIsCorrect()))) {
                score++;
            }
        }
        score = total > 0 ? (score / total) * 10 : 0;

        // Kiểm tra bài làm trước đó
        MultipleChoiceSubmission submission = mcSubmissionRepository
                .findByAssignmentIdAndStudentId(assignmentId, studentId)
                .orElse(new MultipleChoiceSubmission());

        submission.setAssignment(assignment);
        submission.setStudent(student);
        submission.setSubmittedAt(now);
        submission.setIsLate(isLate);
        submission.setScore(score);
        submission.setSelectedAnswersJson(new Gson().toJson(answers));

        return mcSubmissionRepository.save(submission);
    }
}
