package com.example.tutoringlms.repository;

import com.example.tutoringlms.model.ClassRoom;
import com.example.tutoringlms.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ClassRoomRepository extends JpaRepository<ClassRoom, Long> {
    List<ClassRoom> findByTeacher(Teacher teacher);
    boolean existsByJoinCode(String joinCode);
    Optional<ClassRoom> findByJoinCode(String joinCode);
}
