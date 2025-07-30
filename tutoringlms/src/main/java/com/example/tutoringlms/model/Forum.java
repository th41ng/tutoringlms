package com.example.tutoringlms.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class Forum {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "class_id", unique = true)
    private ClassRoom classRoom;
}
