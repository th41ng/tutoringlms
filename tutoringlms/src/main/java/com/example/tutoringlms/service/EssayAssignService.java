package com.example.tutoringlms.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.tutoringlms.dto.EssayAssignmentDTO;
import com.example.tutoringlms.exception.AssignmentNotFoundException;
import com.example.tutoringlms.exception.SubmissionNotFoundException;
import com.example.tutoringlms.model.*;
import com.example.tutoringlms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class EssayAssignService {

    private final AssignmentRepository assignmentRepository;
    private final ClassRoomRepository classRoomRepository;
    private final MultipleChoiceSubmissionRepository multipleChoiceSubmissionRepository;
    private final EssaySubmissionRepository  essaySubmissionRepository;
    private final Cloudinary cloudinary;

    public List<Assignment> getAllEsAssignments() {
        return assignmentRepository.findAllEssayAssignments();
    }

    public List<Assignment> getAssignmentsByClassId(Long classId) {
        return assignmentRepository.findAllByClassRoom_Id(classId);
    }

    public Optional<Assignment> getAssignmentById(Long id) {
        return assignmentRepository.findById(id);
    }
    @Transactional
    public EssayAssignment createEssay(EssayAssignment essayAssignment) {
        return assignmentRepository.save(essayAssignment);
    }

    @Transactional
    public EssayAssignment updateAssignment(Long id, EssayAssignmentDTO dto, MultipartFile file, String username) throws IOException {
        EssayAssignment existing = (EssayAssignment) assignmentRepository.findById(id)
                .orElseThrow(() -> new AssignmentNotFoundException(id));
        existing.setTitle(dto.getTitle());
        existing.setDescription(dto.getDescription());
        existing.setDeadline(dto.getDeadline());
        existing.setQuestion(dto.getQuestion());

        if (dto.getClassRoomId() != null) {
            ClassRoom classRoom = classRoomRepository.findById(dto.getClassRoomId())
                    .orElseThrow(() -> new RuntimeException("Lớp không tồn tại"));
            existing.setClassRoom(classRoom);
        }

        if (file != null && !file.isEmpty()) {
            String fileUrl = uploadFile(file);
            existing.setFileUrl(fileUrl);
        }

        return assignmentRepository.save(existing);
    }


    @Transactional
    public void deleteAssignment(Long id) {
        assignmentRepository.deleteById(id);
    }

    public String uploadFile(MultipartFile file) throws IOException {
        String originalFilename = Objects.requireNonNull(file.getOriginalFilename());
        String fileNameWithoutExtension = originalFilename.replaceAll("\\.[^.]+$", "");
        String resourceType = determineResourceType(originalFilename);

        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "resource_type", resourceType,
                "public_id", fileNameWithoutExtension
        ));

        return uploadResult.get("secure_url").toString();
    }

    private String determineResourceType(String filename) {
        String extension = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();

        return switch (extension) {
            case "pdf", "doc", "docx", "txt" -> "raw";
            case "jpg", "jpeg", "png", "gif" -> "image";
            case "mp4", "mp3" -> "video";
            default -> "auto";
        };
    }
    public List<EssaySubmission> findSubmissionsByAssignment(Long assignmentId) {
        return essaySubmissionRepository.findByAssignmentId(assignmentId);
    }


    @Transactional
    public void updateGrade(Long assignmentId, Long studentId, Double grade) {
        EssaySubmission submission = essaySubmissionRepository
                .findByAssignmentIdAndStudentId(assignmentId, studentId)
                .orElseThrow(() -> new SubmissionNotFoundException(assignmentId));

        submission.setGrade(grade);
        essaySubmissionRepository.save(submission);
    }







    public List<Map<String, Object>> getSubmissionsDTO(Long assignmentId) {
        List<EssaySubmission> submissions = findSubmissionsByAssignment(assignmentId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (EssaySubmission sub : submissions) {
            Map<String, Object> map = new HashMap<>();
            map.put("studentId", sub.getStudent() != null ? sub.getStudent().getId() : null);
            map.put("studentName", sub.getStudent() != null ? sub.getStudent().getFirstName()  + sub.getStudent().getLastName(): "Không xác định");
            map.put("submittedAt", sub.getSubmittedAt());
            map.put("isLate", sub.getIsLate());
            map.put("grade", sub.getGrade());
            map.put("fileUrl", sub.getFileUrl() != null ? sub.getFileUrl() : "");
            map.put("content", sub.getContent() != null ? sub.getContent() : "");
            result.add(map);
        }

        return result;
    }
    public Map<String, Object> gradeSubmission(Long assignmentId, Long studentId, Map<String, Object> payload, String username) {
        Double grade = Double.valueOf(payload.get("grade").toString());
        updateGrade(assignmentId, studentId, grade);
        return Map.of("message", "Cập nhật điểm thành công");
    }
}
