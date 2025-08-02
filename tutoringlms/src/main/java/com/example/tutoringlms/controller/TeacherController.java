package com.example.tutoringlms.controller;

import com.example.tutoringlms.dto.ClassRoomDTO;
import com.example.tutoringlms.model.ClassRoom;
import com.example.tutoringlms.model.Teacher;
import com.example.tutoringlms.service.ClassRoomService;
import com.example.tutoringlms.service.TeacherService;
import com.example.tutoringlms.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teacher")
@RequiredArgsConstructor
public class TeacherController {

    private final ClassRoomService classRoomService;
    private final TeacherService teacherService;

    @GetMapping("/listClasses")
    public ResponseEntity<List<ClassRoomDTO>> getOwnClasses(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(teacherService.getOwnClasses(userDetails.getUsername()));
    }

    @PostMapping("/createClasses")
    public ResponseEntity<ClassRoom> createClass(@RequestBody ClassRoom classRoom,
                                                 @AuthenticationPrincipal UserDetails userDetails) {
        Teacher teacher = teacherService.getTeacherEntityByUsername(userDetails.getUsername());

        classRoom.setTeacher(teacher);
        return ResponseEntity.ok(classRoomService.createClass(classRoom));
    }

    @PutMapping("/editClasses/{id}")
    public ResponseEntity<ClassRoom> updateClass(@PathVariable Long id,
                                                 @RequestBody ClassRoom classRoom) {
        return ResponseEntity.ok(classRoomService.updateClass(id, classRoom));
    }

    @DeleteMapping("/deleteClasses/{id}")
    public ResponseEntity<?> deleteClass(@PathVariable Long id) {
        classRoomService.deleteClass(id);
        return ResponseEntity.ok("Đã xóa lớp học thành công");
    }
}
