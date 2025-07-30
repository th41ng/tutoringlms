package com.example.tutoringlms.controller;

import com.example.tutoringlms.dto.AuthRequest;
import com.example.tutoringlms.dto.AuthResponse;
import com.example.tutoringlms.dto.RegisterRequest;
import com.example.tutoringlms.model.User;
import com.example.tutoringlms.service.UserService;
import com.example.tutoringlms.utils.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        User user = userService.register(request);
        return ResponseEntity.ok("Đăng ký thành công cho " + user.getUsername());
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        User user = userService.login(request.getUsername(), request.getPassword());

        if (user == null) {
            return ResponseEntity.status(401).body("Tên đăng nhập hoặc mật khẩu không đúng.");
        }

        try {
            String token = jwtUtils.generateToken(user.getUsername());
            return ResponseEntity.ok(new AuthResponse(token));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi tạo token: " + e.getMessage());
        }
    }
}
