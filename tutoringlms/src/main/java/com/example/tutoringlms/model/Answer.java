package com.example.tutoringlms.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Answer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    private String answerText;
    private Boolean isCorrect;
}
