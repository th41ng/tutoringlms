package com.example.tutoringlms.service;

import com.example.tutoringlms.dto.PostDTO;
import com.example.tutoringlms.model.Forum;
import com.example.tutoringlms.model.Post;
import com.example.tutoringlms.model.User;
import com.example.tutoringlms.repository.ForumRepository;
import com.example.tutoringlms.repository.PostRepository;
import com.example.tutoringlms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {
    private final ForumRepository forumRepo;
    private final PostRepository postRepo;
    private final UserRepository userRepo;

    public Post createPost(PostDTO dto, String username) {
        Forum forum = forumRepo.findById(dto.getForumId())
                .orElseThrow(() -> new RuntimeException("Forum không tồn tại"));

        User author = userRepo.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

        Post post = new Post();
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        post.setForum(forum);
        post.setAuthor(author);
        post.setCreatedAt(LocalDateTime.now());

        return postRepo.save(post);
    }

    public List<Post> getPostsByForum(Long forumId) {
        return postRepo.findByForum_IdOrderByCreatedAtDesc(forumId);
    }
}
