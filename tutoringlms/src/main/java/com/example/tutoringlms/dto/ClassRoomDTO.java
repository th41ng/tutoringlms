package com.example.tutoringlms.dto;

import lombok.Data;

@Data
public class ClassRoomDTO {
    private Long id;
    private String className;
    private String schedule;
    private String joinCode;
    private TeacherDTO teacher;
}
