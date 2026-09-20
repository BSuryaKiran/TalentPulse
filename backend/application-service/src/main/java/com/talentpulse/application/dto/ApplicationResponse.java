package com.talentpulse.application.dto;

import com.talentpulse.application.entity.Application;
import com.talentpulse.application.entity.ApplicationStatus;
import java.time.LocalDateTime;

public class ApplicationResponse {

    private Long id;
    private Long jobId;
    private String jobTitle;
    private String companyName;
    private Long candidateId;
    private String candidateEmail;
    private String candidateName;
    private Long recruiterId;
    private String recruiterEmail;
    private LocalDateTime appliedDate;
    private ApplicationStatus status;
    private String resumeReference;
    private String coverLetter;
    private String notes;

    public ApplicationResponse() {
    }

    public static ApplicationResponse fromEntity(Application app) {
        if (app == null) {
            return null;
        }
        ApplicationResponse response = new ApplicationResponse();
        response.setId(app.getId());
        response.setJobId(app.getJobId());
        response.setJobTitle(app.getJobTitle());
        response.setCompanyName(app.getCompanyName());
        response.setCandidateId(app.getCandidateId());
        response.setCandidateEmail(app.getCandidateEmail());
        response.setCandidateName(app.getCandidateName());
        response.setRecruiterId(app.getRecruiterId());
        response.setRecruiterEmail(app.getRecruiterEmail());
        response.setAppliedDate(app.getAppliedDate());
        response.setStatus(app.getStatus());
        response.setResumeReference(app.getResumeReference());
        response.setCoverLetter(app.getCoverLetter());
        response.setNotes(app.getNotes());
        return response;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getJobId() {
        return jobId;
    }

    public void setJobId(Long jobId) {
        this.jobId = jobId;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public Long getCandidateId() {
        return candidateId;
    }

    public void setCandidateId(Long candidateId) {
        this.candidateId = candidateId;
    }

    public String getCandidateEmail() {
        return candidateEmail;
    }

    public void setCandidateEmail(String candidateEmail) {
        this.candidateEmail = candidateEmail;
    }

    public String getCandidateName() {
        return candidateName;
    }

    public void setCandidateName(String candidateName) {
        this.candidateName = candidateName;
    }

    public Long getRecruiterId() {
        return recruiterId;
    }

    public void setRecruiterId(Long recruiterId) {
        this.recruiterId = recruiterId;
    }

    public String getRecruiterEmail() {
        return recruiterEmail;
    }

    public void setRecruiterEmail(String recruiterEmail) {
        this.recruiterEmail = recruiterEmail;
    }

    public LocalDateTime getAppliedDate() {
        return appliedDate;
    }

    public void setAppliedDate(LocalDateTime appliedDate) {
        this.appliedDate = appliedDate;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public String getResumeReference() {
        return resumeReference;
    }

    public void setResumeReference(String resumeReference) {
        this.resumeReference = resumeReference;
    }

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
