package com.example.tutoringlms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnswerDTO {
    private Long id;

    @NotBlank(message = "Câu trả lời không được để trống")
    private String answerText;

    @NotNull(message = "Cần xác định đáp án đúng/sai")
    private Boolean isCorrect;
}