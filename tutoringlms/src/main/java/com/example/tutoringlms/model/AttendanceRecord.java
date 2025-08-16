package com.example.tutoringlms.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
public class AttendanceRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date; // Ngày điểm danh
    private Boolean isAttendance;

    @Column(columnDefinition = "TEXT")
    private String capturedFaceImage; // Ảnh nhận dạng khuôn mặt

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    private ClassSession session; // Buổi học mà học sinh điểm danh
}
