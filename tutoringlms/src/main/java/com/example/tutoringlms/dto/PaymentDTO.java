package com.example.tutoringlms.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentDTO {
    private Long id;

    @NotBlank(message = "Trạng thái không được để trống")
    private String status;

    private String proofUrl;

    @NotNull(message = "Tháng thanh toán không được để trống")
    @Min(value = 1, message = "Tháng phải từ 1 đến 12")
    @Max(value = 12, message = "Tháng phải từ 1 đến 12")
    private Integer paidMonth;

    @NotNull(message = "Năm thanh toán không được để trống")
    private Integer paidYear;

    @NotNull(message = "Cần nhập số tiền")
    @Positive(message = "Số tiền phải lớn hơn 0")
    private Float amount;

    @NotNull(message = "Cần nhập mã học sinh")
    private Long studentId;

    @NotBlank(message = "Tên học sinh không được để trống")
    private String studentName;

    @NotNull(message = "Cần nhập mã lớp học")
    private Long classId;

    @NotBlank(message = "Tên lớp học không được để trống")
    private String className;
}
