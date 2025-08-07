package com.example.tutoringlms.service;

import com.example.tutoringlms.dto.AnnouncementDTO;
import com.example.tutoringlms.model.Announcement;
import com.example.tutoringlms.model.Assignment;
import com.example.tutoringlms.model.ClassRoom;
import com.example.tutoringlms.repository.AnnouncementRepository;
import com.example.tutoringlms.repository.ClassRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

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
    public List<AnnouncementDTO> getAllAnnouncements() {
        return announcementRepo.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    private AnnouncementDTO toDTO(Announcement ann) {
        return new AnnouncementDTO(
                ann.getId(),
                ann.getTitle(),
                ann.getContent(),
                ann.getCreatedAt(),
                ann.getClassRoom().getId(),
                ann.getClassRoom().getClassName()
        );
    }


    public String updateAnnouncement(Long id, AnnouncementDTO dto) {
        Announcement ann = announcementRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông báo"));

        ann.setTitle(dto.getTitle());
        ann.setContent(dto.getContent());

        // Nếu có yêu cầu thay đổi lớp học
        if (dto.getClassRoomId() != null &&
                (ann.getClassRoom() == null ||
                        !ann.getClassRoom().getId().equals(dto.getClassRoomId()))) {

            ClassRoom newClass = classRoomRepo.findById(dto.getClassRoomId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học"));

            ann.setClassRoom(newClass);
            ann.setTeacher(newClass.getTeacher());

            // Gửi email cho học sinh trong lớp mới
            newClass.getStudents().forEach(s -> {
                emailService.sendEmail(
                        s.getEmail(),
                        "[Lớp " + newClass.getClassName() + "] Thông báo cập nhật: " + dto.getTitle(),
                        "<h3>" + dto.getTitle() + "</h3><p>" + dto.getContent() + "</p>"
                );
            });
        }

        announcementRepo.save(ann);
        return "Đã cập nhật";
    }
}
