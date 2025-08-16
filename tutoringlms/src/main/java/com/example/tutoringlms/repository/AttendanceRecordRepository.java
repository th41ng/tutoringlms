package com.example.tutoringlms.repository;

import com.example.tutoringlms.model.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, Long> {
    // Lấy tất cả điểm danh theo lớp học hoặc theo học sinh
    List<AttendanceRecord> findBySession_Id(Long sessionId);
    List<AttendanceRecord> findByStudentId(Long studentId);
}
