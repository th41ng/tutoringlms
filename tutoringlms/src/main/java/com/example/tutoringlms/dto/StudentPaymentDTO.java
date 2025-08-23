package com.example.tutoringlms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentPaymentDTO {
    private Long studentId;
    private String studentName;
    private List<PaymentDTO> payments; // danh sách các tháng học sinh đó học
}