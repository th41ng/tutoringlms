package com.example.tutoringlms.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.tutoringlms.dto.ClassRoomPaymentInfoDTO;
import com.example.tutoringlms.model.ClassRoom;
import com.example.tutoringlms.model.ClassRoomPaymentInfo;
import com.example.tutoringlms.repository.ClassRoomPaymentInfoRepository;
import com.example.tutoringlms.repository.ClassRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/class-payments")
@RequiredArgsConstructor
public class ClassPaymentController {

    private final ClassRoomPaymentInfoRepository paymentInfoRepo;
    private final Cloudinary cloudinary;
    private final ClassRoomRepository classRoomRepo;
    @PostMapping("/create")
    public ResponseEntity<ClassRoomPaymentInfo> createPaymentInfo(
            @RequestParam Long classId,
            @RequestParam Float amount,
            @RequestParam String bankAccount,
            @RequestParam String accountName,
            @RequestParam(required = false) MultipartFile qrFile) throws IOException {

        ClassRoom classRoom = classRoomRepo.findById(classId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));

        ClassRoomPaymentInfo info = new ClassRoomPaymentInfo();
        info.setClassRoom(classRoom);
        info.setAmount(amount);
        info.setBankAccount(bankAccount);
        info.setAccountName(accountName);

        if (qrFile != null && !qrFile.isEmpty()) {
            Map uploadResult = cloudinary.uploader().upload(qrFile.getBytes(),
                    ObjectUtils.asMap("resource_type", "image"));
            info.setQrCodeUrl(uploadResult.get("secure_url").toString());
        }

        return ResponseEntity.ok(paymentInfoRepo.save(info));
    }
    @GetMapping("/class/{classId}")
    public ResponseEntity<ClassRoomPaymentInfoDTO> getPaymentInfo(@PathVariable Long classId) {
        ClassRoomPaymentInfo info = paymentInfoRepo.findByClassRoomId(classId);
        if(info == null) return ResponseEntity.notFound().build();

        ClassRoomPaymentInfoDTO dto = new ClassRoomPaymentInfoDTO();
        dto.setId(info.getId());
        dto.setAmount(info.getAmount());
        dto.setBankAccount(info.getBankAccount());
        dto.setAccountName(info.getAccountName());
        dto.setQrCodeUrl(info.getQrCodeUrl());


        return ResponseEntity.ok(dto);
    }
    @PostMapping("/create-all")
    public ResponseEntity<String> createPaymentInfoForAllClasses(
            @RequestParam Float amount,
            @RequestParam String bankAccount,
            @RequestParam String accountName,
            @RequestParam(required = false) MultipartFile qrFile) throws IOException {

        // Lấy tất cả lớp (hoặc lọc theo giáo viên nếu cần)
        Iterable<ClassRoom> allClasses = classRoomRepo.findAll();

        String qrUrl = null;
        if (qrFile != null && !qrFile.isEmpty()) {
            Map uploadResult = cloudinary.uploader().upload(qrFile.getBytes(),
                    ObjectUtils.asMap("resource_type", "image"));
            qrUrl = uploadResult.get("secure_url").toString();
        }

        for (ClassRoom classRoom : allClasses) {
            ClassRoomPaymentInfo info = new ClassRoomPaymentInfo();
            info.setClassRoom(classRoom);
            info.setAmount(amount);
            info.setBankAccount(bankAccount);
            info.setAccountName(accountName);
            info.setQrCodeUrl(qrUrl);

            paymentInfoRepo.save(info);
        }

        return ResponseEntity.ok("Cập nhật thông tin ngân hàng cho tất cả lớp thành công!");
    }
}
