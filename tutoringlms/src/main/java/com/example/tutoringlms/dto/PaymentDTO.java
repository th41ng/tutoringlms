package com.example.tutoringlms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentDTO {
    private Long id;
    private String status;
    private String proofUrl;
    private Integer paidMonth;
    private Integer paidYear;
    private Float amount;
    private Long studentId;       // id học sinh
    private String studentName;   // tên học sinh
    private Long classId;         // id lớp
    private String className;     // tên lớp
}
