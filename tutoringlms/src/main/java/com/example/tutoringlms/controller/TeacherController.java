    package com.example.tutoringlms.controller;

    import com.example.tutoringlms.dto.AttendanceDTO;
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
        public ResponseEntity<ClassRoom> createClass(@RequestBody ClassRoomDTO dto,
                                                     @AuthenticationPrincipal UserDetails userDetails) {
            Teacher teacher = teacherService.getTeacherEntityByUsername(userDetails.getUsername());
            // Lấy startDate và weeks từ dto
            return ResponseEntity.ok(
                    classRoomService.createClass(dto, teacher, dto.getStartDate(), dto.getWeeks())
            );
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

        @GetMapping("/classroom/{id}")
        public ResponseEntity<ClassRoomDTO> getClassroomInfo(@PathVariable Long id,
                                                             @AuthenticationPrincipal UserDetails userDetails) {
            return ResponseEntity.ok(classRoomService.getClassRoomDTOById(id, userDetails.getUsername()));
        }

        @GetMapping("/classroom/{id}/students")
        public ResponseEntity<?> getStudentsInClass(@PathVariable Long id,
                                                    @AuthenticationPrincipal UserDetails userDetails) {
            List<?> students = classRoomService.getStudentsInClass(id, userDetails.getUsername());
            return ResponseEntity.ok(students);
        }





        @GetMapping("/attendance/{sessionId}")
        public ResponseEntity<List<AttendanceDTO>> getAttendance(@PathVariable Long sessionId) {
            List<AttendanceDTO> list = classRoomService.findBySessionId(sessionId); // <--- sửa method
            return ResponseEntity.ok(list);
        }
        @DeleteMapping("/classroom/{classId}/students/{studentId}")
        public ResponseEntity<?> removeStudent(@PathVariable Long classId, @PathVariable Long studentId) {
            classRoomService.removeStudentFromClass(classId, studentId);
            return ResponseEntity.ok("Đã xóa học sinh khỏi lớp");
        }

        @GetMapping("/stats")
        public ResponseEntity<?> getTeacherStats(@AuthenticationPrincipal UserDetails userDetails) {
            return ResponseEntity.ok(teacherService.getTeacherStats(userDetails.getUsername()));
        }
    }
