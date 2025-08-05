package com.example.tutoringlms.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class MultipleChoiceAssignmentDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime deadline;
    private Long classRoomId;
    private List<QuestionDTO> questions;
}
