package com.example.tutoringlms.dto;

import lombok.Data;

@Data
public class AttendanceRequest {
    private String username;
    private String imageUrl;
    private Double confidence;
    private Long classRoomId;
}
