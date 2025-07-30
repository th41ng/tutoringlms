package com.example.tutoringlms.service;

import com.example.tutoringlms.dto.RegisterRequest;
import com.example.tutoringlms.enums.Role;
import com.example.tutoringlms.model.Student;
import com.example.tutoringlms.model.User;
import com.example.tutoringlms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepo;
    private final BCryptPasswordEncoder passwordEncoder;

    public User register(RegisterRequest request) {
        if (request.getRole() != Role.STUDENT) {
            throw new IllegalArgumentException("Chỉ học sinh mới được phép đăng ký");
        }

        Student student = new Student();
        student.setUsername(request.getUsername());
        student.setPassword(passwordEncoder.encode(request.getPassword()));
        student.setEmail(request.getEmail());
        student.setRole(Role.STUDENT);
        student.setFirstName(request.getFirstName());
        student.setLastName(request.getLastName());
        student.setPhoneNum(request.getPhoneNum());

        return userRepo.save(student);
    }

    public User login(String username, String rawPassword) {
        return userRepo.findByUsername(username)
                .filter(u -> passwordEncoder.matches(rawPassword, u.getPassword()))
                .orElse(null);
    }
}
