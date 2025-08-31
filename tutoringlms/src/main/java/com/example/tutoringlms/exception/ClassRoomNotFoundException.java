package com.example.tutoringlms.exception;

public class ClassRoomNotFoundException extends RuntimeException {
    public ClassRoomNotFoundException(Long id) {
        super("ClassRoom not found with id: " + id);
    }
}