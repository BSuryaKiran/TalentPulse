package com.talentpulse.application.dto;

import com.talentpulse.application.entity.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class UpdateApplicationStatusRequest {

    @NotNull(message = "Application status is required")
    private ApplicationStatus status;

    @Size(max = 2000, message = "Notes must not exceed 2000 characters")
    private String notes;

    public UpdateApplicationStatusRequest() {
    }

    public UpdateApplicationStatusRequest(ApplicationStatus status) {
        this.status = status;
    }

    public UpdateApplicationStatusRequest(ApplicationStatus status, String notes) {
        this.status = status;
        this.notes = notes;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
