package com.example.tutoringlms.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Data
@Entity
public class Teacher extends User {

    private String subjectName;

    @OneToMany(mappedBy = "teacher")
    @JsonIgnore
    private List<ClassRoom> classes;
    @JsonIgnore
    @OneToMany(mappedBy = "teacher")
    private List<Assignment> assignments;

    @OneToMany(mappedBy = "teacher")
    private List<Announcement> announcements;

    @OneToMany(mappedBy = "gradedBy")
    private List<Submission> gradedSubmissions;

    @OneToMany(mappedBy = "author")
    private List<Post> posts;

    @OneToMany(mappedBy = "author")
    private List<Comment> comments;
}
