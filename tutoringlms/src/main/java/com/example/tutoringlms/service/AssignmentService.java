package com.example.tutoringlms.service;

import com.example.tutoringlms.dto.AssignmentDTO;
import com.example.tutoringlms.dto.EssayAssignmentDTO;
import com.example.tutoringlms.dto.MultipleChoiceAssignmentDTO;
import com.example.tutoringlms.enums.AssignmentType;
import com.example.tutoringlms.mapper.AssignmentMapper;
import com.example.tutoringlms.model.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final EssayAssignService essayAssignService;
    private final MultipleChoiceService multipleChoiceService;
    private final TeacherService teacherService;
    private final ClassRoomService classRoomService;

    /** Lấy tất cả assignment */
    public List<AssignmentDTO> getAllAssignments() {
        List<Assignment> essayAssignments = essayAssignService.getAllEsAssignments();
        List<Assignment> mcAssignments = multipleChoiceService.getAllMcAssignments();

        List<Assignment> allAssignments = new ArrayList<>();
        allAssignments.addAll(essayAssignments);
        allAssignments.addAll(mcAssignments);

        return allAssignments.stream()
                .map(AssignmentMapper::toDTO)
                .toList();
    }

    /** Tạo bài tập tự luận */
    public EssayAssignment createEssay(EssayAssignmentDTO dto, MultipartFile file, UserDetails userDetails) throws IOException {
        Teacher teacher = teacherService.getTeacherEntityByUsername(userDetails.getUsername());
        ClassRoom classRoom = classRoomService.getClassRoomById(dto.getClassRoomId());

        EssayAssignment assignment = new EssayAssignment();
        assignment.setTitle(dto.getTitle());
        assignment.setDescription(dto.getDescription());
        assignment.setQuestion(dto.getQuestion());
        assignment.setDeadline(dto.getDeadline());
        assignment.setCreatedAt(LocalDateTime.now());
        assignment.setTeacher(teacher);
        assignment.setClassRoom(classRoom);

        if (file != null && !file.isEmpty()) {
            String fileUrl = essayAssignService.uploadFile(file);
            assignment.setFileUrl(fileUrl);
        }

        return essayAssignService.createEssay(assignment);
    }

    /** Update bài tập tự luận */
    public EssayAssignment updateEssay(Long id, EssayAssignmentDTO dto, MultipartFile file, String username) throws IOException {
        return essayAssignService.updateAssignment(id, dto, file, username);
    }

    /** Xóa bài tập tự luận */
    public void deleteEssay(Long id) {
        essayAssignService.deleteAssignment(id);
    }

    /** Tạo bài tập trắc nghiệm */
    public MultipleChoiceAssignment createMultipleChoice(MultipleChoiceAssignmentDTO dto, UserDetails userDetails) {
        return multipleChoiceService.createAssignment(dto, userDetails.getUsername());
    }

    /** Cập nhật bài tập trắc nghiệm */
    public MultipleChoiceAssignment updateMultipleChoice(Long id, MultipleChoiceAssignment updatedData) {
        return multipleChoiceService.update(id, updatedData);
    }

    /** Xóa bài tập trắc nghiệm */
    public void deleteMultipleChoice(Long id) {
        multipleChoiceService.delete(id);
    }

    /** Lấy bài tập trắc nghiệm theo Id */
    public MultipleChoiceAssignmentDTO getMultipleChoiceById(Long id) {
        return multipleChoiceService.getAssignmentDTOById(id);
    }

    /** Lấy submission */
    public List<Map<String, Object>> getSubmissions(Long assignmentId, AssignmentType type) {
        if (type == AssignmentType.MULTIPLE_CHOICE) {
            return multipleChoiceService.getSubmissionsDTO(assignmentId);
        } else if (type == AssignmentType.ESSAY) {
            return essayAssignService.getSubmissionsDTO(assignmentId);
        }
        return Collections.emptyList();
    }

    /** Chấm điểm bài tự luận */
    public Map<String, Object> gradeEssaySubmission(Long assignmentId, Long studentId, Map<String, Object> payload, UserDetails userDetails) {
        return essayAssignService.gradeSubmission(assignmentId, studentId, payload, userDetails.getUsername());
    }
}
