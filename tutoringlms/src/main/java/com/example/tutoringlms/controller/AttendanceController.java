package com.example.tutoringlms.controller;

import com.example.tutoringlms.dto.AttendanceRequest;
import com.example.tutoringlms.dto.AttendanceResponse;
import com.example.tutoringlms.model.AttendanceRecord;
import com.example.tutoringlms.model.ClassSession;
import com.example.tutoringlms.model.Student;
import com.example.tutoringlms.repository.AttendanceRecordRepository;
import com.example.tutoringlms.repository.ClassSessionRepository;
import com.example.tutoringlms.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {
    private final AttendanceRecordRepository attendanceRepo;
    private final StudentRepository studentRepo;
    private final ClassSessionRepository sessionRepo;

    // Lấy buổi học hiện tại
    @GetMapping("/currentSession")
    public ResponseEntity<AttendanceResponse> getCurrentSession() {
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        List<ClassSession> sessions = sessionRepo.findCurrentSessions(today, now);

        if (sessions.isEmpty()) {
            return ResponseEntity.ok(new AttendanceResponse("Không có buổi học hiện tại", null, null));
        }

        ClassSession session = sessions.get(0);
        return ResponseEntity.ok(new AttendanceResponse(
                "Buổi học hiện tại",
                session.getId(),
                session.getClassRoom().getClassName()
        ));
    }

    // Check-in điểm danh tự động
    @PostMapping("/record")
    public ResponseEntity<AttendanceResponse> recordAttendance(@RequestBody AttendanceRequest request) {
        // request.username là kết quả nhận diện từ FE
        String username = request.getUsername();
        if (username == null || username.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new AttendanceResponse("Không tìm thấy học sinh", null, null));
        }

        Student student = studentRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy học sinh: " + username));

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();
        List<ClassSession> sessions = sessionRepo.findCurrentSessions(today, now);

        if (sessions.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(new AttendanceResponse("Không có buổi học hiện tại", null, null));
        }

        ClassSession session = sessions.get(0);

        AttendanceRecord record = new AttendanceRecord();
        record.setStudent(student);
        record.setSession(session);
        record.setDate(today);
        record.setCapturedFaceImage(request.getImageUrl());
        record.setIsAttendance(request.getConfidence() > 0.5);

        attendanceRepo.save(record);

        return ResponseEntity.ok(new AttendanceResponse(
                "Điểm danh thành công",
                session.getId(),
                session.getClassRoom().getClassName()
        ));
    }
}
