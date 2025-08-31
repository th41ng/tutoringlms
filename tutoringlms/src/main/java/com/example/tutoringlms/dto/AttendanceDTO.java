package com.example.tutoringlms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AttendanceDTO {
    private Long id;

    @NotNull(message = "Cần nhập ID học sinh")
    private Long studentId;

    @NotBlank(message = "Tên học sinh không được để trống")
    private String studentName;

    private boolean present;

    private String capturedFaceImage;
}