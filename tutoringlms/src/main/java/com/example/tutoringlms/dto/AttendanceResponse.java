package com.example.tutoringlms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AttendanceResponse {
    private String message;
    private Long sessionId;
    private String className;
}
