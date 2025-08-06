package com.example.tutoringlms.service;

import com.example.tutoringlms.dto.CommentDTO;
import com.example.tutoringlms.model.Comment;
import com.example.tutoringlms.model.Post;
import com.example.tutoringlms.model.User;
import com.example.tutoringlms.repository.CommentRepository;
import com.example.tutoringlms.repository.PostRepository;
import com.example.tutoringlms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService {
    private final CommentRepository commentRepo;
    private final PostRepository postRepo;
    private final UserRepository userRepo;

    public Comment createComment(CommentDTO dto, String username) {
        Post post = postRepo.findById(dto.getPostId())
                .orElseThrow(() -> new RuntimeException("Post không tồn tại"));

        User author = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        Comment comment = new Comment();
        comment.setContent(dto.getContent());
        comment.setPost(post);
        comment.setAuthor(author);
        comment.setCreatedAt(LocalDateTime.now());

        return commentRepo.save(comment);
    }

    public List<Comment> getCommentsByPost(Long postId) {
        return commentRepo.findByPost_IdOrderByCreatedAtAsc(postId);
    }
}
