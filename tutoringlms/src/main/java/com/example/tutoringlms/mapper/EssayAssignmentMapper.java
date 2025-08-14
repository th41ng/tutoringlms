package com.example.tutoringlms.mapper;

import com.example.tutoringlms.dto.EssayAssignmentDTO;
import com.example.tutoringlms.model.EssayAssignment;
import com.example.tutoringlms.model.EssaySubmission;
import org.springframework.stereotype.Component;

@Component
public class EssayAssignmentMapper {

    public EssayAssignmentDTO toDTO(EssayAssignment assignment, EssaySubmission submission) {
        EssayAssignmentDTO dto = new EssayAssignmentDTO();
        dto.setId(assignment.getId());
        dto.setTitle(assignment.getTitle());
        dto.setDescription(assignment.getDescription());
        dto.setDeadline(assignment.getDeadline());
        dto.setClassRoomId(assignment.getClassRoom().getId());
        dto.setQuestion(assignment.getQuestion());

        if (submission != null) {
            dto.setContent(submission.getContent());
            dto.setFileUrl(submission.getFileUrl());
        }

        return dto;
    }
}
