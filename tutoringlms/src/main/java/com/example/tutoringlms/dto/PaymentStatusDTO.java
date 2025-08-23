package com.example.tutoringlms.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentStatusDTO {
    private int month;         // Tháng học phí
    private int year;          // Năm học phí
    private String status;     // PAID / UNPAID / PENDING
    private Float amount;      // Số tiền
    private String proofUrl;   // Link minh chứng (nếu có)
}
