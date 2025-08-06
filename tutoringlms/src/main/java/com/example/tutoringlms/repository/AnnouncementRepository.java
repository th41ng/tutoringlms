package com.example.tutoringlms.repository;

import com.example.tutoringlms.model.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findByClassRoom_IdOrderByCreatedAtDesc(Long classRoomId);

}
