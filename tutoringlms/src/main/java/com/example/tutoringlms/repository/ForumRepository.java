package com.example.tutoringlms.repository;

import com.example.tutoringlms.model.Forum;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ForumRepository extends JpaRepository<Forum, Long> {
    Forum findByClassRoom_Id(Long classRoomId);
}
