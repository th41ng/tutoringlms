//package com.example.tutoringlms.dto;
//
//import com.example.tutoringlms.model.Teacher;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import java.time.LocalDateTime;
//
//@NoArgsConstructor
//@AllArgsConstructor
//@Data
//public class AssignmentDTO {
//    private Long id;
//    private String title;
//    private String description;
//    private LocalDateTime createdAt;
//    private LocalDateTime deadline;
//    private String fileUrl;
//    private String question;
//    private Long classId;
//    private String className;
//    private Long teacherId;
//    private String teacherName;
//
//
//}
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
