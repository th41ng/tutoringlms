package com.example.tutoringlms.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TeacherStatsDTO {
    private long totalStudents;
    private long totalClasses;
    private long totalRevenueMonthly;
    private long totalRevenue; // thêm cái này
}