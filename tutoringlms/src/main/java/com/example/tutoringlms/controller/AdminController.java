package com.example.tutoringlms.controller;

import com.example.tutoringlms.dto.RegisterRequest;
import com.example.tutoringlms.model.User;
import com.example.tutoringlms.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;

    @GetMapping("/listUser")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userService.findAllUsers());
    }

    @PostMapping("/createUser")
    public ResponseEntity<User> createUser(@RequestBody RegisterRequest request) {
        User user = userService.createUserByAdmin(request);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/editUser/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody RegisterRequest request) {
        User user = userService.updateUser(id, request);
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/deleteUser/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        userService.deleteUserById(id);
        return ResponseEntity.ok("Đã xóa người dùng thành công");
    }
}
