package com.example.tutoringlms.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.tutoringlms.dto.EssayAssignmentDTO;
import com.example.tutoringlms.model.*;
import com.example.tutoringlms.repository.AssignmentRepository;
import com.example.tutoringlms.repository.ClassRoomRepository;
import com.example.tutoringlms.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class EssayAssignService {

    private final AssignmentRepository assignmentRepository;
    private final ClassRoomRepository classRoomRepository;
    private final TeacherRepository teacherRepository;
    private final TeacherService teacherService;
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

    public EssayAssignment createEssay(EssayAssignment essayAssignment) {
        return assignmentRepository.save(essayAssignment);
    }


    public EssayAssignment updateAssignment(Long id, EssayAssignmentDTO dto, MultipartFile file, String username) throws IOException {
        EssayAssignment existing = (EssayAssignment) assignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

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
}
