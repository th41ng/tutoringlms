package com.example.tutoringlms.service;

import com.example.tutoringlms.dto.ClassRoomDTO;
import com.example.tutoringlms.dto.TeacherDTO;
import com.example.tutoringlms.exception.UserNotFoundException;
import com.example.tutoringlms.model.Student;
import com.example.tutoringlms.model.ClassRoom;
import com.example.tutoringlms.model.Teacher;
import com.example.tutoringlms.model.User;
import com.example.tutoringlms.repository.ClassRoomRepository;
import com.example.tutoringlms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final ClassRoomRepository classRoomRepository;
    private final UserRepository userRepository;
    @Transactional
    public boolean joinClass(String username, String joinCode) {
        Optional<ClassRoom> classRoomOpt = classRoomRepository.findByJoinCode(joinCode);
        if (classRoomOpt.isEmpty()) return false;

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) return false;

        User user = userOpt.get();

        // Ép kiểu sang Student
        if (!(user instanceof Student)) {
            return false; // Không phải học sinh
        }

        Student student = (Student) user;
        ClassRoom classRoom = classRoomOpt.get();

        if (student.getClassRoom() != null &&
                student.getClassRoom().getId().equals(classRoom.getId())) {
            return false;
        }

        student.setClassRoom(classRoom);
        userRepository.save(student);

        return true;
    }


    public ClassRoomDTO getStudentClass(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty() || !(userOpt.get() instanceof Student student)) {
            return null;
        }

        ClassRoom classRoom = student.getClassRoom();
        if (classRoom == null) return null;

        // Dùng lại logic bạn đã viết trong ClassRoomService
        Teacher teacher = classRoom.getTeacher();
        TeacherDTO teacherDTO = new TeacherDTO();
        teacherDTO.setId(teacher.getId());
        teacherDTO.setUsername(teacher.getUsername());
        teacherDTO.setFullName(teacher.getFirstName() + " " + teacher.getLastName());
        teacherDTO.setEmail(teacher.getEmail());
        teacherDTO.setPhoneNum(teacher.getPhoneNum());

        ClassRoomDTO dto = new ClassRoomDTO();
        dto.setId(classRoom.getId());
        dto.setClassName(classRoom.getClassName());
        dto.setJoinCode(classRoom.getJoinCode());
        dto.setTeacher(teacherDTO);

// thêm sessions chi tiết
        List<ClassRoomDTO.SessionDTO> sessionDTOs = classRoom.getSessions().stream().map(s -> {
            ClassRoomDTO.SessionDTO sd = new ClassRoomDTO.SessionDTO();
            sd.setId(s.getId());
            sd.setDate(s.getDate());         // yyyy-MM-dd
            sd.setStartTime(s.getStartTime());
            sd.setEndTime(s.getEndTime());
            return sd;
        }).toList();
        dto.setSessions(sessionDTOs);

        return dto;
    }

    public Student getStudentEntityByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));

        if (!(user instanceof Student student)) {
            throw new IllegalStateException("Người dùng không phải kiểu hs.");
        }

        return student;
    }
}
