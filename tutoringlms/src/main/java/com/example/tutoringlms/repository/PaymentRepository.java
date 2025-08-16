package com.example.tutoringlms.repository;

import com.example.tutoringlms.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // Tìm Payment của học sinh cho lớp trong tháng/năm cụ thể
    Optional<Payment> findByStudentIdAndClassRoomIdAndPaidMonthAndPaidYear(
            Long studentId, Long classRoomId, int paidMonth, int paidYear
    );
    // Danh sách Payment của lớp
    List<Payment> findByClassRoomId(Long classRoomId);

    // Danh sách Payment của học sinh
    List<Payment> findByStudentId(Long studentId);
}
