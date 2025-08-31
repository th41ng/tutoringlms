package com.example.tutoringlms.exception;

public class AssignmentNotFoundException extends RuntimeException {
    public AssignmentNotFoundException(Long id) {
        super("Assignment not found with id: " + id);
    }
}