package com.example.tutoringlms.mapper;

import com.example.tutoringlms.dto.ClassRoomDTO;
import com.example.tutoringlms.dto.TeacherDTO;
import com.example.tutoringlms.model.ClassRoom;
import com.example.tutoringlms.model.ClassSession;
import com.example.tutoringlms.model.Teacher;

import java.util.List;
import java.util.stream.Collectors;

public class ClassRoomMapper {

    public static ClassRoomDTO toDTO(ClassRoom classRoom) {
        if (classRoom == null) return null;

        ClassRoomDTO dto = new ClassRoomDTO();
        dto.setId(classRoom.getId());
        dto.setClassName(classRoom.getClassName());
        dto.setSchedule(classRoom.getSchedule());
        dto.setJoinCode(classRoom.getJoinCode());

        // Map teacher
        Teacher teacher = classRoom.getTeacher();
        if (teacher != null) {
            TeacherDTO teacherDTO = new TeacherDTO();
            teacherDTO.setId(teacher.getId());
            teacherDTO.setUsername(teacher.getUsername());
            teacherDTO.setFullName(teacher.getFirstName() + " " + teacher.getLastName());
            teacherDTO.setEmail(teacher.getEmail());
            teacherDTO.setPhoneNum(teacher.getPhoneNum());
            dto.setTeacher(teacherDTO);
        }

        // Map sessions
        if (classRoom.getSessions() != null) {
            List<ClassRoomDTO.SessionDTO> sessions = classRoom.getSessions()
                    .stream()
                    .map(ClassRoomMapper::toSessionDTO)
                    .collect(Collectors.toList());
            dto.setSessions(sessions);
        }

        return dto;
    }

    private static ClassRoomDTO.SessionDTO toSessionDTO(ClassSession session) {
        ClassRoomDTO.SessionDTO sdto = new ClassRoomDTO.SessionDTO();
        sdto.setId(session.getId());        // thêm dòng này
        sdto.setDate(session.getDate());
        sdto.setDayOfWeek(session.getDayOfWeek());
        sdto.setStartTime(session.getStartTime());
        sdto.setEndTime(session.getEndTime());
        return sdto;
    }
}
