    package com.example.tutoringlms.dto;

    import com.example.tutoringlms.model.ClassRoom;
    import com.example.tutoringlms.model.Teacher;

    import lombok.AllArgsConstructor;
    import lombok.Data;
    import lombok.NoArgsConstructor;

    import java.time.LocalDateTime;

    @Data
    public class EssayAssignmentDTO {
        private String title;
        private String description;
        private LocalDateTime deadline;
        private Long classRoomId;
        private String question;
    }

