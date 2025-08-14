package com.example.tutoringlms.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
// Bảng cha
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
// Hoặc SINGLE_TABLE nếu muốn chung bảng
public abstract class Submission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne @JoinColumn(name = "student_id")
    private Student student;

    private LocalDateTime submittedAt;
    private Boolean isLate;

    @ManyToOne
    @JoinColumn(name = "graded_by")
    private Teacher gradedBy;
}
