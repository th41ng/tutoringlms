package com.example.tutoringlms.controller;

import com.example.tutoringlms.dto.AnnouncementDTO;
import com.example.tutoringlms.model.Announcement;
import com.example.tutoringlms.model.ClassRoom;
import com.example.tutoringlms.repository.AnnouncementRepository;
import com.example.tutoringlms.repository.ClassRoomRepository;
import com.example.tutoringlms.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementService announcementService;
    private final AnnouncementRepository announcementRepo;
    private final ClassRoomRepository classRoomRepo;
    // ✅ Tạo + gửi email
    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody AnnouncementDTO dto) {
        announcementService.createAnnouncementAndNotify(dto);
        return ResponseEntity.ok("Tạo thông báo thành công!");
    }

    //Lấy all cho giáo viên quản lý;
    @GetMapping("/all")
    public ResponseEntity<?> getAllAnnouncements() {
        List<AnnouncementDTO> result = announcementService.getAllAnnouncements();
        return ResponseEntity.ok(result);
    }

    // ✅ Lấy danh sách theo classRoomId
    @GetMapping("/classroom/{classId}")
    public ResponseEntity<?> getByClassRoom(@PathVariable Long classId) {
        List<Announcement> announcements = announcementRepo.findByClassRoom_IdOrderByCreatedAtDesc(classId);
        return ResponseEntity.ok(announcements);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable Long id) {
        announcementService.deleteAnnouncement(id);
        return ResponseEntity.noContent().build();
    }


    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody AnnouncementDTO dto) {
        String result = announcementService.updateAnnouncement(id, dto);
        return ResponseEntity.ok(result);
    }
}
