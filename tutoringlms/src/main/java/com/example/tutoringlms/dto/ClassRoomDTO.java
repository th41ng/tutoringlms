package com.example.tutoringlms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
public class ClassRoomDTO {
    private Long id;

    @NotBlank(message = "Tên lớp học không được để trống")
    private String className;

    private String joinCode;
    private String schedule;

    @NotNull(message = "Giáo viên không được để trống")
    private TeacherDTO teacher;

    private List<SessionDTO> sessions;

    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDate startDate;

    @Positive(message = "Số tuần phải lớn hơn 0")
    private int weeks;

    @Data
    public static class SessionDTO {
        private Long id;

        @NotNull(message = "Cần nhập ngày học")
        private LocalDate date;

        @NotNull(message = "Cần nhập thứ trong tuần")
        private DayOfWeek dayOfWeek;

        @NotNull(message = "Cần nhập giờ bắt đầu")
        private LocalTime startTime;

        @NotNull(message = "Cần nhập giờ kết thúc")
        private LocalTime endTime;
    }
}