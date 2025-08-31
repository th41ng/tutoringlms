package com.example.tutoringlms.service;

import com.example.tutoringlms.dto.AnswerDTO;
import com.example.tutoringlms.dto.MultipleChoiceAssignmentDTO;
import com.example.tutoringlms.dto.QuestionDTO;
import com.example.tutoringlms.exception.AssignmentNotFoundException;
import com.example.tutoringlms.mapper.MultipleChoiceAssignmentMapper;
import com.example.tutoringlms.model.*;
import com.example.tutoringlms.repository.AssignmentRepository;
import com.example.tutoringlms.repository.EssaySubmissionRepository;
import com.example.tutoringlms.repository.MultipleChoiceSubmissionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class MultipleChoiceService {

    private final AssignmentRepository assignmentRepository;
    private final MultipleChoiceSubmissionRepository multipleChoiceSubmissionRepository;
    private final TeacherService teacherService;
    private final ClassRoomService classRoomService;


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
        MultipleChoiceAssignment existing = findById(id)
                .orElseThrow(() -> new AssignmentNotFoundException(id));

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









    public MultipleChoiceAssignment createAssignment(MultipleChoiceAssignmentDTO dto, String username) {
        Teacher teacher = teacherService.getTeacherEntityByUsername(username);
        ClassRoom classRoom = classRoomService.getClassRoomById(dto.getClassRoomId());

        MultipleChoiceAssignment assignment = new MultipleChoiceAssignment();
        assignment.setTitle(dto.getTitle());
        assignment.setDescription(dto.getDescription());
        assignment.setDeadline(dto.getDeadline());
        assignment.setTeacher(teacher);
        assignment.setClassRoom(classRoom);

        List<Question> questions = new ArrayList<>();
        for (QuestionDTO qdto : dto.getQuestions()) {
            Question question = new Question();
            question.setQuestionText(qdto.getQuestionText());
            question.setMultipleChoiceAssignment(assignment);

            List<Answer> answers = new ArrayList<>();
            for (AnswerDTO adto : qdto.getAnswers()) {
                Answer answer = new Answer();
                answer.setAnswerText(adto.getAnswerText());
                answer.setIsCorrect(adto.getIsCorrect());
                answer.setQuestion(question);
                answers.add(answer);
            }

            question.setAnswers(answers);
            questions.add(question);
        }

        assignment.setQuestions(questions);
        return save(assignment);
    }

    public MultipleChoiceAssignmentDTO getAssignmentDTOById(Long id) {
        MultipleChoiceAssignment assignment = findById(id).orElseThrow();
        return MultipleChoiceAssignmentMapper.toDTO(assignment);
    }

    public List<Map<String, Object>> getSubmissionsDTO(Long assignmentId) {
        List<MultipleChoiceSubmission> submissions = findSubmissionsByAssignment(assignmentId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (MultipleChoiceSubmission sub : submissions) {
            Map<String, Object> map = new HashMap<>();
            map.put("studentId", sub.getStudent() != null ? sub.getStudent().getId() : null);
            map.put("studentName", sub.getStudent() != null ? sub.getStudent().getFirstName() + sub.getStudent().getLastName() : "Không xác định");
            map.put("submittedAt", sub.getSubmittedAt());
            map.put("isLate", sub.getIsLate());
            map.put("score", sub.getScore());
            result.add(map);
        }

        return result;
    }
}
