package com.talentpulse.application.entity;

public enum ApplicationStatus {
    APPLIED,
    UNDER_REVIEW,
    SHORTLISTED,
    REJECTED,
    SELECTED;

    public static ApplicationStatus fromString(String status) {
        if (status == null || status.trim().isEmpty()) {
            return APPLIED;
        }
        String normalized = status.trim().toUpperCase().replace(" ", "_").replace("-", "_");
        for (ApplicationStatus s : values()) {
            if (s.name().equals(normalized)) {
                return s;
            }
        }
        throw new IllegalArgumentException("Unknown application status: " + status + ". Allowed values: APPLIED, UNDER_REVIEW, SHORTLISTED, REJECTED, SELECTED.");
    }
}
