
package com.example.tutoringlms.dto;

import com.example.tutoringlms.enums.AssignmentType;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AssignmentDTO {
    private Long id;

    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;

    private String description;

    private LocalDateTime createdAt;

    @Future(message = "Hạn nộp phải ở tương lai")
    private LocalDateTime deadline;

    private String className;
    private String fileUrl;

    @NotNull(message = "Cần chọn loại bài tập")
    private AssignmentType type;
}