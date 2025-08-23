package com.example.tutoringlms.repository;

import com.example.tutoringlms.model.ClassRoom;
import com.example.tutoringlms.model.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ClassRoomRepository extends JpaRepository<ClassRoom, Long> {
    List<ClassRoom> findByTeacher(Teacher teacher);
    boolean existsByJoinCode(String joinCode);
    Optional<ClassRoom> findByJoinCode(String joinCode);

    long countByTeacherId(Long teacherId);

    @Query("SELECT COUNT(DISTINCT s.id) " +
            "FROM ClassRoom c JOIN c.students s " +
            "WHERE c.teacher.id = :teacherId")
    long countDistinctStudentsByTeacherId(@Param("teacherId") Long teacherId);
}

