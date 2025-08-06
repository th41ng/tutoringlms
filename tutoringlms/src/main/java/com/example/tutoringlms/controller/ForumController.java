package com.example.tutoringlms.controller;

import com.example.tutoringlms.dto.CommentDTO;
import com.example.tutoringlms.dto.ForumDTO;
import com.example.tutoringlms.dto.PostDTO;
import com.example.tutoringlms.model.*;
import com.example.tutoringlms.repository.CommentRepository;
import com.example.tutoringlms.repository.ForumRepository;
import com.example.tutoringlms.repository.PostRepository;
import com.example.tutoringlms.repository.UserRepository;
import com.example.tutoringlms.service.CommentService;
import com.example.tutoringlms.service.ForumService;

import com.example.tutoringlms.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/forum")
@RequiredArgsConstructor
public class ForumController {

    private final PostService postService;
    private final CommentService commentService;
    private final ForumRepository forumRepo;
    private final UserRepository userRepo;
    @GetMapping("/all")
    public ResponseEntity<?> getAllForums() {
        List<Forum> forums = forumRepo.findAll();
        List<ForumDTO> dtos = forums.stream()
                .map(this::toForumDTO)
                .toList();
        return ResponseEntity.ok(dtos);
    }
    @GetMapping("/mine")
    public ResponseEntity<?> getMyForums(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepo.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        if (!(user instanceof Student)) {
            return ResponseEntity.badRequest().body("Chỉ học sinh mới có diễn đàn riêng");
        }

        Student student = (Student) user;

        if (student.getClassRoom() == null) {
            return ResponseEntity.status(404).body("Học sinh chưa được vào lớp nào!");
        }

        Long classId = student.getClassRoom().getId();
        Forum forum = forumRepo.findByClassRoom_Id(classId);

        if (forum == null) {
            return ResponseEntity.status(404).body("Không tìm thấy diễn đàn cho lớp của học sinh!");
        }

        return ResponseEntity.ok(toForumDTO(forum));
    }



    // ✅ Tạo bài viết
    @PostMapping("/posts")
    public ResponseEntity<?> createPost(@RequestBody PostDTO dto,
                                        @AuthenticationPrincipal UserDetails userDetails) {
        Post post = postService.createPost(dto, userDetails.getUsername());
        return ResponseEntity.ok(post);
    }

    // ✅ Lấy bài viết theo lớp học
    @GetMapping("/posts/classroom/{classRoomId}")
    public ResponseEntity<?> getPosts(@PathVariable Long classRoomId) {
        Forum forum = forumRepo.findByClassRoom_Id(classRoomId);
        return ResponseEntity.ok(postService.getPostsByForum(forum.getId()));
    }

    // ✅ Tạo bình luận
    @PostMapping("/comments")
    public ResponseEntity<?> createComment(@RequestBody CommentDTO dto,
                                           @AuthenticationPrincipal UserDetails userDetails) {
        Comment comment = commentService.createComment(dto, userDetails.getUsername());
        return ResponseEntity.ok(comment);
    }

    // ✅ Lấy bình luận theo bài viết
    @GetMapping("/comments/post/{postId}")
    public ResponseEntity<?> getComments(@PathVariable Long postId) {
        return ResponseEntity.ok(commentService.getCommentsByPost(postId));
    }
    private ForumDTO toForumDTO(Forum forum) {
        ForumDTO dto = new ForumDTO();
        dto.setId(forum.getId());
        if (forum.getClassRoom() != null) {
            dto.setClassId(forum.getClassRoom().getId());
            dto.setClassName(forum.getClassRoom().getClassName());
        }
        return dto;
    }

}
