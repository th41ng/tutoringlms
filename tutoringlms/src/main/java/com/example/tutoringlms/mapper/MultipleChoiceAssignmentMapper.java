package com.example.tutoringlms.mapper;

import com.example.tutoringlms.dto.*;
import com.example.tutoringlms.model.*;
import java.util.stream.Collectors;

public class MultipleChoiceAssignmentMapper {

    public static MultipleChoiceAssignmentDTO toDTO(MultipleChoiceAssignment assignment) {
        MultipleChoiceAssignmentDTO dto = new MultipleChoiceAssignmentDTO();
        dto.setId(assignment.getId());
        dto.setTitle(assignment.getTitle());
        dto.setDescription(assignment.getDescription());

        dto.setQuestions(
                assignment.getQuestions().stream().map(q -> {
                    QuestionDTO qdto = new QuestionDTO();
                    qdto.setId(q.getId()); // ✅ Gán ID câu hỏi
                    qdto.setQuestionText(q.getQuestionText());

                    qdto.setAnswers(
                            q.getAnswers().stream().map(a -> {
                                AnswerDTO adto = new AnswerDTO();
                                adto.setId(a.getId()); // ✅ Gán ID đáp án
                                adto.setAnswerText(a.getAnswerText());
                                adto.setIsCorrect(a.getIsCorrect());
                                return adto;
                            }).collect(Collectors.toList())
                    );

                    return qdto;
                }).collect(Collectors.toList())
        );

        return dto;
    }
}