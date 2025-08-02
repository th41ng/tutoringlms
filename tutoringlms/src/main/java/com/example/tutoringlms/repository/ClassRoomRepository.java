package com.example.tutoringlms.repository;

import com.example.tutoringlms.model.ClassRoom;
import com.example.tutoringlms.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ClassRoomRepository extends JpaRepository<ClassRoom, Long> {
    List<ClassRoom> findByTeacher(Teacher teacher);
}
