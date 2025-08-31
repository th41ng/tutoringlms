package com.example.tutoringlms.model;

import com.example.tutoringlms.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Float amount;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status; // dùng enum thay vì String
    @CreationTimestamp
    private LocalDate paidAt;

    private String proofUrl;
    private int paidYear;
    private int paidMonth;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "class_id")
    private ClassRoom classRoom;
}
