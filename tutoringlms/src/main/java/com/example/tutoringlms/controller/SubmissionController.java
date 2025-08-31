//
//package com.example.tutoringlms.controller;
//
//import com.example.tutoringlms.dto.AssignmentDTO;
//import com.example.tutoringlms.dto.EssayAssignmentDTO;
//import com.example.tutoringlms.dto.MultipleChoiceAssignmentDTO;
//import com.example.tutoringlms.enums.AssignmentType;
//import com.example.tutoringlms.mapper.EssayAssignmentMapper;
//import com.example.tutoringlms.mapper.MultipleChoiceAssignmentMapper;
//import com.example.tutoringlms.model.*;
//import com.example.tutoringlms.service.EssayAssignService;
//import com.example.tutoringlms.service.EssaySubmissionService;
//import com.example.tutoringlms.service.MultipleChoiceSubmissionService;
//import com.example.tutoringlms.service.StudentService;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.util.List;
//import java.util.Map;
//import java.util.Optional;
//import java.util.stream.Collectors;
//
//@RestController
//@RequestMapping("/api/submission")
//@RequiredArgsConstructor
//public class SubmissionController {
//
//    private final EssayAssignService essayAssignService;
//    private final EssaySubmissionService essaySubmissionService;
//    private final MultipleChoiceSubmissionService multipleChoiceSubmissionService;
//    private final StudentService studentService;
//    private final EssayAssignmentMapper essayAssignmentMapper;
//
//    /** Lấy tất cả assignment theo class */
//    @GetMapping("/class/{classId}")
//    public ResponseEntity<List<AssignmentDTO>> getAssignmentsByClassId(@PathVariable Long classId) {
//        List<Assignment> assignments = essayAssignService.getAssignmentsByClassId(classId);
//
//        List<AssignmentDTO> dtos = assignments.stream().map(a -> {
//            AssignmentDTO dto = new AssignmentDTO();
//            dto.setId(a.getId());
//            dto.setTitle(a.getTitle());
//            dto.setDescription(a.getDescription());
//            dto.setCreatedAt(a.getCreatedAt());
//            dto.setDeadline(a.getDeadline());
//            if (a.getClassRoom() != null) dto.setClassName(a.getClassRoom().getClassName());
//            dto.setFileUrl(a instanceof EssayAssignment ? ((EssayAssignment) a).getFileUrl() : null);
//            dto.setType(a instanceof MultipleChoiceAssignment ? AssignmentType.MULTIPLE_CHOICE : AssignmentType.ESSAY);
//            return dto;
//        }).toList();
//
//        return ResponseEntity.ok(dtos);
//    }
//
//    /** Nộp bài tự luận */
//    @PostMapping(value = "/essay", consumes = "multipart/form-data")
//    public ResponseEntity<EssaySubmission> submitEssay(
//            @RequestParam Long assignmentId,
//            @RequestParam(required = false) String content,
//            @RequestPart(value = "file", required = false) MultipartFile file,
//            @AuthenticationPrincipal UserDetails userDetails
//    ) throws IOException {
//
//        Student student = studentService.getStudentEntityByUsername(userDetails.getUsername());
//
//        String fileUrl = null;
//        if (file != null && !file.isEmpty()) {
//            fileUrl = essayAssignService.uploadFile(file);
//        }
//
//        EssaySubmission savedSubmission = essaySubmissionService.submitEssay(
//                assignmentId,
//                student.getId(),
//                content,
//                fileUrl
//        );
//
//        return ResponseEntity.ok(savedSubmission);
//    }
//
//    @PostMapping("/multiple-choice")
//    public ResponseEntity<MultipleChoiceSubmission> submitMultipleChoice(
//            @RequestParam Long assignmentId,
//            @AuthenticationPrincipal UserDetails userDetails,
//            @RequestBody Map<String, Long> answers
//    ) {
//        Student student = studentService.getStudentEntityByUsername(userDetails.getUsername());
//
//        // Chuyển key từ String sang Long
//        Map<Long, Long> answerMap = answers.entrySet().stream()
//                .collect(Collectors.toMap(
//                        e -> Long.parseLong(e.getKey()),
//                        Map.Entry::getValue
//                ));
//
//        MultipleChoiceSubmission savedSubmission = multipleChoiceSubmissionService.submitOrUpdateMultipleChoice(
//                assignmentId,
//                student.getId(),
//                answerMap
//        );
//
//        return ResponseEntity.ok(savedSubmission);
//    }
//    /** Lấy thông tin bài tập tự luận để làm bài */
//    @GetMapping("/doEssay/{assignmentId}")
//    public ResponseEntity<AssignmentDTO> getEssayAssignmentById(@PathVariable Long assignmentId) {
//        Optional<Assignment> optionalAssignment = essayAssignService.getAssignmentById(assignmentId);
//        if (optionalAssignment.isEmpty()) return ResponseEntity.notFound().build();
//
//        Assignment assignment = optionalAssignment.get();
//        AssignmentDTO dto = new AssignmentDTO();
//        dto.setId(assignment.getId());
//        dto.setTitle(assignment.getTitle());
//        dto.setDescription(assignment.getDescription());
//        dto.setCreatedAt(assignment.getCreatedAt());
//        dto.setDeadline(assignment.getDeadline());
//        if (assignment.getClassRoom() != null) dto.setClassName(assignment.getClassRoom().getClassName());
//
//        if (assignment instanceof EssayAssignment) {
//            dto.setFileUrl(((EssayAssignment) assignment).getFileUrl());
//            dto.setType(AssignmentType.ESSAY);
//        } else if (assignment instanceof MultipleChoiceAssignment) {
//            dto.setType(AssignmentType.MULTIPLE_CHOICE);
//        }
//
//        return ResponseEntity.ok(dto);
//    }
//
//    /** Lấy bài làm của học sinh tự luận */
//    @GetMapping("/myessay/{assignmentId}")
//    public ResponseEntity<EssayAssignmentDTO> getMyEssaySubmission(
//            @PathVariable Long assignmentId,
//            @AuthenticationPrincipal UserDetails userDetails) {
//
//        Student student = studentService.getStudentEntityByUsername(userDetails.getUsername());
//
//        EssayAssignment assignment = essayAssignService.getAssignmentById(assignmentId)
//                .filter(a -> a instanceof EssayAssignment)
//                .map(a -> (EssayAssignment) a)
//                .orElse(null);
//
//        if (assignment == null) return ResponseEntity.notFound().build();
//
//        EssaySubmission submission = essaySubmissionService
//                .findByAssignmentIdAndStudentId(assignmentId, student.getId())
//                .orElse(null);
//
//        return ResponseEntity.ok(essayAssignmentMapper.toDTO(assignment, submission));
//    }
//
//    /** Lấy thông tin bài tập trắc nghiệm để làm bài (có kiểm tra hạn và trạng thái) */
//    @GetMapping("/doMC/{assignmentId}")
//    public ResponseEntity<Map<String, Object>> getMultipleChoiceAssignmentById(
//            @PathVariable Long assignmentId,
//            @AuthenticationPrincipal UserDetails userDetails) {
//
//        Optional<Assignment> optionalAssignment = essayAssignService.getAssignmentById(assignmentId);
//
//        if (optionalAssignment.isEmpty() || !(optionalAssignment.get() instanceof MultipleChoiceAssignment)) {
//            return ResponseEntity.notFound().build();
//        }
//
//        MultipleChoiceAssignment assignment = (MultipleChoiceAssignment) optionalAssignment.get();
//        Student student = studentService.getStudentEntityByUsername(userDetails.getUsername());
//
//        // Check xem đã nộp chưa
//        Optional<MultipleChoiceSubmission> mySubmissionOpt =
//                multipleChoiceSubmissionService.getSubmissionByAssignmentAndStudent(assignmentId, student.getId());
//
//        Map<String, Object> response = new java.util.HashMap<>();
//
//        // Nếu đã nộp bài → trả status SUBMITTED + điểm
//        if (mySubmissionOpt.isPresent()) {
//            MultipleChoiceSubmission mySubmission = mySubmissionOpt.get();
//            response.put("status", "SUBMITTED");
//            response.put("score", mySubmission.getScore());
//            response.put("submittedAt", mySubmission.getSubmittedAt());
//            return ResponseEntity.ok(response);
//        }
//
//        // Nếu chưa nộp nhưng quá hạn → EXPIRED
//        if (assignment.getDeadline() != null && java.time.LocalDateTime.now().isAfter(assignment.getDeadline())) {
//            response.put("status", "EXPIRED");
//            response.put("deadline", assignment.getDeadline());
//            return ResponseEntity.ok(response);
//        }
//
//        // Nếu còn hạn → AVAILABLE + trả đề
//        response.put("status", "AVAILABLE");
//        response.put("deadline", assignment.getDeadline());
//        response.put("questions", MultipleChoiceAssignmentMapper.toDTO(assignment).getQuestions());
//        return ResponseEntity.ok(response);
//    }
//    /** Lấy bài làm trắc nghiệm của học sinh (nếu đã nộp) */
//    @GetMapping("/mymc/{assignmentId}")
//    public ResponseEntity<MultipleChoiceSubmission> getMyMCSubmission(
//            @PathVariable Long assignmentId,
//            @AuthenticationPrincipal UserDetails userDetails) {
//
//        Student student = studentService.getStudentEntityByUsername(userDetails.getUsername());
//
//        return multipleChoiceSubmissionService.getSubmissionByAssignmentAndStudent(assignmentId, student.getId())
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.ok().body(null));
//    }
//}

package com.example.tutoringlms.controller;

import com.example.tutoringlms.dto.AssignmentDTO;
import com.example.tutoringlms.dto.EssayAssignmentDTO;
import com.example.tutoringlms.model.MultipleChoiceSubmission;
import com.example.tutoringlms.model.EssaySubmission;
import com.example.tutoringlms.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/submission")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    /** Lấy tất cả assignment theo class */
    @GetMapping("/class/{classId}")
    public ResponseEntity<List<AssignmentDTO>> getAssignmentsByClassId(@PathVariable Long classId) {
        return ResponseEntity.ok(submissionService.getAssignmentsByClassId(classId));
    }

    /** Nộp bài tự luận */
    @PostMapping(value = "/essay", consumes = "multipart/form-data")
    public ResponseEntity<EssaySubmission> submitEssay(
            @RequestParam Long assignmentId,
            @RequestParam(required = false) String content,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails
    ) throws IOException {
        return ResponseEntity.ok(
                submissionService.submitEssay(assignmentId, userDetails.getUsername(), content, file)
        );
    }

    /** Nộp bài trắc nghiệm */
    @PostMapping("/multiple-choice")
    public ResponseEntity<MultipleChoiceSubmission> submitMultipleChoice(
            @RequestParam Long assignmentId,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Long> answers
    ) {
        return ResponseEntity.ok(
                submissionService.submitMultipleChoice(assignmentId, userDetails.getUsername(), answers)
        );
    }

    /** Lấy thông tin bài tập tự luận để làm bài */
    @GetMapping("/doEssay/{assignmentId}")
    public ResponseEntity<AssignmentDTO> getEssayAssignmentById(@PathVariable Long assignmentId) {
        AssignmentDTO dto = submissionService.getEssayAssignmentById(assignmentId);
        if (dto == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(dto);
    }

    /** Lấy bài làm của học sinh tự luận */
    @GetMapping("/myessay/{assignmentId}")
    public ResponseEntity<EssayAssignmentDTO> getMyEssaySubmission(
            @PathVariable Long assignmentId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        EssayAssignmentDTO dto = submissionService.getMyEssaySubmission(assignmentId, userDetails.getUsername());
        if (dto == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(dto);
    }

    /** Lấy thông tin bài tập trắc nghiệm để làm bài */
    @GetMapping("/doMC/{assignmentId}")
    public ResponseEntity<Map<String, Object>> getMultipleChoiceAssignmentById(
            @PathVariable Long assignmentId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Map<String, Object> response = submissionService.getMultipleChoiceAssignmentById(assignmentId, userDetails.getUsername());
        if (response == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(response);
    }

    /** Lấy bài làm trắc nghiệm của học sinh (nếu đã nộp) */
    @GetMapping("/mymc/{assignmentId}")
    public ResponseEntity<MultipleChoiceSubmission> getMyMCSubmission(
            @PathVariable Long assignmentId,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return submissionService.getMyMCSubmission(assignmentId, userDetails.getUsername())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok().body(null));
    }
}
