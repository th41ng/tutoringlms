package com.example.tutoringlms.model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
public class ClassRoomPaymentInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "class_id")
    private ClassRoom classRoom;
    @CreationTimestamp
    private LocalDateTime createdAt;
    private Float amount;
    private String qrCodeUrl;
    private String bankAccount;
    private String accountName;
}
