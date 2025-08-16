package com.example.tutoringlms.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.EqualsAndHashCode;

// Bảng con cho tự luận
@Entity
@Data
@EqualsAndHashCode(callSuper = true)
public class EssaySubmission extends Submission {

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "assignment_id")
    private EssayAssignment assignment;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String fileUrl;

    private Double grade;

}
