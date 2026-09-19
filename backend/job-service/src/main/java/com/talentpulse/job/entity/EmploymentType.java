package com.talentpulse.job.entity;

public enum EmploymentType {
    FULL_TIME,
    PART_TIME,
    CONTRACT,
    INTERNSHIP;

    public static EmploymentType fromString(String text) {
        if (text == null || text.trim().isEmpty()) {
            return FULL_TIME;
        }
        String normalized = text.trim().toUpperCase().replace(" ", "_").replace("-", "_");
        for (EmploymentType b : EmploymentType.values()) {
            if (b.name().equalsIgnoreCase(normalized)) {
                return b;
            }
        }
        return FULL_TIME;
    }
}
