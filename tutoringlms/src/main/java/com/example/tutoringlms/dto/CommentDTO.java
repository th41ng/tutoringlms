package com.example.tutoringlms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CommentDTO {
    @NotBlank(message = "Nội dung bình luận không được để trống")
    private String content;

    @NotNull(message = "Cần nhập mã bài viết")
    private Long postId;

    @NotNull(message = "Cần nhập mã tác giả")
    private Long authorId;
}