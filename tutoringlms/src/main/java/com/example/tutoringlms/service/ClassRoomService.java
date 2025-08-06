package com.example.tutoringlms.service;

import com.example.tutoringlms.dto.ClassRoomDTO;
import com.example.tutoringlms.dto.TeacherDTO;
import com.example.tutoringlms.model.ClassRoom;
import com.example.tutoringlms.model.Forum;
import com.example.tutoringlms.model.Teacher;
import com.example.tutoringlms.repository.ClassRoomRepository;
import com.example.tutoringlms.repository.ForumRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClassRoomService {

    private final ClassRoomRepository classRoomRepository;
    private final ForumRepository forumRepo;


//    public ClassRoom createClass(ClassRoom classRoom) {
//        String joinCode = generateUniqueJoinCode(6);
//        classRoom.setJoinCode(joinCode);
//
//        return classRoomRepository.save(classRoom);
//    }
public ClassRoom createClass(ClassRoom classRoom) {
    // Tạo mã join code
    String joinCode = generateUniqueJoinCode(6);
    classRoom.setJoinCode(joinCode);

    // Lưu lớp học
    ClassRoom savedClass = classRoomRepository.save(classRoom);

    // Tạo diễn đàn cho lớp học
    Forum forum = new Forum();
    forum.setClassRoom(savedClass);
    forumRepo.save(forum);

    return savedClass;
}
    private String generateUniqueJoinCode(int length) {
        String code;
        do {
            code = generateRandomCode(length);
        } while (classRoomRepository.existsByJoinCode(code));
        return code;
    }

    private String generateRandomCode(int length) {
        return RandomStringUtils.randomNumeric(length);
    }


    public ClassRoom updateClass(Long id, ClassRoom updatedClass) {
        Optional<ClassRoom> opt = classRoomRepository.findById(id);
        if (opt.isEmpty())
            throw new IllegalArgumentException("Không tìm thấy lớp học");

        ClassRoom existing = opt.get();
        existing.setClassName(updatedClass.getClassName());
        existing.setSchedule(updatedClass.getSchedule());
        return classRoomRepository.save(existing);
    }

    public void deleteClass(Long id) {
        classRoomRepository.deleteById(id);
    }
    public ClassRoomDTO getClassRoomDTOById(Long id, String username) {
        ClassRoom classRoom = classRoomRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lớp học"));

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
        dto.setSchedule(classRoom.getSchedule());
        dto.setJoinCode(classRoom.getJoinCode());
        dto.setTeacher(teacherDTO);

        return dto;
    }
    public List<Map<String, Object>> getStudentsInClass(Long classId, String teacherUsername) {
        ClassRoom classRoom = classRoomRepository.findById(classId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lớp học"));

        if (!classRoom.getTeacher().getUsername().equals(teacherUsername)) {
            throw new SecurityException("Bạn không có quyền xem lớp này");
        }

        return classRoom.getStudents().stream().map(student -> {
            Map<String, Object> m = new HashMap<>();
            m.put("id", student.getId());
            m.put("username", student.getUsername());
            m.put("fullName", student.getLastName() + " " + student.getFirstName());
            return m;
        }).toList();
    }

    public ClassRoom getClassRoomById(Long id) {
        return classRoomRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lớp học với ID = " + id));
    }
}
