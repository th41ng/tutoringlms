package com.example.tutoringlms.model;

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
    @JoinColumn(name = "assignment_id")
    private EssayAssignment assignment;

    @Column(columnDefinition = "TEXT")
    private String content;

    private String fileUrl;

    private Float grade;

    @ManyToOne @JoinColumn(name = "graded_by")
    private Teacher gradedBy;
}
