package com.example.tutoringlms.exception;

public class StudentNotFoundException extends RuntimeException {
    public StudentNotFoundException(String username) {
        super("Student not found: " + username);
    }
}