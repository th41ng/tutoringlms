    //package com.example.tutoringlms.service;
    //
    //import com.cloudinary.Cloudinary;
    //import com.cloudinary.utils.ObjectUtils;
    //import com.example.tutoringlms.model.ClassRoom;
    //import com.example.tutoringlms.model.Payment;
    //import com.example.tutoringlms.model.Student;
    //import com.example.tutoringlms.repository.PaymentRepository;
    //import lombok.RequiredArgsConstructor;
    //import org.springframework.stereotype.Service;
    //import org.springframework.web.multipart.MultipartFile;
    //
    //import java.io.IOException;
    //import java.util.Map;
    //import java.util.Objects;
    //
    //@Service
    //@RequiredArgsConstructor
    //public class PaymentService {
    //
    //    private final PaymentRepository paymentRepo;
    //    private final Cloudinary cloudinary;
    //
    //    /** Tạo Payment mới hoặc cập nhật nếu đã tồn tại, kèm upload file */
    //    public Payment submitPayment(Student student, ClassRoom classRoom, MultipartFile file, Float amount) throws IOException {
    //        // Kiểm tra Payment hiện tại
    //        Payment payment = paymentRepo.findByStudentIdAndClassRoomId(student.getId(), classRoom.getId())
    //                .orElse(new Payment());
    //
    //        payment.setStudent(student);
    //        payment.setClassRoom(classRoom);
    //        payment.setAmount(amount);
    //        payment.setStatus("CHƯA XÁC NHẬN");
    //
    //        // Upload file
    //        if (file != null && !file.isEmpty()) {
    //            String fileUrl = uploadFile(file);
    //            payment.setProofUrl(fileUrl);
    //            payment.setStatus("PENDING");
    //        }
    //
    //        return paymentRepo.save(payment);
    //    }
    //
    //    /** Upload file lên Cloudinary */
    //    public String uploadFile(MultipartFile file) throws IOException {
    //        String originalFilename = Objects.requireNonNull(file.getOriginalFilename());
    //        String fileNameWithoutExtension = originalFilename.replaceAll("\\.[^.]+$", "");
    //        String resourceType = determineResourceType(originalFilename);
    //
    //        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
    //                "resource_type", resourceType,
    //                "public_id", fileNameWithoutExtension
    //        ));
    //
    //        return uploadResult.get("secure_url").toString();
    //    }
    //
    //    private String determineResourceType(String filename) {
    //        String extension = filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    //
    //        return switch (extension) {
    //            case "pdf", "doc", "docx", "txt" -> "raw";
    //            case "jpg", "jpeg", "png", "gif" -> "image";
    //            case "mp4", "mp3" -> "video";
    //            default -> "auto";
    //        };
    //    }
    //
    //    /** Xác nhận Payment */
    //    public Payment confirmPayment(Long paymentId) {
    //        Payment payment = paymentRepo.findById(paymentId)
    //                .orElseThrow(() -> new RuntimeException("Không tìm thấy thanh toán"));
    //
    //        payment.setStatus("PAID");
    //        payment.setIsPaid(true);
    //
    //        return paymentRepo.save(payment);
    //    }
    //}
    package com.example.tutoringlms.service;

    import com.cloudinary.Cloudinary;
    import com.cloudinary.utils.ObjectUtils;
    import com.example.tutoringlms.model.ClassRoom;
    import com.example.tutoringlms.model.Payment;
    import com.example.tutoringlms.model.Student;
    import com.example.tutoringlms.repository.PaymentRepository;
    import lombok.RequiredArgsConstructor;
    import org.springframework.stereotype.Service;
    import org.springframework.web.multipart.MultipartFile;

    import java.io.IOException;
    import java.time.LocalDate;
    import java.util.Map;
    import java.util.Objects;
    import java.util.Optional;

    @Service
    @RequiredArgsConstructor
    public class PaymentService {

        private final PaymentRepository paymentRepo;
        private final Cloudinary cloudinary;

        public Payment createOrUpdatePayment(Student student, ClassRoom classRoom, MultipartFile file) throws IOException {
            LocalDate now = LocalDate.now();
            int month = now.getMonthValue();
            int year = now.getYear();

            Optional<Payment> existingPayment = paymentRepo.findByStudentIdAndClassRoomIdAndPaidMonthAndPaidYear(
                    student.getId(), classRoom.getId(), month, year
            );

            Payment payment = existingPayment.orElse(new Payment());
            payment.setStudent(student);
            payment.setClassRoom(classRoom);
            payment.setPaidMonth(month);
            payment.setPaidYear(year);
            payment.setStatus("CHƯA XÁC NHẬN");

            if (file != null && !file.isEmpty()) {
                String fileUrl = uploadFile(file);
                payment.setProofUrl(fileUrl);
                payment.setStatus("PENDING");
            }

            return paymentRepo.save(payment);
        }

        public Payment confirmPayment(Long paymentId) {
            Payment payment = paymentRepo.findById(paymentId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy thanh toán"));

            payment.setStatus("PAID");
            payment.setIsPaid(true);
            return paymentRepo.save(payment);
        }

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
    }
