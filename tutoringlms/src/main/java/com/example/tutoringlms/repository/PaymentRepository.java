package com.example.tutoringlms.repository;

import com.example.tutoringlms.enums.PaymentStatus;
import com.example.tutoringlms.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

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
    List<Payment> findByClassRoomIdAndPaidYear(Long classId, int year);
    List<Payment> findByStudentIdAndPaidYear(Long studentId, int year);

    // Tổng doanh thu của giáo viên trong tháng (chỉ tính Payment đã PAID)
    @Query("SELECT COALESCE(SUM(p.amount),0) " +
            "FROM Payment p " +
            "WHERE p.classRoom.teacher.id = :teacherId " +
            "AND p.paidYear = :year " +
            "AND p.paidMonth = :month " +
            "AND p.status = com.example.tutoringlms.enums.PaymentStatus.PAID")
    long sumRevenueByTeacherAndMonth(@Param("teacherId") Long teacherId,
                                     @Param("year") int year,
                                     @Param("month") int month);

    // Tổng doanh thu của giáo viên (tất cả Payment đã PAID)
    @Query("SELECT COALESCE(SUM(p.amount), 0) " +
            "FROM Payment p " +
            "WHERE p.classRoom.teacher.id = :teacherId " +
            "AND p.status = com.example.tutoringlms.enums.PaymentStatus.PAID")
    long sumTotalRevenueByTeacher(@Param("teacherId") Long teacherId);
}
