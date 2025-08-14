package com.example.tutoringlms.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
public class Student extends User {

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "class_id")
    private ClassRoom classRoom;

    @OneToMany(mappedBy = "student")
    @JsonIgnore
    private List<Submission> submissions;

    @OneToMany(mappedBy = "student")
    private List<Payment> payments;

    @OneToMany(mappedBy = "student")
    private List<AttendanceRecord> attendanceRecords;

    @OneToMany(mappedBy = "author")
    private List<Post> posts;

    @OneToMany(mappedBy = "author")
    private List<Comment> comments;
}
