package com.talentpulse.job.controller;

import com.talentpulse.job.dto.CreateJobRequest;
import com.talentpulse.job.dto.JobResponse;
import com.talentpulse.job.dto.UpdateJobRequest;
import com.talentpulse.job.service.JobService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
     */
    @GetMapping("/all")
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
     * Retrieve jobs scoped to a recruiter by email query parameter or header.
     */
    @GetMapping("/recruiter")
    public ResponseEntity<List<JobResponse>> getRecruiterJobs(
            @RequestParam(required = false) String email,
            @RequestParam(required = false) Long recruiterId,
            @RequestHeader(name = "X-Recruiter-Email", required = false) String headerEmail) {
        String effectiveEmail = (email != null && !email.trim().isEmpty()) ? email : headerEmail;
        List<JobResponse> recruiterJobs = jobService.getRecruiterJobs(effectiveEmail, recruiterId);
        return ResponseEntity.ok(recruiterJobs);
    }

    /**
     * GET /jobs/recruiter/{recruiterId}
     * Retrieve jobs for a specific recruiter ID.
     */
    @GetMapping("/recruiter/{recruiterId}")
    public ResponseEntity<List<JobResponse>> getJobsByRecruiterId(@PathVariable Long recruiterId) {
        List<JobResponse> recruiterJobs = jobService.getRecruiterJobs(null, recruiterId);
        return ResponseEntity.ok(recruiterJobs);
    }

    /**
     * POST /jobs
     * Create a new job requisition (DRAFT or ACTIVE).
     */
    @PostMapping
    public ResponseEntity<JobResponse> createJob(
            @Valid @RequestBody CreateJobRequest request,
            @RequestHeader(name = "X-Recruiter-Email", required = false) String recruiterEmail,
            @RequestHeader(name = "X-Recruiter-Id", required = false) Long recruiterId) {
        JobResponse createdJob = jobService.createJob(request, recruiterEmail, recruiterId);
        return new ResponseEntity<>(createdJob, HttpStatus.CREATED);
    }

    /**
     * PUT /jobs/{id}
     * Update an existing job requisition.
     */
    @PutMapping("/{id}")
    public ResponseEntity<JobResponse> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody UpdateJobRequest request,
            @RequestHeader(name = "X-Recruiter-Email", required = false) String recruiterEmail,
            @RequestHeader(name = "X-Recruiter-Id", required = false) Long recruiterId) {
        JobResponse updatedJob = jobService.updateJob(id, request, recruiterEmail, recruiterId);
        return ResponseEntity.ok(updatedJob);
    }

    /**
     * PATCH /jobs/{id}/publish
     * Transition job status to ACTIVE.
     */
    @PatchMapping("/{id}/publish")
    public ResponseEntity<JobResponse> publishJob(
            @PathVariable Long id,
            @RequestHeader(name = "X-Recruiter-Email", required = false) String recruiterEmail,
            @RequestHeader(name = "X-Recruiter-Id", required = false) Long recruiterId) {
        JobResponse publishedJob = jobService.publishJob(id, recruiterEmail, recruiterId);
        return ResponseEntity.ok(publishedJob);
    }

    /**
     * PATCH /jobs/{id}/close
     * Transition job status to CLOSED.
     */
    @PatchMapping("/{id}/close")
    public ResponseEntity<JobResponse> closeJob(
            @PathVariable Long id,
            @RequestHeader(name = "X-Recruiter-Email", required = false) String recruiterEmail,
            @RequestHeader(name = "X-Recruiter-Id", required = false) Long recruiterId) {
        JobResponse closedJob = jobService.closeJob(id, recruiterEmail, recruiterId);
        return ResponseEntity.ok(closedJob);
    }

    /**
     * DELETE /jobs/{id}
     * Permanently delete a job requisition.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(
            @PathVariable Long id,
            @RequestHeader(name = "X-Recruiter-Email", required = false) String recruiterEmail,
            @RequestHeader(name = "X-Recruiter-Id", required = false) Long recruiterId) {
        jobService.deleteJob(id, recruiterEmail, recruiterId);
        return ResponseEntity.noContent().build();
    }
}
