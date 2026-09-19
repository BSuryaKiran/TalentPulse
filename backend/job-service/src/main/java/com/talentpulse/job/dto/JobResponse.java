package com.talentpulse.job.dto;

import com.talentpulse.job.entity.Job;
import com.talentpulse.job.entity.JobStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class JobResponse {

    private Long id;
    private String title;
    private String companyName;
    private String description;
    private String employmentType;
    private String workMode;
    private String location;
    private String experience;
    private String salary;
    private LocalDate applicationDeadline;
    private List<String> requiredSkills;
    private List<String> qualifications;
    private List<String> responsibilities;
    private List<String> benefits;
    private String additionalInformation;
    private LocalDateTime postedDate;
    private JobStatus status;
    private int applicantCount;
    private Long recruiterId;
    private String recruiterEmail;

    public JobResponse() {
    }

    public static JobResponse fromEntity(Job job) {
        if (job == null) return null;
        JobResponse response = new JobResponse();
        response.setId(job.getId());
        response.setTitle(job.getTitle());
        response.setCompanyName(job.getCompanyName());
        response.setDescription(job.getDescription());
        response.setEmploymentType(job.getEmploymentType() != null ? job.getEmploymentType().name() : null);
        response.setWorkMode(job.getWorkMode() != null ? job.getWorkMode().name() : null);
        response.setLocation(job.getLocation());
        response.setExperience(job.getExperience());
        response.setSalary(job.getSalary());
        response.setApplicationDeadline(job.getApplicationDeadline());
        response.setRequiredSkills(job.getRequiredSkills());
        response.setQualifications(job.getQualifications());
        response.setResponsibilities(job.getResponsibilities());
        response.setBenefits(job.getBenefits());
        response.setAdditionalInformation(job.getAdditionalInformation());
        response.setPostedDate(job.getPostedDate());
        response.setStatus(job.getStatus());
        response.setApplicantCount(job.getApplicantCount());
        response.setRecruiterId(job.getRecruiterId());
        response.setRecruiterEmail(job.getRecruiterEmail());
        return response;
    }

    // Getters & Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEmploymentType() {
        return employmentType;
    }

    public void setEmploymentType(String employmentType) {
        this.employmentType = employmentType;
    }

    public String getWorkMode() {
        return workMode;
    }

    public void setWorkMode(String workMode) {
        this.workMode = workMode;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getSalary() {
        return salary;
    }

    public void setSalary(String salary) {
        this.salary = salary;
    }

    public LocalDate getApplicationDeadline() {
        return applicationDeadline;
    }

    public void setApplicationDeadline(LocalDate applicationDeadline) {
        this.applicationDeadline = applicationDeadline;
    }

    public List<String> getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(List<String> requiredSkills) {
        this.requiredSkills = requiredSkills;
    }

    public List<String> getQualifications() {
        return qualifications;
    }

    public void setQualifications(List<String> qualifications) {
        this.qualifications = qualifications;
    }

    public List<String> getResponsibilities() {
        return responsibilities;
    }

    public void setResponsibilities(List<String> responsibilities) {
        this.responsibilities = responsibilities;
    }

    public List<String> getBenefits() {
        return benefits;
    }

    public void setBenefits(List<String> benefits) {
        this.benefits = benefits;
    }

    public String getAdditionalInformation() {
        return additionalInformation;
    }

    public void setAdditionalInformation(String additionalInformation) {
        this.additionalInformation = additionalInformation;
    }

    public LocalDateTime getPostedDate() {
        return postedDate;
    }

    public void setPostedDate(LocalDateTime postedDate) {
        this.postedDate = postedDate;
    }

    public JobStatus getStatus() {
        return status;
    }

    public void setStatus(JobStatus status) {
        this.status = status;
    }

    public int getApplicantCount() {
        return applicantCount;
    }

    public void setApplicantCount(int applicantCount) {
        this.applicantCount = applicantCount;
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
}
