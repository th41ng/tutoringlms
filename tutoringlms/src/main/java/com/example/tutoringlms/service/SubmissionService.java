package com.example.tutoringlms.service;


import com.example.tutoringlms.dto.AssignmentDTO;
import com.example.tutoringlms.dto.EssayAssignmentDTO;
import com.example.tutoringlms.dto.MultipleChoiceAssignmentDTO;
import com.example.tutoringlms.enums.AssignmentType;
import com.example.tutoringlms.mapper.EssayAssignmentMapper;
import com.example.tutoringlms.mapper.MultipleChoiceAssignmentMapper;
import com.example.tutoringlms.model.*;
import com.example.tutoringlms.service.EssayAssignService;
import com.example.tutoringlms.service.EssaySubmissionService;
import com.example.tutoringlms.service.MultipleChoiceSubmissionService;
import com.example.tutoringlms.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubmissionService {

    private final EssayAssignService essayAssignService;
    private final EssaySubmissionService essaySubmissionService;
    private final MultipleChoiceSubmissionService multipleChoiceSubmissionService;
    private final StudentService studentService;
    private final EssayAssignmentMapper essayAssignmentMapper;

    /** Lấy tất cả assignment theo class */
    public List<AssignmentDTO> getAssignmentsByClassId(Long classId) {
        List<Assignment> assignments = essayAssignService.getAssignmentsByClassId(classId);

        return assignments.stream().map(a -> {
            AssignmentDTO dto = new AssignmentDTO();
            dto.setId(a.getId());
            dto.setTitle(a.getTitle());
            dto.setDescription(a.getDescription());
            dto.setCreatedAt(a.getCreatedAt());
            dto.setDeadline(a.getDeadline());
            if (a.getClassRoom() != null) dto.setClassName(a.getClassRoom().getClassName());
            dto.setFileUrl(a instanceof EssayAssignment ? ((EssayAssignment) a).getFileUrl() : null);
            dto.setType(a instanceof MultipleChoiceAssignment ? AssignmentType.MULTIPLE_CHOICE : AssignmentType.ESSAY);
            return dto;
        }).toList();
    }

    /** Nộp bài tự luận */
    public EssaySubmission submitEssay(Long assignmentId, String username, String content, MultipartFile file) throws IOException {
        Student student = studentService.getStudentEntityByUsername(username);

        String fileUrl = null;
        if (file != null && !file.isEmpty()) {
            fileUrl = essayAssignService.uploadFile(file);
        }

        return essaySubmissionService.submitEssay(
                assignmentId,
                student.getId(),
                content,
                fileUrl
        );
    }

    /** Nộp bài trắc nghiệm */
    public MultipleChoiceSubmission submitMultipleChoice(Long assignmentId, String username, Map<String, Long> answers) {
        Student student = studentService.getStudentEntityByUsername(username);

        // Chuyển key từ String sang Long
        Map<Long, Long> answerMap = answers.entrySet().stream()
                .collect(Collectors.toMap(
                        e -> Long.parseLong(e.getKey()),
                        Map.Entry::getValue
                ));

        return multipleChoiceSubmissionService.submitOrUpdateMultipleChoice(
                assignmentId,
                student.getId(),
                answerMap
        );
    }

    /** Lấy thông tin bài tập tự luận để làm bài */
    public AssignmentDTO getEssayAssignmentById(Long assignmentId) {
        Optional<Assignment> optionalAssignment = essayAssignService.getAssignmentById(assignmentId);
        if (optionalAssignment.isEmpty()) return null;

        Assignment assignment = optionalAssignment.get();
        AssignmentDTO dto = new AssignmentDTO();
        dto.setId(assignment.getId());
        dto.setTitle(assignment.getTitle());
        dto.setDescription(assignment.getDescription());
        dto.setCreatedAt(assignment.getCreatedAt());
        dto.setDeadline(assignment.getDeadline());
        if (assignment.getClassRoom() != null) dto.setClassName(assignment.getClassRoom().getClassName());

        if (assignment instanceof EssayAssignment) {
            dto.setFileUrl(((EssayAssignment) assignment).getFileUrl());
            dto.setType(AssignmentType.ESSAY);
        } else if (assignment instanceof MultipleChoiceAssignment) {
            dto.setType(AssignmentType.MULTIPLE_CHOICE);
        }
        return dto;
    }

    /** Lấy bài làm của học sinh tự luận */
    public EssayAssignmentDTO getMyEssaySubmission(Long assignmentId, String username) {
        Student student = studentService.getStudentEntityByUsername(username);

        EssayAssignment assignment = essayAssignService.getAssignmentById(assignmentId)
                .filter(a -> a instanceof EssayAssignment)
                .map(a -> (EssayAssignment) a)
                .orElse(null);

        if (assignment == null) return null;

        EssaySubmission submission = essaySubmissionService
                .findByAssignmentIdAndStudentId(assignmentId, student.getId())
                .orElse(null);

        return essayAssignmentMapper.toDTO(assignment, submission);
    }

    /** Lấy thông tin bài tập trắc nghiệm để làm bài */
    public Map<String, Object> getMultipleChoiceAssignmentById(Long assignmentId, String username) {
        Optional<Assignment> optionalAssignment = essayAssignService.getAssignmentById(assignmentId);
        if (optionalAssignment.isEmpty() || !(optionalAssignment.get() instanceof MultipleChoiceAssignment)) {
            return null;
        }

        MultipleChoiceAssignment assignment = (MultipleChoiceAssignment) optionalAssignment.get();
        Student student = studentService.getStudentEntityByUsername(username);

        Optional<MultipleChoiceSubmission> mySubmissionOpt =
                multipleChoiceSubmissionService.getSubmissionByAssignmentAndStudent(assignmentId, student.getId());

        Map<String, Object> response = new HashMap<>();

        if (mySubmissionOpt.isPresent()) {
            MultipleChoiceSubmission mySubmission = mySubmissionOpt.get();
            response.put("status", "SUBMITTED");
            response.put("score", mySubmission.getScore());
            response.put("submittedAt", mySubmission.getSubmittedAt());
            return response;
        }

        if (assignment.getDeadline() != null && LocalDateTime.now().isAfter(assignment.getDeadline())) {
            response.put("status", "EXPIRED");
            response.put("deadline", assignment.getDeadline());
            return response;
        }

        response.put("status", "AVAILABLE");
        response.put("deadline", assignment.getDeadline());
        response.put("questions", MultipleChoiceAssignmentMapper.toDTO(assignment).getQuestions());
        return response;
    }

    /** Lấy bài làm trắc nghiệm của học sinh */
    public Optional<MultipleChoiceSubmission> getMyMCSubmission(Long assignmentId, String username) {
        Student student = studentService.getStudentEntityByUsername(username);
        return multipleChoiceSubmissionService.getSubmissionByAssignmentAndStudent(assignmentId, student.getId());
    }
}
