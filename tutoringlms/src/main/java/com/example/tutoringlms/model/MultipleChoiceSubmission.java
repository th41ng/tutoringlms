package com.example.tutoringlms.model;

import com.example.tutoringlms.model.Submission;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.EqualsAndHashCode;

// Bảng con cho trắc nghiệm
@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class MultipleChoiceSubmission extends Submission {

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "assignment_id")
    private MultipleChoiceAssignment assignment;

    @Column(columnDefinition = "TEXT")
    private String selectedAnswersJson;

    private Float score;
}
