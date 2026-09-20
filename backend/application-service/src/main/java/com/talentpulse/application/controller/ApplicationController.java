package com.talentpulse.application.controller;

import com.talentpulse.application.dto.ApplicationResponse;
import com.talentpulse.application.dto.CreateApplicationRequest;
import com.talentpulse.application.dto.UpdateApplicationStatusRequest;
import com.talentpulse.application.entity.ApplicationStatus;
import com.talentpulse.application.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    /**
     * POST /applications
     * Submit a new job application.
     * System sets status = APPLIED, appliedDate = current timestamp.
     * Enforces duplicate application prevention (jobId + candidateId/email).
     */
    @PostMapping
    public ResponseEntity<ApplicationResponse> createApplication(
            @Valid @RequestBody CreateApplicationRequest request,
            @RequestHeader(name = "X-Candidate-Email", required = false) String candidateEmail,
            @RequestHeader(name = "X-Candidate-Id", required = false) Long candidateId) {
        ApplicationResponse response = applicationService.createApplication(request, candidateEmail, candidateId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * GET /applications/{id}
     * Retrieve single application record by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApplicationResponse> getApplicationById(@PathVariable Long id) {
        ApplicationResponse response = applicationService.getApplicationById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /applications/candidate/{candidateId}
     * Retrieve applications submitted by a specific candidate.
     */
    @GetMapping("/candidate/{candidateId}")
    public ResponseEntity<List<ApplicationResponse>> getApplicationsByCandidateId(
            @PathVariable Long candidateId,
            @RequestParam(required = false) ApplicationStatus status) {
        List<ApplicationResponse> responses = applicationService.getCandidateApplications(candidateId, null, status);
        return ResponseEntity.ok(responses);
    }

    /**
     * GET /applications/candidate
     * Retrieve applications for candidate by email query or header context.
     */
    @GetMapping("/candidate")
    public ResponseEntity<List<ApplicationResponse>> getApplicationsByCandidateContext(
            @RequestParam(required = false) Long candidateId,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) ApplicationStatus status,
            @RequestHeader(name = "X-Candidate-Email", required = false) String headerEmail,
            @RequestHeader(name = "X-Candidate-Id", required = false) Long headerId) {
        Long effectiveId = (candidateId != null) ? candidateId : headerId;
        String effectiveEmail = (email != null && !email.trim().isEmpty()) ? email : headerEmail;
        List<ApplicationResponse> responses = applicationService.getCandidateApplications(effectiveId, effectiveEmail, status);
        return ResponseEntity.ok(responses);
    }

    /**
     * GET /applications/recruiter/{recruiterId}
     * Retrieve applications for jobs owned by a specific recruiter.
     */
    @GetMapping("/recruiter/{recruiterId}")
    public ResponseEntity<List<ApplicationResponse>> getApplicationsByRecruiterId(
            @PathVariable Long recruiterId,
            @RequestParam(required = false) ApplicationStatus status) {
        List<ApplicationResponse> responses = applicationService.getRecruiterApplications(recruiterId, null, status);
        return ResponseEntity.ok(responses);
    }

    /**
     * GET /applications/recruiter
     * Retrieve applications for recruiter by email or header context.
     */
    @GetMapping("/recruiter")
    public ResponseEntity<List<ApplicationResponse>> getApplicationsByRecruiterContext(
            @RequestParam(required = false) Long recruiterId,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) ApplicationStatus status,
            @RequestHeader(name = "X-Recruiter-Email", required = false) String headerEmail,
            @RequestHeader(name = "X-Recruiter-Id", required = false) Long headerId) {
        Long effectiveId = (recruiterId != null) ? recruiterId : headerId;
        String effectiveEmail = (email != null && !email.trim().isEmpty()) ? email : headerEmail;
        List<ApplicationResponse> responses = applicationService.getRecruiterApplications(effectiveId, effectiveEmail, status);
        return ResponseEntity.ok(responses);
    }

    /**
     * GET /applications/job/{jobId}
     * Retrieve all applicant submissions for a specific job requisition.
     */
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<ApplicationResponse>> getApplicationsByJobId(
            @PathVariable Long jobId,
            @RequestParam(required = false) ApplicationStatus status) {
        List<ApplicationResponse> responses = applicationService.getJobApplications(jobId, status);
        return ResponseEntity.ok(responses);
    }

    /**
     * PATCH /applications/{id}/status
     * Update application status (APPLIED, UNDER_REVIEW, SHORTLISTED, REJECTED, SELECTED).
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApplicationResponse> updateApplicationStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateApplicationStatusRequest request,
            @RequestHeader(name = "X-Recruiter-Email", required = false) String recruiterEmail,
            @RequestHeader(name = "X-Recruiter-Id", required = false) Long recruiterId) {
        ApplicationResponse response = applicationService.updateApplicationStatus(id, request, recruiterEmail, recruiterId);
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /applications/{id}
     * Remove an application record if authorized.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteApplication(
            @PathVariable Long id,
            @RequestHeader(name = "X-Recruiter-Email", required = false) String recruiterEmail,
            @RequestHeader(name = "X-Recruiter-Id", required = false) Long recruiterId) {
        applicationService.deleteApplication(id, recruiterEmail, recruiterId);
        return ResponseEntity.noContent().build();
    }
}
