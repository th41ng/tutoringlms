package com.example.tutoringlms.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class MultipleChoiceAssignmentDTO {
    private Long id;

    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;

    private String description;

    @Future(message = "Hạn nộp phải ở tương lai")
    private LocalDateTime deadline;

    @NotNull(message = "Cần nhập mã lớp học")
    private Long classRoomId;

    @NotEmpty(message = "Cần có ít nhất một câu hỏi")
    private List<@Valid QuestionDTO> questions;
}
