package com.example.tutoringlms.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Float amount;
    private String status; // PENDING, PAID, UNPAID
    private LocalDate paidAt;
    private Boolean isPaid;
    private String proofUrl; // link hình minh chứng
    private int paidYear;
    private int paidMonth;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "class_id")
    private ClassRoom classRoom;
}
