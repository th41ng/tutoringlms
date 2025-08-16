package com.example.tutoringlms.dto;

import lombok.Data;

@Data
public class ClassRoomPaymentInfoDTO {
    private Long id;
    private Float amount;
    private String bankAccount;
    private String accountName;
    private String qrCodeUrl;
}