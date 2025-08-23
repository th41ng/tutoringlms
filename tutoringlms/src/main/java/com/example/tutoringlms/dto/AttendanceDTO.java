package com.example.tutoringlms.dto;

import lombok.Data;

@Data
public class AttendanceDTO {
    private Long id;
    private Long studentId;
    private String studentName;
    private boolean present;
    private String capturedFaceImage; // thêm
}