package com.example.tutoringlms.service;

import com.example.tutoringlms.dto.ClassRoomDTO;
import com.example.tutoringlms.dto.TeacherDTO;
import com.example.tutoringlms.dto.TeacherStatsDTO;
import com.example.tutoringlms.model.Teacher;
import com.example.tutoringlms.model.User;
import com.example.tutoringlms.enums.Role;
import com.example.tutoringlms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class TeacherService {

    private final UserRepository userRepository;
    private final TeacherRepository teacherRepository;
    private final ClassRoomRepository classRoomRepository;
    private final PaymentRepository paymentRepository;
    private final StudentRepository studentRepository;
    public List<ClassRoomDTO> getOwnClasses(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng: " + username));

        if (!(user instanceof Teacher teacher)) {
            throw new IllegalStateException("Người dùng không phải kiểu Teacher.");
        }

        return teacher.getClasses().stream()
                .map(classRoom -> {
                    TeacherDTO teacherDTO = new TeacherDTO();
                    teacherDTO.setId(teacher.getId());
                    teacherDTO.setUsername(teacher.getUsername());
                    teacherDTO.setFullName(teacher.getFirstName() + " " + teacher.getLastName());
                    teacherDTO.setEmail(teacher.getEmail());
                    teacherDTO.setPhoneNum(teacher.getPhoneNum());

                    ClassRoomDTO dto = new ClassRoomDTO();
                    dto.setId(classRoom.getId());
                    dto.setClassName(classRoom.getClassName());
                    dto.setSchedule(classRoom.getSchedule());
                    dto.setTeacher(teacherDTO);

                    return dto;
                })
                .toList();
    }
    public Teacher getTeacherEntityByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy người dùng: " + username));

        if (!(user instanceof Teacher teacher)) {
            throw new IllegalStateException("Người dùng không phải kiểu Teacher.");
        }

        return teacher;
    }
    public TeacherStatsDTO getTeacherStats(String username) {
        User teacher = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy giáo viên"));

        // Đếm số lớp
        long totalClasses = classRoomRepository.countByTeacherId(teacher.getId());

        // Đếm số học sinh (distinct)
        long totalStudents = classRoomRepository.countDistinctStudentsByTeacherId(teacher.getId());

        YearMonth now = YearMonth.now();
        long totalRevenueMonthly = paymentRepository.sumRevenueByTeacherAndMonth(
                teacher.getId(), now.getYear(), now.getMonthValue()
        );
        long totalRevenue = paymentRepository.sumTotalRevenueByTeacher(teacher.getId());

        return new TeacherStatsDTO(totalStudents, totalClasses, totalRevenueMonthly, totalRevenue);

    }
}
