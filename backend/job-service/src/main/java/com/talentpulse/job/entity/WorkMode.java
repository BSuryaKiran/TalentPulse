package com.talentpulse.job.entity;

public enum WorkMode {
    HYBRID,
    REMOTE,
    ON_SITE;

    public static WorkMode fromString(String text) {
        if (text == null || text.trim().isEmpty()) {
            return HYBRID;
        }
        String normalized = text.trim().toUpperCase().replace(" ", "_").replace("-", "_");
        for (WorkMode mode : WorkMode.values()) {
            if (mode.name().equalsIgnoreCase(normalized)) {
                return mode;
            }
        }
        return HYBRID;
    }
}
