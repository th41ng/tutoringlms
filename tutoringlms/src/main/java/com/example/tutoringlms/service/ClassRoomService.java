package com.example.tutoringlms.service;

import com.example.tutoringlms.model.ClassRoom;
import com.example.tutoringlms.model.Teacher;
import com.example.tutoringlms.repository.ClassRoomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ClassRoomService {

    private final ClassRoomRepository classRoomRepository;

    public List<ClassRoom> getClassesByTeacher(Teacher teacher) {
        return classRoomRepository.findByTeacher(teacher);
    }

    public ClassRoom createClass(ClassRoom classRoom) {
        return classRoomRepository.save(classRoom);
    }

    public ClassRoom updateClass(Long id, ClassRoom updatedClass) {
        Optional<ClassRoom> opt = classRoomRepository.findById(id);
        if (opt.isEmpty())
            throw new IllegalArgumentException("Không tìm thấy lớp học");

        ClassRoom existing = opt.get();
        existing.setClassName(updatedClass.getClassName());
        existing.setSchedule(updatedClass.getSchedule());
        return classRoomRepository.save(existing);
    }

    public void deleteClass(Long id) {
        classRoomRepository.deleteById(id);
    }
}
