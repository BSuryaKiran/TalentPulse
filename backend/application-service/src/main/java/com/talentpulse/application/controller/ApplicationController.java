package com.talentpulse.application.controller;

import com.talentpulse.application.dto.ApplicationResponse;
import com.talentpulse.application.dto.CreateApplicationRequest;
import com.talentpulse.application.dto.UpdateApplicationStatusRequest;
import com.talentpulse.application.entity.ApplicationStatus;
import com.talentpulse.application.security.UserPrincipal;
import com.talentpulse.application.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
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
     * Restricted to JOB_SEEKER or ADMIN.
     * Enforces authenticated identity and prevents duplicate submissions.
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('JOB_SEEKER', 'ADMIN')")
    public ResponseEntity<ApplicationResponse> createApplication(
            @Valid @RequestBody CreateApplicationRequest request,
            @RequestHeader(name = "X-Candidate-Email", required = false) String candidateEmail,
            @RequestHeader(name = "X-Candidate-Id", required = false) Long candidateId,
            Authentication authentication) {
        UserPrincipal principal = extractPrincipal(authentication);
        boolean isAdmin = principal != null && "ADMIN".equalsIgnoreCase(principal.getRole());

        String effectiveEmail = (!isAdmin && principal != null)
                ? principal.getEmail()
                : (candidateEmail != null && !candidateEmail.trim().isEmpty() ? candidateEmail : (principal != null ? principal.getEmail() : null));

        Long effectiveCandidateId = (!isAdmin && principal != null && principal.getUserId() != null)
                ? principal.getUserId()
                : candidateId;

        ApplicationResponse response = applicationService.createApplication(request, effectiveEmail, effectiveCandidateId);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * GET /applications/{id}
     * Retrieve single application record by ID.
     * Enforces that requester is either the candidate owner, the recruiter owner, or ADMIN.
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApplicationResponse> getApplicationById(@PathVariable Long id) {
        ApplicationResponse response = applicationService.getApplicationById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /applications/candidate/{candidateId}
     * Retrieve applications submitted by a specific candidate ID.
     * Restricted to JOB_SEEKER (matching own ID) or ADMIN.
     */
    @GetMapping("/candidate/{candidateId}")
    @PreAuthorize("hasAnyRole('JOB_SEEKER', 'ADMIN')")
    public ResponseEntity<List<ApplicationResponse>> getApplicationsByCandidateId(
            @PathVariable Long candidateId,
            @RequestParam(required = false) ApplicationStatus status,
            Authentication authentication) {
        UserPrincipal principal = extractPrincipal(authentication);
        boolean isAdmin = principal != null && "ADMIN".equalsIgnoreCase(principal.getRole());

        Long effectiveId = (!isAdmin && principal != null && principal.getUserId() != null)
                ? principal.getUserId()
                : candidateId;

        List<ApplicationResponse> responses = applicationService.getCandidateApplications(effectiveId, null, status);
        return ResponseEntity.ok(responses);
    }

    /**
     * GET /applications/candidate
     * Retrieve applications for candidate by authenticated context.
     * If caller is JOB_SEEKER, forces candidate query to authenticated identity.
     */
    @GetMapping("/candidate")
    @PreAuthorize("hasAnyRole('JOB_SEEKER', 'ADMIN')")
    public ResponseEntity<List<ApplicationResponse>> getApplicationsByCandidateContext(
            @RequestParam(required = false) Long candidateId,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) ApplicationStatus status,
            @RequestHeader(name = "X-Candidate-Email", required = false) String headerEmail,
            @RequestHeader(name = "X-Candidate-Id", required = false) Long headerId,
            Authentication authentication) {
        UserPrincipal principal = extractPrincipal(authentication);
        boolean isAdmin = principal != null && "ADMIN".equalsIgnoreCase(principal.getRole());

        Long effectiveId = (!isAdmin && principal != null && principal.getUserId() != null)
                ? principal.getUserId()
                : (candidateId != null ? candidateId : headerId);

        String effectiveEmail = (!isAdmin && principal != null)
                ? principal.getEmail()
                : (email != null && !email.trim().isEmpty() ? email : headerEmail);

        List<ApplicationResponse> responses = applicationService.getCandidateApplications(effectiveId, effectiveEmail, status);
        return ResponseEntity.ok(responses);
    }

    /**
     * GET /applications/recruiter/{recruiterId}
     * Retrieve applications for jobs owned by a specific recruiter.
     * Restricted to RECRUITER (matching own ID) or ADMIN.
     */
    @GetMapping("/recruiter/{recruiterId}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<List<ApplicationResponse>> getApplicationsByRecruiterId(
            @PathVariable Long recruiterId,
            @RequestParam(required = false) ApplicationStatus status,
            Authentication authentication) {
        UserPrincipal principal = extractPrincipal(authentication);
        boolean isAdmin = principal != null && "ADMIN".equalsIgnoreCase(principal.getRole());

        Long effectiveId = (!isAdmin && principal != null && principal.getUserId() != null)
                ? principal.getUserId()
                : recruiterId;

        List<ApplicationResponse> responses = applicationService.getRecruiterApplications(effectiveId, null, status);
        return ResponseEntity.ok(responses);
    }

    /**
     * GET /applications/recruiter
     * Retrieve applications for recruiter scoped to authenticated recruiter.
     */
    @GetMapping("/recruiter")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<List<ApplicationResponse>> getApplicationsByRecruiterContext(
            @RequestParam(required = false) Long recruiterId,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) ApplicationStatus status,
            @RequestHeader(name = "X-Recruiter-Email", required = false) String headerEmail,
            @RequestHeader(name = "X-Recruiter-Id", required = false) Long headerId,
            Authentication authentication) {
        UserPrincipal principal = extractPrincipal(authentication);
        boolean isAdmin = principal != null && "ADMIN".equalsIgnoreCase(principal.getRole());

        Long effectiveId = (!isAdmin && principal != null && principal.getUserId() != null)
                ? principal.getUserId()
                : (recruiterId != null ? recruiterId : headerId);

        String effectiveEmail = (!isAdmin && principal != null)
                ? principal.getEmail()
                : (email != null && !email.trim().isEmpty() ? email : headerEmail);

        List<ApplicationResponse> responses = applicationService.getRecruiterApplications(effectiveId, effectiveEmail, status);
        return ResponseEntity.ok(responses);
    }

    /**
     * GET /applications/job/{jobId}
     * Retrieve all applicant submissions for a specific job requisition.
     * Restricted to RECRUITER or ADMIN.
     */
    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<List<ApplicationResponse>> getApplicationsByJobId(
            @PathVariable Long jobId,
            @RequestParam(required = false) ApplicationStatus status) {
        List<ApplicationResponse> responses = applicationService.getJobApplications(jobId, status);
        return ResponseEntity.ok(responses);
    }

    /**
     * PATCH /applications/{id}/status
     * Update application status (APPLIED, UNDER_REVIEW, SHORTLISTED, REJECTED, SELECTED).
     * Restricted to RECRUITER (who owns the job) or ADMIN.
     * Job seekers are strictly forbidden from modifying statuses.
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<ApplicationResponse> updateApplicationStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateApplicationStatusRequest request,
            @RequestHeader(name = "X-Recruiter-Email", required = false) String recruiterEmail,
            @RequestHeader(name = "X-Recruiter-Id", required = false) Long recruiterId,
            Authentication authentication) {
        UserPrincipal principal = extractPrincipal(authentication);
        String effectiveEmail = (principal != null) ? principal.getEmail() : recruiterEmail;
        Long effectiveId = (principal != null && principal.getUserId() != null) ? principal.getUserId() : recruiterId;

        ApplicationResponse response = applicationService.updateApplicationStatus(id, request, effectiveEmail, effectiveId);
        return ResponseEntity.ok(response);
    }

    /**
     * DELETE /applications/{id}
     * Remove an application record if authorized (Recruiter job owner or Admin).
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    public ResponseEntity<Void> deleteApplication(
            @PathVariable Long id,
            @RequestHeader(name = "X-Recruiter-Email", required = false) String recruiterEmail,
            @RequestHeader(name = "X-Recruiter-Id", required = false) Long recruiterId,
            Authentication authentication) {
        UserPrincipal principal = extractPrincipal(authentication);
        String effectiveEmail = (principal != null) ? principal.getEmail() : recruiterEmail;
        Long effectiveId = (principal != null && principal.getUserId() != null) ? principal.getUserId() : recruiterId;

        applicationService.deleteApplication(id, effectiveEmail, effectiveId);
        return ResponseEntity.noContent().build();
    }

    private UserPrincipal extractPrincipal(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof UserPrincipal) {
            return (UserPrincipal) authentication.getPrincipal();
        }
        return null;
    }
}
