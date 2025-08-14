package com.example.tutoringlms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubmissionDTO {
    private Long assignmentId;
    private String answerText; // cho tự luận
    private MultipartFile file; // file đính kèm
    private Map<Long, Long> multipleChoiceAnswers; // <questionId, answer>
}
