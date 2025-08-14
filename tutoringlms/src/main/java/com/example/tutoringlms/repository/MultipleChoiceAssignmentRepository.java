package com.example.tutoringlms.repository;

import com.example.tutoringlms.model.MultipleChoiceAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MultipleChoiceAssignmentRepository extends JpaRepository<MultipleChoiceAssignment, Long> {
    List<MultipleChoiceAssignment> findAllByClassRoom_Id(Long classRoomId);
}
