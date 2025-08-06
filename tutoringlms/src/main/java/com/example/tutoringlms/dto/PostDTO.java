package com.example.tutoringlms.dto;

import lombok.Data;

@Data
public class PostDTO {
    private String title;
    private String content;
    private Long forumId;     // forum = diễn đàn lớp
    private Long authorId;    // user là giáo viên hoặc học sinh
}
