package com.example.tutoringlms.controller;

import com.example.tutoringlms.dto.*;
import com.example.tutoringlms.mapper.AssignmentMapper;
import com.example.tutoringlms.model.*;
import com.example.tutoringlms.service.ClassRoomService;
import com.example.tutoringlms.service.EssayAssignService;
import com.example.tutoringlms.service.MultipleChoiceService;
import com.example.tutoringlms.service.TeacherService;
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
import java.util.List;

@RestController
    @RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentController {
    private final EssayAssignService essayAssignService;
    private final ClassRoomService classRoomService;
    private final TeacherService teacherService;
    private final MultipleChoiceService multipleChoiceService;

//    @GetMapping("/all")
//    public ResponseEntity<List<Assignment>> getAllAssignments() {
//        return ResponseEntity.ok(essayAssignService.getAllAssignments());
//    }
@GetMapping("/all")
public ResponseEntity<List<AssignmentDTO>> getAllAssignments() {
    List<Assignment> essayAssignments = essayAssignService.getAllEsAssignments();
    List<Assignment> mcAssignments = multipleChoiceService.getAllMcAssignments();

    List<Assignment> allAssignments = new ArrayList<>();
    allAssignments.addAll(essayAssignments);
    allAssignments.addAll(mcAssignments);

    List<AssignmentDTO> dtos = allAssignments.stream()
            .map(AssignmentMapper::toDTO)
            .toList();

    return ResponseEntity.ok(dtos);
}


    @PostMapping(value = "/createEssay", consumes = "multipart/form-data")
public ResponseEntity<EssayAssignment> createEssay(
        @RequestPart("data") EssayAssignmentDTO dto,
        @RequestPart(value = "file", required = false) MultipartFile file,
        @AuthenticationPrincipal UserDetails userDetails) throws IOException {

    Teacher teacher = teacherService.getTeacherEntityByUsername(userDetails.getUsername());
    ClassRoom classRoom = classRoomService.getClassRoomById(dto.getClassRoomId());

    EssayAssignment assignment = new EssayAssignment();
    assignment.setTitle(dto.getTitle());
    assignment.setDescription(dto.getDescription());
    assignment.setDeadline(dto.getDeadline());
    assignment.setQuestion(dto.getQuestion());
    assignment.setCreatedAt(LocalDateTime.now());
    assignment.setTeacher(teacher);
    assignment.setClassRoom(classRoom);

    // Nếu có file, upload và gán URL
    if (file != null && !file.isEmpty()) {
        String fileUrl = essayAssignService.uploadFile(file);
        assignment.setFileUrl(fileUrl);
    }

    return ResponseEntity.ok(essayAssignService.createEssay(assignment));
}
    @PutMapping(value = "/update/{id}", consumes = "multipart/form-data")
    public ResponseEntity<EssayAssignment> updateEssayWithFile(
            @PathVariable Long id,
            @RequestPart("data") EssayAssignmentDTO dto,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails
    ) throws IOException {

        EssayAssignment updated = essayAssignService.updateAssignment(id, dto, file, userDetails.getUsername());
        return ResponseEntity.ok(updated);
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteEssay(@PathVariable Long id) {
        essayAssignService.deleteAssignment(id);
        return ResponseEntity.noContent().build(); // HTTP 204 No Content
    }

    //TN
    @PostMapping("/create-multiple-choice")
    public ResponseEntity<MultipleChoiceAssignment> createMultipleChoiceAssignment(
            @RequestBody MultipleChoiceAssignmentDTO dto,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        Teacher teacher = teacherService.getTeacherEntityByUsername(userDetails.getUsername());
        ClassRoom classRoom = classRoomService.getClassRoomById(dto.getClassRoomId());

        MultipleChoiceAssignment assignment = new MultipleChoiceAssignment();
        assignment.setTitle(dto.getTitle());
        assignment.setDescription(dto.getDescription());
        assignment.setDeadline(dto.getDeadline());
        assignment.setTeacher(teacher);
        assignment.setClassRoom(classRoom);

        // Tạo danh sách câu hỏi và câu trả lời
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

        return ResponseEntity.ok(multipleChoiceService.save(assignment));
    }
    @PutMapping("/multiple-choice/update/{id}")
    public ResponseEntity<MultipleChoiceAssignment> updateMultipleChoiceAssignment(
            @PathVariable Long id,
            @RequestBody MultipleChoiceAssignment updatedData) {
        MultipleChoiceAssignment updated = multipleChoiceService.update(id, updatedData);
        return ResponseEntity.ok(updated);
    }
    @DeleteMapping("/multiple-choice/delete/{id}")
    public ResponseEntity<Void> deleteMultipleChoiceAssignment(@PathVariable Long id) {
        multipleChoiceService.delete(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/multiple-choice/{id}")
    public ResponseEntity<?> getMultipleChoiceAssignment(@PathVariable Long id) {
        MultipleChoiceAssignment assignment = multipleChoiceService.findById(id).orElse(null);
        if (assignment == null)
            return ResponseEntity.notFound().build();

        MultipleChoiceAssignmentDTO dto = new MultipleChoiceAssignmentDTO();
        dto.setId(assignment.getId());
        dto.setTitle(assignment.getTitle());
        dto.setDescription(assignment.getDescription());
        dto.setDeadline(assignment.getDeadline());

        List<QuestionDTO> questionDTOs = assignment.getQuestions().stream().map(q -> {
            List<AnswerDTO> answerDTOs = q.getAnswers().stream().map(a -> {
                AnswerDTO answerDTO = new AnswerDTO();
                answerDTO.setAnswerText(a.getAnswerText());
                answerDTO.setIsCorrect(a.getIsCorrect());
                return answerDTO;
            }).toList();

            QuestionDTO questionDTO = new QuestionDTO();
            questionDTO.setQuestionText(q.getQuestionText());
            questionDTO.setAnswers(answerDTOs);
            return questionDTO;
        }).toList();

        dto.setQuestions(questionDTOs);

        return ResponseEntity.ok(dto);
    }
}
