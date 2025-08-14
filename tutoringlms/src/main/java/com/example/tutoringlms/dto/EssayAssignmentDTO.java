package com.example.tutoringlms.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EssayAssignmentDTO {
    private Long id;                // ID của bài tập
    private String title;            // Tiêu đề
    private String description;      // Mô tả
    private LocalDateTime deadline;  // Hạn nộp
    private Long classRoomId;        // ID lớp học
    private String question;         // Câu hỏi
    private String content;
    private String fileUrl;
}