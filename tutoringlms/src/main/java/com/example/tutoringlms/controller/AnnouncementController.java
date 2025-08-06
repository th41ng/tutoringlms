package com.example.tutoringlms.controller;

import com.example.tutoringlms.dto.AnnouncementDTO;
import com.example.tutoringlms.model.Announcement;
import com.example.tutoringlms.repository.AnnouncementRepository;
import com.example.tutoringlms.service.AnnouncementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/teacher/announcements")
@RequiredArgsConstructor
public class AnnouncementController {

    private final AnnouncementService announcementService;
    private final AnnouncementRepository announcementRepo;

    // ✅ Tạo + gửi email
    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody AnnouncementDTO dto) {
        announcementService.createAnnouncementAndNotify(dto);
        return ResponseEntity.ok("Tạo thông báo thành công!");
    }

    // ✅ Lấy danh sách theo classRoomId
    @GetMapping("/classroom/{classId}")
    public ResponseEntity<?> getByClassRoom(@PathVariable Long classId) {
        List<Announcement> announcements = announcementRepo.findByClassRoom_IdOrderByCreatedAtDesc(classId);
        return ResponseEntity.ok(announcements);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable Long id) {
        announcementService.deleteAnnouncement(id);
        return ResponseEntity.noContent().build();
    }


    // ✅ Sửa thông báo
    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @RequestBody AnnouncementDTO dto) {
        Announcement ann = announcementRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông báo"));

        ann.setTitle(dto.getTitle());
        ann.setContent(dto.getContent());
        announcementRepo.save(ann);
        return ResponseEntity.ok("Đã cập nhật");
    }
}
