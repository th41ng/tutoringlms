package com.example.tutoringlms.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Data;

@Data
@Entity
public class EssayAssignment extends Assignment {

    @Column(columnDefinition = "TEXT")
    private String question;
}
