package com.example.tutoringlms.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubmissionDTO {
    @NotNull(message = "Cần nhập mã bài tập")
    private Long assignmentId;

    private String answerText;

    private MultipartFile file;

    private Map<Long, Long> multipleChoiceAnswers;
}