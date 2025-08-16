package com.example.tutoringlms.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
public class ClassRoomPaymentInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "class_id")
    private ClassRoom classRoom;

    private Float amount;
    private String qrCodeUrl;
    private String bankAccount;
    private String accountName;
}
