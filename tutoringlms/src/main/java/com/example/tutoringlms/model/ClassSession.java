package com.example.tutoringlms.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@Entity
public class ClassSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "class_id", nullable = false)
    private ClassRoom classRoom;
    private LocalDate date;
    @Enumerated(EnumType.STRING)
    private DayOfWeek dayOfWeek;

    private LocalTime startTime;
    private LocalTime endTime;

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL)
    private List<AttendanceRecord> attendanceRecords;
}
