package com.example.tutoringlms.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EssayAssignmentDTO {
    private Long id;

    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;

    private String description;

    @Future(message = "Hạn nộp phải ở tương lai")
    private LocalDateTime deadline;

    @NotNull(message = "Cần nhập mã lớp học")
    private Long classRoomId;

    @NotBlank(message = "Câu hỏi không được để trống")
    private String question;

    private String content;
    private String fileUrl;
}