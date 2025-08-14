package com.example.tutoringlms.repository;

import com.example.tutoringlms.model.EssayAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EssayAssignmentRepository extends JpaRepository<EssayAssignment, Long> {
    List<EssayAssignment> findAllByClassRoom_Id(Long classRoomId);
}
