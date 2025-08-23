package com.example.tutoringlms.repository;

import com.example.tutoringlms.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUsername(String username);
    Long countByClassRoom_TeacherId(Long teacherId); // 👈 thêm cái này
}
