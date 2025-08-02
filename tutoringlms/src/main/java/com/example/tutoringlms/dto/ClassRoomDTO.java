package com.example.tutoringlms.dto;

import lombok.Data;

@Data
public class ClassRoomDTO {
    private Long id;
    private String className;
    private String schedule;
    private TeacherDTO teacher;
}
