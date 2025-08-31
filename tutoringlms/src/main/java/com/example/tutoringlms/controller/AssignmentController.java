//package com.example.tutoringlms.controller;
//
//import com.example.tutoringlms.dto.*;
//import com.example.tutoringlms.enums.AssignmentType;
//import com.example.tutoringlms.mapper.AssignmentMapper;
//import com.example.tutoringlms.model.*;
//import com.example.tutoringlms.service.ClassRoomService;
//import com.example.tutoringlms.service.EssayAssignService;
//import com.example.tutoringlms.service.MultipleChoiceService;
//import com.example.tutoringlms.service.TeacherService;
//import com.fasterxml.jackson.core.JsonProcessingException;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import lombok.RequiredArgsConstructor;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.security.Principal;
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/assignments")
//@RequiredArgsConstructor
//public class AssignmentController {
//    private final EssayAssignService essayAssignService;
//    private final ClassRoomService classRoomService;
//    private final TeacherService teacherService;
//    private final MultipleChoiceService multipleChoiceService;
////
//    @GetMapping("/all")
//    public ResponseEntity<List<AssignmentDTO>> getAllAssignments() {
//        List<Assignment> essayAssignments = essayAssignService.getAllEsAssignments();
//        List<Assignment> mcAssignments = multipleChoiceService.getAllMcAssignments();
//
//        List<Assignment> allAssignments = new ArrayList<>();
//        allAssignments.addAll(essayAssignments);
//        allAssignments.addAll(mcAssignments);
//
//        List<AssignmentDTO> dtos = allAssignments.stream()
//                .map(AssignmentMapper::toDTO)
//                .toList();
//
//        return ResponseEntity.ok(dtos);
//    }
//
//
//    @PostMapping(value = "/createEssay", consumes = "multipart/form-data")
//    public ResponseEntity<EssayAssignment> createEssay(
//            @RequestPart("data") EssayAssignmentDTO dto,
//            @RequestPart(value = "file", required = false) MultipartFile file,
//            @AuthenticationPrincipal UserDetails userDetails) throws IOException {
//
//        Teacher teacher = teacherService.getTeacherEntityByUsername(userDetails.getUsername());
//        ClassRoom classRoom = classRoomService.getClassRoomById(dto.getClassRoomId());
//
//        EssayAssignment assignment = new EssayAssignment();
//        assignment.setTitle(dto.getTitle());
//        assignment.setDescription(dto.getDescription());
//        assignment.setDeadline(dto.getDeadline());
//        assignment.setQuestion(dto.getQuestion());
//        assignment.setCreatedAt(LocalDateTime.now());
//        assignment.setTeacher(teacher);
//        assignment.setClassRoom(classRoom);
//
//        // Nếu có file, upload và gán URL
//        if (file != null && !file.isEmpty()) {
//            String fileUrl = essayAssignService.uploadFile(file);
//            assignment.setFileUrl(fileUrl);
//        }
//
//        return ResponseEntity.ok(essayAssignService.createEssay(assignment));
//    }
//    @PutMapping(value = "/update/{id}", consumes = "multipart/form-data")
//    public ResponseEntity<EssayAssignment> updateEssayWithFile(
//            @PathVariable Long id,
//            @RequestPart("data") EssayAssignmentDTO dto,
//            @RequestPart(value = "file", required = false) MultipartFile file,
//            @AuthenticationPrincipal UserDetails userDetails
//    ) throws IOException {
//
//        EssayAssignment updated = essayAssignService.updateAssignment(id, dto, file, userDetails.getUsername());
//        return ResponseEntity.ok(updated);
//    }
//    @DeleteMapping("/delete/{id}")
//    public ResponseEntity<Void> deleteEssay(@PathVariable Long id) {
//        essayAssignService.deleteAssignment(id);
//        return ResponseEntity.noContent().build(); // HTTP 204 No Content
//    }
//
//    //TN
//    @PostMapping("/create-multiple-choice")
//    public ResponseEntity<MultipleChoiceAssignment> createMultipleChoiceAssignment(
//            @RequestBody MultipleChoiceAssignmentDTO dto,
//            @AuthenticationPrincipal UserDetails userDetails
//    ) {
//        Teacher teacher = teacherService.getTeacherEntityByUsername(userDetails.getUsername());
//        ClassRoom classRoom = classRoomService.getClassRoomById(dto.getClassRoomId());
//
//        MultipleChoiceAssignment assignment = new MultipleChoiceAssignment();
//        assignment.setTitle(dto.getTitle());
//        assignment.setDescription(dto.getDescription());
//        assignment.setDeadline(dto.getDeadline());
//        assignment.setTeacher(teacher);
//        assignment.setClassRoom(classRoom);
//
//        // Tạo danh sách câu hỏi và câu trả lời
//        List<Question> questions = new ArrayList<>();
//        for (QuestionDTO qdto : dto.getQuestions()) {
//            Question question = new Question();
//            question.setQuestionText(qdto.getQuestionText());
//            question.setMultipleChoiceAssignment(assignment);
//
//            List<Answer> answers = new ArrayList<>();
//            for (AnswerDTO adto : qdto.getAnswers()) {
//                Answer answer = new Answer();
//                answer.setAnswerText(adto.getAnswerText());
//                answer.setIsCorrect(adto.getIsCorrect());
//                answer.setQuestion(question);
//                answers.add(answer);
//            }
//
//            question.setAnswers(answers);
//            questions.add(question);
//        }
//
//        assignment.setQuestions(questions);
//
//        return ResponseEntity.ok(multipleChoiceService.save(assignment));
//    }
//    @PutMapping("/multiple-choice/update/{id}")
//    public ResponseEntity<MultipleChoiceAssignment> updateMultipleChoiceAssignment(
//            @PathVariable Long id,
//            @RequestBody MultipleChoiceAssignment updatedData) {
//        MultipleChoiceAssignment updated = multipleChoiceService.update(id, updatedData);
//        return ResponseEntity.ok(updated);
//    }
//    @DeleteMapping("/multiple-choice/delete/{id}")
//    public ResponseEntity<Void> deleteMultipleChoiceAssignment(@PathVariable Long id) {
//        multipleChoiceService.delete(id);
//        return ResponseEntity.noContent().build();
//    }
//    @GetMapping("/multiple-choice/{id}")
//    public ResponseEntity<?> getMultipleChoiceAssignment(@PathVariable Long id) {
//        MultipleChoiceAssignment assignment = multipleChoiceService.findById(id).orElse(null);
//        if (assignment == null)
//            return ResponseEntity.notFound().build();
//
//        MultipleChoiceAssignmentDTO dto = new MultipleChoiceAssignmentDTO();
//        dto.setId(assignment.getId());
//        dto.setTitle(assignment.getTitle());
//        dto.setDescription(assignment.getDescription());
//        dto.setDeadline(assignment.getDeadline());
//
//        List<QuestionDTO> questionDTOs = assignment.getQuestions().stream().map(q -> {
//            List<AnswerDTO> answerDTOs = q.getAnswers().stream().map(a -> {
//                AnswerDTO answerDTO = new AnswerDTO();
//                answerDTO.setAnswerText(a.getAnswerText());
//                answerDTO.setIsCorrect(a.getIsCorrect());
//                return answerDTO;
//            }).toList();
//
//            QuestionDTO questionDTO = new QuestionDTO();
//            questionDTO.setQuestionText(q.getQuestionText());
//            questionDTO.setAnswers(answerDTOs);
//            return questionDTO;
//        }).toList();
//
//        dto.setQuestions(questionDTOs);
//
//        return ResponseEntity.ok(dto);
//    }
//
//
//    @GetMapping("/{assignmentId}/submissions")
//    public ResponseEntity<?> getSubmissions(
//            @PathVariable Long assignmentId,
//            @RequestParam AssignmentType type
//    ) {
//        if (type == AssignmentType.MULTIPLE_CHOICE) {
//            List<MultipleChoiceSubmission> submissions =
//                    multipleChoiceService.findSubmissionsByAssignment(assignmentId);
//
//            var result = submissions.stream().map(sub -> {
//                Map<String, Object> map = new HashMap<>();
//                map.put("studentId", sub.getStudent() != null ? sub.getStudent().getId() : null);
//                map.put("studentName", sub.getStudent() != null ? sub.getStudent().getFirstName() : "Không xác định");
//                map.put("submittedAt", sub.getSubmittedAt());
//                map.put("isLate", sub.getIsLate());
//                map.put("score", sub.getScore() != null ? sub.getScore() : null); // null nếu chưa chấm
//                return map;
//            }).toList();
//
//            return ResponseEntity.ok(result);
//
//        } else if (type == AssignmentType.ESSAY) {
//            List<EssaySubmission> submissions =
//                    essayAssignService.findSubmissionsByAssignment(assignmentId);
//
//            var result = submissions.stream().map(sub -> {
//                Map<String, Object> map = new HashMap<>();
//                map.put("studentId", sub.getStudent() != null ? sub.getStudent().getId() : null);
//                map.put("studentName", sub.getStudent() != null ? sub.getStudent().getFirstName() : "Không xác định");
//                map.put("submittedAt", sub.getSubmittedAt());
//                map.put("isLate", sub.getIsLate());
//                map.put("grade", sub.getGrade() != null ? sub.getGrade() : null); // null nếu chưa chấm
//                map.put("fileUrl", sub.getFileUrl() != null ? sub.getFileUrl() : "");
//                map.put("content", sub.getContent() != null ? sub.getContent() : "");
//                return map;
//            }).toList();
//
//            return ResponseEntity.ok(result);
//        }
//
//        return ResponseEntity.badRequest().body("Invalid assignment type");
//    }
//    @PostMapping("/{assignmentId}/submissions/{studentId}/grade")
//    public ResponseEntity<?> gradeEssaySubmission(
//            @PathVariable Long assignmentId,
//            @PathVariable Long studentId,
//            @RequestBody Map<String, Object> payload,
//            @AuthenticationPrincipal UserDetails userDetails
//    ) {
//        try {
//            // Chỉ giáo viên mới được phép chấm điểm
//            Teacher teacher = teacherService.getTeacherEntityByUsername(userDetails.getUsername());
//            if (teacher == null) {
//                return ResponseEntity.status(403).body(Map.of("message", "Không có quyền chấm điểm"));
//            }
//
//            // Lấy grade từ request
//            Double grade = Double.valueOf(payload.get("grade").toString());
//
//            // Gọi service để cập nhật điểm
//            essayAssignService.updateGrade(assignmentId, studentId, grade);
//
//            return ResponseEntity.ok(Map.of("message", "Cập nhật điểm thành công"));
//        } catch (Exception e) {
//            return ResponseEntity.status(500)
//                    .body(Map.of("message", "Lỗi khi cập nhật điểm", "error", e.getMessage()));
//        }
//    }
//}
package com.example.tutoringlms.controller;

import com.example.tutoringlms.dto.*;
import com.example.tutoringlms.enums.AssignmentType;
import com.example.tutoringlms.mapper.AssignmentMapper;
import com.example.tutoringlms.model.*;
import com.example.tutoringlms.service.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;

    @GetMapping("/all")
    public ResponseEntity<List<AssignmentDTO>> getAllAssignments() {
        return ResponseEntity.ok(assignmentService.getAllAssignments());
    }

    @PostMapping(value = "/createEssay", consumes = "multipart/form-data")
    public ResponseEntity<EssayAssignment> createEssay(
            @RequestPart("data") EssayAssignmentDTO dto,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        return ResponseEntity.ok(assignmentService.createEssay(dto, file, userDetails));
    }

    @PutMapping(value = "/update/{id}", consumes = "multipart/form-data")
    public ResponseEntity<EssayAssignment> updateEssay(
            @PathVariable Long id,
            @RequestPart("data") EssayAssignmentDTO dto,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) throws IOException {
        return ResponseEntity.ok(assignmentService.updateEssay(id, dto, file, userDetails.getUsername()));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteEssay(@PathVariable Long id) {
        assignmentService.deleteEssay(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/create-multiple-choice")
    public ResponseEntity<MultipleChoiceAssignment> createMC(@RequestBody MultipleChoiceAssignmentDTO dto,
                                                             @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(assignmentService.createMultipleChoice(dto, userDetails));
    }

    @PutMapping("/multiple-choice/update/{id}")
    public ResponseEntity<MultipleChoiceAssignment> updateMC(@PathVariable Long id,
                                                             @RequestBody MultipleChoiceAssignment updatedData) {
        return ResponseEntity.ok(assignmentService.updateMultipleChoice(id, updatedData));
    }

    @DeleteMapping("/multiple-choice/delete/{id}")
    public ResponseEntity<Void> deleteMC(@PathVariable Long id) {
        assignmentService.deleteMultipleChoice(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/multiple-choice/{id}")
    public ResponseEntity<MultipleChoiceAssignmentDTO> getMCById(@PathVariable Long id) {
        return ResponseEntity.ok(assignmentService.getMultipleChoiceById(id));
    }

    @GetMapping("/{assignmentId}/submissions")
    public ResponseEntity<?> getSubmissions(@PathVariable Long assignmentId,
                                            @RequestParam AssignmentType type) {
        return ResponseEntity.ok(assignmentService.getSubmissions(assignmentId, type));
    }

    @PostMapping("/{assignmentId}/submissions/{studentId}/grade")
    public ResponseEntity<?> gradeEssay(@PathVariable Long assignmentId,
                                        @PathVariable Long studentId,
                                        @RequestBody Map<String, Object> payload,
                                        @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(assignmentService.gradeEssaySubmission(assignmentId, studentId, payload, userDetails));
    }
}
