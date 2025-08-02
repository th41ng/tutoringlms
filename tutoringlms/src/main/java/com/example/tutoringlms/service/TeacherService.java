package com.example.tutoringlms.service;

import com.example.tutoringlms.dto.ClassRoomDTO;
import com.example.tutoringlms.dto.TeacherDTO;
import com.example.tutoringlms.model.Teacher;
import com.example.tutoringlms.model.User;
import com.example.tutoringlms.enums.Role;
import com.example.tutoringlms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherService {

    private final UserRepository userRepository;

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

}
