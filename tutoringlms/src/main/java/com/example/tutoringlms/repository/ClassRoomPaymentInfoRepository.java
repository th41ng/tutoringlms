package com.example.tutoringlms.repository;

import com.example.tutoringlms.model.ClassRoomPaymentInfo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClassRoomPaymentInfoRepository extends JpaRepository<ClassRoomPaymentInfo, Long> {
    ClassRoomPaymentInfo findByClassRoomId(Long classId);
}