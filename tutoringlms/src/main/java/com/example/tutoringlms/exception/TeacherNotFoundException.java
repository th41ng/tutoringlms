package com.example.tutoringlms.exception;

public class TeacherNotFoundException extends RuntimeException {
    public TeacherNotFoundException(String username) {
        super("Teacher not found: " + username);
    }
}