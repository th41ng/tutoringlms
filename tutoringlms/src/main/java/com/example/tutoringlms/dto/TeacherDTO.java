package com.example.tutoringlms.dto;

import lombok.Data;

@Data
public class TeacherDTO {
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String phoneNum;
}
