package com.example.tutoringlms.service;

import com.example.tutoringlms.dto.CommentDTO;
import com.example.tutoringlms.dto.PostDTO;
import com.example.tutoringlms.model.*;
import com.example.tutoringlms.repository.*;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ForumService {

    private final ForumRepository forumRepo;
    private final PostRepository postRepo;
    private final CommentRepository commentRepo;
    private final UserRepository userRepo;

    public void createPost(PostDTO dto) {
        Forum forum = forumRepo.findById(dto.getForumId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy diễn đàn"));

        User author = userRepo.findById(dto.getAuthorId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tác giả"));

        Post post = new Post();
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        post.setCreatedAt(LocalDateTime.now());
        post.setForum(forum);
        post.setAuthor(author);

        postRepo.save(post);
    }

    public void addComment(CommentDTO dto) {
        Post post = postRepo.findById(dto.getPostId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài viết"));

        User author = userRepo.findById(dto.getAuthorId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        Comment comment = new Comment();
        comment.setContent(dto.getContent());
        comment.setCreatedAt(LocalDateTime.now());
        comment.setPost(post);
        comment.setAuthor(author);

        commentRepo.save(comment);
    }
}
