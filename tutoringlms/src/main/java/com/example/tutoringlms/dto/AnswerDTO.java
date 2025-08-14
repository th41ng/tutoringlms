package com.example.tutoringlms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class AnswerDTO {
    private Long id;
    private String answerText;
    private Boolean isCorrect;
}