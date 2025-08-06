package com.example.tutoringlms.dto;

import lombok.Data;

@Data
public class CommentDTO {
    private String content;
    private Long postId;
    private Long authorId;
}
