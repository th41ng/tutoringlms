package com.example.tutoringlms.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
public class ClassRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String className;
    private String schedule;

    @ManyToOne
    @JoinColumn(name = "teacher_id", nullable = false)
    private Teacher teacher;

    @OneToMany(mappedBy = "classRoom")
    private List<Student> students;

    @OneToMany(mappedBy = "classRoom")
    private List<Assignment> assignments;

    @OneToMany(mappedBy = "classRoom")
    private List<Announcement> announcements;

    @OneToOne(mappedBy = "classRoom", cascade = CascadeType.ALL)
    private Forum forum;
}
