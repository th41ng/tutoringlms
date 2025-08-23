package com.example.tutoringlms.service;

import com.example.tutoringlms.dto.AttendanceDTO;
import com.example.tutoringlms.dto.ClassRoomDTO;
import com.example.tutoringlms.dto.TeacherDTO;
import com.example.tutoringlms.mapper.ClassRoomMapper;
import com.example.tutoringlms.model.*;
import com.example.tutoringlms.repository.*;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ClassRoomService {

    private final ClassRoomRepository classRoomRepository;
    private final ForumRepository forumRepo;
    private  final ClassSessionRepository classSessionRepository;
    private final AttendanceRecordRepository attendanceRecordRepository;
    private final StudentRepository studentRepository;

//    public ClassRoom createClass(ClassRoom classRoom) {
//        String joinCode = generateUniqueJoinCode(6);
//        classRoom.setJoinCode(joinCode);
//
//        return classRoomRepository.save(classRoom);
//    }
public ClassRoom createClass(ClassRoomDTO dto, Teacher teacher, LocalDate startDate, int weeks) {
    ClassRoom classRoom = new ClassRoom();
    classRoom.setClassName(dto.getClassName());

    // Tạo mã join code
    classRoom.setJoinCode(generateUniqueJoinCode(6));
    classRoom.setTeacher(teacher);

    ClassRoom savedClass = classRoomRepository.save(classRoom);

    if (dto.getSessions() != null) {
        List<ClassSession> sessionList = new ArrayList<>();

        for (int week = 0; week < weeks; week++) {
            for (ClassRoomDTO.SessionDTO s : dto.getSessions()) {
                // Tính ngày cụ thể
                LocalDate sessionDate = startDate.with(java.time.temporal.TemporalAdjusters.nextOrSame(s.getDayOfWeek()))
                        .plusWeeks(week);

                ClassSession session = new ClassSession();
                session.setClassRoom(savedClass);
                session.setDayOfWeek(s.getDayOfWeek());
                session.setStartTime(s.getStartTime());
                session.setEndTime(s.getEndTime());
                session.setDate(sessionDate);

                sessionList.add(classSessionRepository.save(session));
            }
        }

        savedClass.setSessions(sessionList);
    }

    // Tạo forum cho lớp
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
        return ClassRoomMapper.toDTO(classRoom);
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




    public List<AttendanceDTO> findBySessionId(Long sessionId) {
        return attendanceRecordRepository.findBySession_Id(sessionId).stream().map(a -> {
            AttendanceDTO dto = new AttendanceDTO();
            dto.setId(a.getId());
            dto.setStudentId(a.getStudent().getId());
            dto.setStudentName(a.getStudent().getLastName() + " " + a.getStudent().getFirstName());
            dto.setPresent(a.getIsAttendance());
            dto.setCapturedFaceImage(a.getCapturedFaceImage());
            return dto;
        }).toList();
    }


    public void removeStudentFromClass(Long classId, Long studentId) {
        ClassRoom classRoom = classRoomRepository.findById(classId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy lớp học"));

        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Không tìm thấy học sinh"));

        if (!classRoom.getStudents().contains(student)) {
            throw new IllegalArgumentException("Học sinh không thuộc lớp này");
        }

        // Gỡ liên kết
        student.setClassRoom(null);
        studentRepository.save(student);
    }
}
