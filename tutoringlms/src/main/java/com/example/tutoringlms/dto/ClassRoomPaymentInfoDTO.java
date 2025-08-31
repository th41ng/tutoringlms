package com.example.tutoringlms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class ClassRoomPaymentInfoDTO {
    private Long id;

    @NotNull(message = "Cần nhập số tiền")
    @Positive(message = "Số tiền phải lớn hơn 0")
    private Float amount;

    @NotBlank(message = "Số tài khoản không được để trống")
    private String bankAccount;

    @NotBlank(message = "Tên chủ tài khoản không được để trống")
    private String accountName;

    private String qrCodeUrl;
}