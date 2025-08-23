package com.example.tutoringlms.repository;

import com.example.tutoringlms.model.ClassRoomPaymentInfo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ClassRoomPaymentInfoRepository extends JpaRepository<ClassRoomPaymentInfo, Long> {
    ClassRoomPaymentInfo findByClassRoomId(Long classId);
    Optional<ClassRoomPaymentInfo> findTopByOrderByCreatedAtDesc();
}