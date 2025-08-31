package com.example.tutoringlms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;


import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class AnnouncementDTO {
    private Long id;

    @NotBlank(message = "Tiêu đề không được để trống")
    private String title;

    @NotBlank(message = "Nội dung không được để trống")
    private String content;
    @CreationTimestamp
    private LocalDateTime createdAt;

    @NotNull(message = "Cần nhập mã lớp học")
    private Long classRoomId;

    private String className;
}
