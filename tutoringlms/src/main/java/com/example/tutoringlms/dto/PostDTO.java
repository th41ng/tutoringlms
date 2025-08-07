package com.example.tutoringlms.dto;

import lombok.Data;

@Data
public class PostDTO {
    private String title;
    private String content;
    private Long forumId;
    private Long authorId;
    private String authorName;

}
