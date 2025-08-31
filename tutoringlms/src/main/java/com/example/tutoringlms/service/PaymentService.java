package com.example.tutoringlms.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.tutoringlms.dto.ClassRoomPaymentInfoDTO;
import com.example.tutoringlms.dto.PaymentDTO;
import com.example.tutoringlms.dto.StudentPaymentDTO;
import com.example.tutoringlms.enums.PaymentStatus;
import com.example.tutoringlms.exception.PaymentNotFoundException;
import com.example.tutoringlms.model.ClassRoom;
import com.example.tutoringlms.model.Payment;
import com.example.tutoringlms.model.Student;
import com.example.tutoringlms.repository.ClassRoomPaymentInfoRepository;
import com.example.tutoringlms.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final ClassRoomPaymentInfoRepository paymentInfoRepo;
    private final PaymentRepository paymentRepo;
    private final Cloudinary cloudinary;

    /** Tạo hoặc cập nhật Payment, upload file nếu có */
    @Transactional
    public Payment createOrUpdatePayment(Student student, ClassRoom classRoom, MultipartFile file, Float amount) throws IOException {
        LocalDate now = LocalDate.now();
        int month = now.getMonthValue();
        int year = now.getYear();

        Optional<Payment> existingPayment = paymentRepo.findByStudentIdAndClassRoomIdAndPaidMonthAndPaidYear(
                student.getId(), classRoom.getId(), month, year
        );

        Payment payment = existingPayment.orElse(new Payment());
        payment.setStudent(student);
        payment.setClassRoom(classRoom);
        payment.setAmount(amount);
        payment.setPaidMonth(month);
        payment.setPaidYear(year);
        payment.setStatus(file != null && !file.isEmpty() ? PaymentStatus.PENDING : PaymentStatus.UNPAID);

        if (file != null && !file.isEmpty()) {
            payment.setProofUrl(uploadFile(file));
        }

        return paymentRepo.save(payment);
    }

    @Transactional
    public Payment confirmPayment(Long paymentId) {
        Payment payment = paymentRepo.findById(paymentId)
                .orElseThrow(() -> new PaymentNotFoundException(paymentId));

        payment.setStatus(PaymentStatus.PAID);
        payment.setPaidAt(LocalDate.now());

        return paymentRepo.save(payment);
    }

    /** Upload file lên Cloudinary */
    public String uploadFile(MultipartFile file) throws IOException {
        String originalFilename = Objects.requireNonNull(file.getOriginalFilename());
        String fileNameWithoutExtension = originalFilename.replaceAll("\\.[^.]+$", "");
        String resourceType = determineResourceType(originalFilename);

        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "resource_type", resourceType,
                "public_id", fileNameWithoutExtension
        ));

        return uploadResult.get("secure_url").toString();
    }

    private String determineResourceType(String filename) {
        String extension = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
        return switch (extension) {
            case "pdf", "doc", "docx", "txt" -> "raw";
            case "jpg", "jpeg", "png", "gif" -> "image";
            case "mp4", "mp3" -> "video";
            default -> "auto";
        };
    }

    public List<Payment> getPaymentsByClass(Long classId, int year) {
        return paymentRepo.findByClassRoomIdAndPaidYear(classId, year);
    }

    @Transactional
    public Payment togglePaid(Long id) {
        Payment payment = paymentRepo.findById(id)
                .orElseThrow(() -> new PaymentNotFoundException(id));

        if (payment.getStatus() == PaymentStatus.PAID) {
            payment.setStatus(PaymentStatus.UNPAID);
            payment.setPaidAt(null);
        } else {
            payment.setStatus(PaymentStatus.PAID);
            payment.setPaidAt(LocalDate.now());
        }

        return paymentRepo.save(payment);
    }

    public List<StudentPaymentDTO> getClassPaymentTable(Long classId, int year) {
        List<Payment> payments = paymentRepo.findByClassRoomIdAndPaidYear(classId, year);

        Map<Long, List<PaymentDTO>> grouped = payments.stream()
                .map(p -> new PaymentDTO(
                        p.getId(),
                        p.getStatus().name(),
                        p.getProofUrl(),
                        p.getPaidMonth(),
                        p.getPaidYear(),
                        p.getAmount(),
                        p.getStudent().getId(),
                        p.getStudent().getFirstName() + " " + p.getStudent().getLastName(),
                        p.getClassRoom().getId(),
                        p.getClassRoom().getClassName()
                ))
                .collect(Collectors.groupingBy(PaymentDTO::getStudentId));

        return grouped.entrySet().stream()
                .map(e -> new StudentPaymentDTO(
                        e.getKey(),
                        e.getValue().get(0).getStudentName(),
                        e.getValue()
                ))
                .toList();
    }

    public ClassRoomPaymentInfoDTO getCurrentInfo() {
        return paymentInfoRepo.findTopByOrderByCreatedAtDesc()
                .map(info -> {
                    ClassRoomPaymentInfoDTO dto = new ClassRoomPaymentInfoDTO();
                    dto.setId(info.getId());
                    dto.setAmount(info.getAmount());
                    dto.setBankAccount(info.getBankAccount());
                    dto.setAccountName(info.getAccountName());
                    dto.setQrCodeUrl(info.getQrCodeUrl());
                    return dto;
                })
                .orElse(null);
    }
}
