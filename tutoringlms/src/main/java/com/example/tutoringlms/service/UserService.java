package com.example.tutoringlms.service;

import com.example.tutoringlms.dto.RegisterRequest;
import com.example.tutoringlms.enums.Role;
import com.example.tutoringlms.model.Student;
import com.example.tutoringlms.model.Teacher;
import com.example.tutoringlms.model.User;
import com.example.tutoringlms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepo;
    private final BCryptPasswordEncoder passwordEncoder;

    public User register(RegisterRequest request) {
        if (request.getRole() != Role.ROLE_STUDENT) {
            throw new IllegalArgumentException("Chỉ học sinh mới được phép đăng ký");
        }

        Student student = new Student();
        student.setUsername(request.getUsername());
        student.setPassword(passwordEncoder.encode(request.getPassword()));
        student.setEmail(request.getEmail());
        student.setRole(Role.ROLE_STUDENT);
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

    public List<User> findAllUsers() {
        return userRepo.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepo.findById(id);
    }

    public User updateUser(Long id, RegisterRequest request) {
        Optional<User> optionalUser = userRepo.findById(id);
        if (optionalUser.isEmpty()) {
            throw new IllegalArgumentException("Không tìm thấy người dùng với ID: " + id);
        }

        User user = optionalUser.get();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNum(request.getPhoneNum());

        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return userRepo.save(user);
    }

    public void deleteUserById(Long id) {
        if (!userRepo.existsById(id)) {
            throw new IllegalArgumentException("Người dùng không tồn tại");
        }
        userRepo.deleteById(id);
    }

    public User findByUsername(String username) {
        return userRepo.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng: " + username));
    }


    public User createUserByAdmin(RegisterRequest request) {
        User user;

        // Tạo đối tượng tương ứng theo vai trò
        switch (request.getRole()) {
            case ROLE_STUDENT -> user = new Student();
            case ROLE_TEACHER -> user = new Teacher();
            default -> throw new IllegalArgumentException("Vai trò không hợp lệ: " + request.getRole());
        }

        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhoneNum(request.getPhoneNum());

        return userRepo.save(user);
    }

}
