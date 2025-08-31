package com.example.tutoringlms.controller;

import com.cloudinary.utils.ObjectUtils;
import com.example.tutoringlms.dto.PaymentDTO;
import com.example.tutoringlms.dto.StudentPaymentDTO;
import com.example.tutoringlms.mapper.PaymentMapper;
import com.example.tutoringlms.model.ClassRoom;
import com.example.tutoringlms.model.ClassRoomPaymentInfo;
import com.example.tutoringlms.model.Payment;
import com.example.tutoringlms.model.Student;
import com.example.tutoringlms.repository.ClassRoomPaymentInfoRepository;
import com.example.tutoringlms.repository.ClassRoomRepository;
import com.example.tutoringlms.repository.PaymentRepository;
import com.example.tutoringlms.repository.StudentRepository;
import com.example.tutoringlms.service.PaymentService;
import com.example.tutoringlms.service.StudentService;
import com.example.tutoringlms.service.TeacherService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentRepository paymentRepo;
    private final PaymentService paymentService;
    private final StudentRepository studentRepository;
    private final ClassRoomRepository classRoomRepository;
    private final ClassRoomPaymentInfoRepository classRoomPaymentInfoRepository;
    // 1. Học sinh upload hình minh chứng
    @PostMapping("/upload-proof/{classId}")
    public ResponseEntity<Payment> uploadProof(
            @PathVariable Long classId,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file,
            @RequestParam("amount") Float amount
    ) throws IOException {

        Student student = studentRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy học sinh"));

        ClassRoom classRoom = classRoomRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));

        Payment payment = paymentService.createOrUpdatePayment(student, classRoom, file, amount);
        return ResponseEntity.ok(payment);
    }

    @PostMapping("/confirm/{paymentId}")
    public ResponseEntity<Payment> confirmPayment(@PathVariable Long paymentId) {
        Payment confirmedPayment = paymentService.confirmPayment(paymentId);
        return ResponseEntity.ok(confirmedPayment);
    }

    // 4. Danh sách thanh toán của học sinh
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Payment>> getPaymentsByStudent(@PathVariable Long studentId) {
        return ResponseEntity.ok(paymentRepo.findByStudentId(studentId));
    }

    @GetMapping("/student/current/{classId}")
    public ResponseEntity<PaymentDTO> getCurrentPayment(
            @PathVariable Long classId,
            @AuthenticationPrincipal UserDetails userDetails) {

        Student student = studentRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy học sinh"));

        Payment payment = paymentRepo.findByStudentIdAndClassRoomIdAndPaidMonthAndPaidYear(
                student.getId(),
                classId,
                java.time.LocalDate.now().getMonthValue(),
                java.time.LocalDate.now().getYear()
        ).orElse(null);

        return ResponseEntity.ok(PaymentMapper.toDTO(payment));
    }

    @GetMapping("/class/{classId}")
    public List<Payment> getByClass(
            @PathVariable Long classId,
            @RequestParam int year
    ) {
        return paymentService.getPaymentsByClass(classId, year);
    }

    @PostMapping("/{id}/toggle")
    public Payment toggle(@PathVariable Long id) {
        return paymentService.togglePaid(id);
    }
    @GetMapping("/class/{classId}/table")
    public ResponseEntity<List<StudentPaymentDTO>> getClassPaymentTable(
            @PathVariable Long classId,
            @RequestParam int year
    ) {
        return ResponseEntity.ok(paymentService.getClassPaymentTable(classId, year));
    }
}
