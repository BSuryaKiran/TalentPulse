package com.talentpulse.job.controller;

import com.talentpulse.job.dto.CreateJobRequest;
import com.talentpulse.job.dto.JobResponse;
import com.talentpulse.job.dto.UpdateJobRequest;
import com.talentpulse.job.security.UserPrincipal;
import com.talentpulse.job.service.JobService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    /**
     * GET /jobs
     * Public/Candidate endpoint to browse active job listings.
     */
    @GetMapping
    public ResponseEntity<List<JobResponse>> getActiveJobs() {
        List<JobResponse> activeJobs = jobService.getActiveJobs();
        return ResponseEntity.ok(activeJobs);
    }

    /**
     * GET /jobs/all
     * Administrative endpoint to list all jobs regardless of status.
     * Strictly restricted to ADMIN role.
     */
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<JobResponse>> getAllJobs() {
        List<JobResponse> allJobs = jobService.getAllJobs();
        return ResponseEntity.ok(allJobs);
    }

    /**
     * GET /jobs/{id}
     * Retrieve single job requisition by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getJobById(@PathVariable Long id) {
        JobResponse response = jobService.getJobById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /jobs/recruiter
     * Retrieve jobs scoped to the authenticated recruiter.
     * If caller is RECRUITER, forces filtering to authenticated identity.
     * If caller is ADMIN, allows querying by email or recruiterId.
     */
    @GetMapping("/recruiter")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<List<JobResponse>> getRecruiterJobs(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) Long recruiterId,
            @RequestHeader(name = "X-Recruiter-Email", required = false) String headerEmail,
            Authentication authentication) {
        UserPrincipal principal = extractPrincipal(authentication);
        boolean isAdmin = principal != null && "ADMIN".equalsIgnoreCase(principal.getRole());

        String effectiveEmail = (!isAdmin && principal != null)
                ? principal.getEmail()
                : (email != null && !email.trim().isEmpty() ? email : headerEmail);
        Long effectiveId = (!isAdmin && principal != null && principal.getUserId() != null)
                ? principal.getUserId()
                : recruiterId;

        List<JobResponse> recruiterJobs = jobService.getRecruiterJobs(effectiveEmail, effectiveId);
        return ResponseEntity.ok(recruiterJobs);
    }

    /**
     * GET /jobs/recruiter/{recruiterId}
     * Retrieve jobs for a specific recruiter ID.
     * Restricted to RECRUITER (matching own ID) or ADMIN.
     */
    @GetMapping("/recruiter/{recruiterId}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<List<JobResponse>> getJobsByRecruiterId(
            @PathVariable Long recruiterId,
            Authentication authentication) {
        UserPrincipal principal = extractPrincipal(authentication);
        boolean isAdmin = principal != null && "ADMIN".equalsIgnoreCase(principal.getRole());

        Long effectiveId = (!isAdmin && principal != null && principal.getUserId() != null)
                ? principal.getUserId()
                : recruiterId;

        List<JobResponse> recruiterJobs = jobService.getRecruiterJobs(null, effectiveId);
        return ResponseEntity.ok(recruiterJobs);
    }

    /**
     * POST /jobs
     * Create a new job requisition. Enforces authenticated recruiter identity.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<JobResponse> createJob(
            @Valid @RequestBody CreateJobRequest request,
            @RequestHeader(name = "X-Recruiter-Email", required = false) String headerEmail,
            @RequestHeader(name = "X-Recruiter-Id", required = false) Long headerId,
            Authentication authentication) {
        UserPrincipal principal = extractPrincipal(authentication);
        String authEmail = (principal != null) ? principal.getEmail() : headerEmail;
        Long authId = (principal != null && principal.getUserId() != null) ? principal.getUserId() : headerId;

        JobResponse createdJob = jobService.createJob(request, authEmail, authId);
        return new ResponseEntity<>(createdJob, HttpStatus.CREATED);
    }

    /**
     * PUT /jobs/{id}
     * Update an existing job requisition with backend ownership verification.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<JobResponse> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody UpdateJobRequest request,
            @RequestHeader(name = "X-Recruiter-Email", required = false) String headerEmail,
            @RequestHeader(name = "X-Recruiter-Id", required = false) Long headerId,
            Authentication authentication) {
        UserPrincipal principal = extractPrincipal(authentication);
        String authEmail = (principal != null) ? principal.getEmail() : headerEmail;
        Long authId = (principal != null && principal.getUserId() != null) ? principal.getUserId() : headerId;

        JobResponse updatedJob = jobService.updateJob(id, request, authEmail, authId);
        return ResponseEntity.ok(updatedJob);
    }

    /**
     * PATCH /jobs/{id}/publish
     * Transition job status to ACTIVE with ownership check.
     */
    @PatchMapping("/{id}/publish")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<JobResponse> publishJob(
            @PathVariable Long id,
            @RequestHeader(name = "X-Recruiter-Email", required = false) String headerEmail,
            @RequestHeader(name = "X-Recruiter-Id", required = false) Long headerId,
            Authentication authentication) {
        UserPrincipal principal = extractPrincipal(authentication);
        String authEmail = (principal != null) ? principal.getEmail() : headerEmail;
        Long authId = (principal != null && principal.getUserId() != null) ? principal.getUserId() : headerId;

        JobResponse publishedJob = jobService.publishJob(id, authEmail, authId);
        return ResponseEntity.ok(publishedJob);
    }

    /**
     * PATCH /jobs/{id}/close
     * Transition job status to CLOSED with ownership check.
     */
    @PatchMapping("/{id}/close")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<JobResponse> closeJob(
            @PathVariable Long id,
            @RequestHeader(name = "X-Recruiter-Email", required = false) String headerEmail,
            @RequestHeader(name = "X-Recruiter-Id", required = false) Long headerId,
            Authentication authentication) {
        UserPrincipal principal = extractPrincipal(authentication);
        String authEmail = (principal != null) ? principal.getEmail() : headerEmail;
        Long authId = (principal != null && principal.getUserId() != null) ? principal.getUserId() : headerId;

        JobResponse closedJob = jobService.closeJob(id, authEmail, authId);
        return ResponseEntity.ok(closedJob);
    }

    /**
     * DELETE /jobs/{id}
     * Permanently delete a job requisition with ownership check.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<Void> deleteJob(
            @PathVariable Long id,
            @RequestHeader(name = "X-Recruiter-Email", required = false) String headerEmail,
            @RequestHeader(name = "X-Recruiter-Id", required = false) Long headerId,
            Authentication authentication) {
        UserPrincipal principal = extractPrincipal(authentication);
        String authEmail = (principal != null) ? principal.getEmail() : headerEmail;
        Long authId = (principal != null && principal.getUserId() != null) ? principal.getUserId() : headerId;

        jobService.deleteJob(id, authEmail, authId);
        return ResponseEntity.noContent().build();
    }

    private UserPrincipal extractPrincipal(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            return (UserPrincipal) authentication.getPrincipal();
        }
        return null;
    }
}
