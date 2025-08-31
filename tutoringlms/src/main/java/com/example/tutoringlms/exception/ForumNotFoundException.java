package com.example.tutoringlms.exception;

public class ForumNotFoundException extends RuntimeException {
    public ForumNotFoundException(Long id) {
        super("Forum not found with id: " + id);
    }
}