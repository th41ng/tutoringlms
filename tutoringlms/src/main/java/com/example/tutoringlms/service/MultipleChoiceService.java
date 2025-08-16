package com.example.tutoringlms.service;

import com.example.tutoringlms.model.*;
import com.example.tutoringlms.repository.AssignmentRepository;
import com.example.tutoringlms.repository.EssaySubmissionRepository;
import com.example.tutoringlms.repository.MultipleChoiceSubmissionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MultipleChoiceService {

    private final AssignmentRepository assignmentRepository;
    private final MultipleChoiceSubmissionRepository multipleChoiceSubmissionRepository;
    public MultipleChoiceAssignment save(MultipleChoiceAssignment assignment) {
        return assignmentRepository.save(assignment);
    }

    public List<Assignment> getAllMcAssignments() {
        return assignmentRepository.findAllMcAssignments();
    }

    public Optional<MultipleChoiceAssignment> findById(Long id) {
        return assignmentRepository.findById(id)
                .filter(a -> a instanceof MultipleChoiceAssignment)
                .map(a -> (MultipleChoiceAssignment) a);
    }

    @Transactional
    public MultipleChoiceAssignment update(Long id, MultipleChoiceAssignment updatedData) {
        MultipleChoiceAssignment existing = findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy bài tập"));

        existing.setTitle(updatedData.getTitle());
        existing.setDescription(updatedData.getDescription());
        existing.setDeadline(updatedData.getDeadline());

        // Xóa toàn bộ câu hỏi cũ và thay bằng mới
        existing.getQuestions().clear();
        for (Question q : updatedData.getQuestions()) {
            q.setMultipleChoiceAssignment(existing);
            for (Answer ans : q.getAnswers()) {
                ans.setQuestion(q);
            }
            existing.getQuestions().add(q);
        }

        return assignmentRepository.save(existing);
    }

    public void delete(Long id) {
        assignmentRepository.deleteById(id);
    }

    // MultipleChoiceService.java
    public List<MultipleChoiceSubmission> findSubmissionsByAssignment(Long assignmentId) {
        return multipleChoiceSubmissionRepository.findByAssignmentId(assignmentId);
    }
}
