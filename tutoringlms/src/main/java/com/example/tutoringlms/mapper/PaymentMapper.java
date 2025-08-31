package com.example.tutoringlms.mapper;

import com.example.tutoringlms.dto.PaymentDTO;
import com.example.tutoringlms.model.Payment;

public class PaymentMapper {

    public static PaymentDTO toDTO(Payment payment) {
        if (payment == null) return null;

        String studentName = payment.getStudent() != null
                ? payment.getStudent().getFirstName() + " " + payment.getStudent().getLastName()
                : null;

        String className = payment.getClassRoom() != null
                ? payment.getClassRoom().getClassName()
                : null;

        return new PaymentDTO(
                payment.getId(),
                payment.getStatus() != null ? payment.getStatus().name() : null, // Sử dụng enum name()
                payment.getProofUrl(),
                payment.getPaidMonth(),
                payment.getPaidYear(),
                payment.getAmount(),
                payment.getStudent() != null ? payment.getStudent().getId() : null,
                studentName,
                payment.getClassRoom() != null ? payment.getClassRoom().getId() : null,
                className
        );
    }
}
