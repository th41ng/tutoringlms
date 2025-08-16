package com.example.tutoringlms.dto;

import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class ClassRoomDTO {
    private Long id;
    private String className;
    private String joinCode;
    private String schedule; // vẫn giữ để hiển thị dạng text nếu cần
    private TeacherDTO teacher;
    private List<SessionDTO> sessions; // thêm danh sách buổi học
    private LocalDate startDate; // ngày bắt đầu lớp
    private int weeks;           // số tuần của khóa học
    @Data
    public static class SessionDTO {
        private LocalDate date;        // ngày cụ thể
        private DayOfWeek dayOfWeek;
        private LocalTime startTime;
        private LocalTime endTime;
    }
}