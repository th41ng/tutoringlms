package com.example.tutoringlms.dto;

import lombok.Data;

@Data
public class AnnouncementDTO {
    private String title;
    private String content;
    private Long classRoomId;
}
