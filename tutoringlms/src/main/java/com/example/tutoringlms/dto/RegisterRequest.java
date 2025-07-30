package com.example.tutoringlms.dto;

import com.example.tutoringlms.enums.Role;
import lombok.Data;

@Data
public class RegisterRequest {
    private String username;
    private String firstName;
    private String lastName;
    private String phoneNum;
    private String email;
    private String password;
    private Role role;
}