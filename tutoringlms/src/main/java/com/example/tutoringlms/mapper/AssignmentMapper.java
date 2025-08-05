package com.example.tutoringlms.mapper;

import com.example.tutoringlms.dto.AssignmentDTO;
import com.example.tutoringlms.enums.AssignmentType;
import com.example.tutoringlms.model.Assignment;
import com.example.tutoringlms.model.EssayAssignment;
import com.example.tutoringlms.model.MultipleChoiceAssignment;

public class AssignmentMapper {
    public static AssignmentDTO toDTO(Assignment assignment) {
        AssignmentDTO dto = new AssignmentDTO();
        dto.setId(assignment.getId());
        dto.setTitle(assignment.getTitle());
        dto.setDescription(assignment.getDescription());
        dto.setCreatedAt(assignment.getCreatedAt());
        dto.setDeadline(assignment.getDeadline());
        dto.setClassName(assignment.getClassRoom().getClassName());

        if (assignment instanceof EssayAssignment essay) {
            dto.setType(AssignmentType.ESSAY);
            dto.setFileUrl(essay.getFileUrl()); // ✅ BỔ SUNG
        } else if (assignment instanceof MultipleChoiceAssignment) {
            dto.setType(AssignmentType.MULTIPLE_CHOICE);
        }

        return dto;
    }
}

