package com.example.tutoringlms.repository;

import com.example.tutoringlms.model.Assignment;
import com.example.tutoringlms.model.ClassRoom;
import com.example.tutoringlms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    Optional<Assignment> findById(Long id);
    List<Assignment> findAllByClassRoom_Id(Long classRoomId);
    // Lấy tất cả bài tập tự luận
    @Query("SELECT e FROM EssayAssignment e")
    List<Assignment> findAllEssayAssignments();

    // Lấy tất cả bài tập trắc nghiệm
    @Query("SELECT m FROM MultipleChoiceAssignment m")
    List<Assignment> findAllMcAssignments();
}