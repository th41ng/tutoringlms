package com.example.tutoringlms.controller;

import com.example.tutoringlms.dto.ClassRoomDTO;
import com.example.tutoringlms.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    @PostMapping("/joinClass")
    public ResponseEntity<?> joinClass(@RequestParam String joinCode,
                                       @AuthenticationPrincipal UserDetails userDetails) {
        boolean success = studentService.joinClass(userDetails.getUsername(), joinCode);

        if (success) {
            return ResponseEntity.ok("Đã tham gia lớp thành công.");
        } else {
            return ResponseEntity.badRequest().body("Mã lớp không hợp lệ hoặc bạn đã tham gia lớp.");
        }
    }

    @GetMapping("/classroom")
    public ResponseEntity<?> getCurrentClass(@AuthenticationPrincipal UserDetails userDetails) {
        ClassRoomDTO dto = studentService.getStudentClass(userDetails.getUsername());

        if (dto == null) {
            return ResponseEntity.noContent().build();
        }

        return ResponseEntity.ok(dto);
    }
}
