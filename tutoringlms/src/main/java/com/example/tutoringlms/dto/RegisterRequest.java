package com.example.tutoringlms.dto;

import com.example.tutoringlms.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    private Long id;
    @NotBlank(message = "Username không được để trống")
    @Size(min = 3, max = 50)
    private String username;
    private String firstName;
    private String lastName;
    private String phoneNum;
    @Email(message = "Email không hợp lệ")
    private String email;
    private String password;
    private Role role;
}