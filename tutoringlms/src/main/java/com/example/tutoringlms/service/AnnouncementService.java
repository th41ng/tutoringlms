package com.example.tutoringlms.service;

import com.example.tutoringlms.dto.AnnouncementDTO;
import com.example.tutoringlms.model.Announcement;
import com.example.tutoringlms.model.ClassRoom;
import com.example.tutoringlms.repository.AnnouncementRepository;
import com.example.tutoringlms.repository.ClassRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AnnouncementService {

    private final AnnouncementRepository announcementRepo;
    private final ClassRoomRepository classRoomRepo;
    private final EmailService emailService;

    public void createAnnouncementAndNotify(AnnouncementDTO req) {
        ClassRoom classRoom = classRoomRepo.findById(req.getClassRoomId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));

        Announcement ann = new Announcement();
        ann.setTitle(req.getTitle());
        ann.setContent(req.getContent());
        ann.setCreatedAt(LocalDateTime.now());
        ann.setClassRoom(classRoom);
        ann.setTeacher(classRoom.getTeacher());

        announcementRepo.save(ann);

        // Gửi email
        classRoom.getStudents().forEach(s -> {
            emailService.sendEmail(
                    s.getEmail(),
                    "[Lớp " + classRoom.getClassName() + "] Thông báo mới: " + req.getTitle(),
                    "<h3>" + req.getTitle() + "</h3><p>" + req.getContent() + "</p>"
            );
        });
    }

    public void deleteAnnouncement(Long id) {
        if (!announcementRepo.existsById(id)) {
            throw new RuntimeException("Thông báo không tồn tại");
        }
        announcementRepo.deleteById(id);
    }

}
