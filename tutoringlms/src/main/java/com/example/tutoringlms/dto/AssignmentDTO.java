
package com.example.tutoringlms.dto;

import com.example.tutoringlms.enums.AssignmentType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AssignmentDTO {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime deadline;
    private String className;
    private String fileUrl;
    private AssignmentType type; // NEW
}
