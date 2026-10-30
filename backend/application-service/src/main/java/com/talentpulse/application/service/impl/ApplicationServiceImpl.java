package com.talentpulse.application.service.impl;

import com.talentpulse.application.dto.ApplicationResponse;
import com.talentpulse.application.dto.CreateApplicationRequest;
import com.talentpulse.application.dto.UpdateApplicationStatusRequest;
import com.talentpulse.application.entity.Application;
import com.talentpulse.application.entity.ApplicationStatus;
import com.talentpulse.application.exception.DuplicateApplicationException;
import com.talentpulse.application.exception.ResourceNotFoundException;
import com.talentpulse.application.exception.UnauthorizedApplicationAccessException;
import com.talentpulse.application.repository.ApplicationRepository;
import com.talentpulse.application.security.UserPrincipal;
import com.talentpulse.application.service.ApplicationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationRepository applicationRepository;

    public ApplicationServiceImpl(ApplicationRepository applicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    @Override
    public ApplicationResponse createApplication(CreateApplicationRequest request, String candidateEmail, Long candidateId) {
        UserPrincipal principal = UserPrincipal.getAuthenticatedPrincipal();
        boolean isAdmin = principal != null && "ADMIN".equalsIgnoreCase(principal.getRole());

        String effectiveEmail = (!isAdmin && principal != null)
                ? principal.getEmail()
                : (candidateEmail != null && !candidateEmail.trim().isEmpty() ? candidateEmail.trim().toLowerCase() : (request.getCandidateEmail() != null ? request.getCandidateEmail().trim().toLowerCase() : null));

        Long effectiveCandidateId = (!isAdmin && principal != null && principal.getUserId() != null)
                ? principal.getUserId()
                : (candidateId != null ? candidateId : request.getCandidateId());

        if (effectiveCandidateId == null) {
            throw new IllegalArgumentException("Candidate ID is required to create an application.");
        }
        if (effectiveEmail == null || effectiveEmail.isEmpty()) {
            throw new IllegalArgumentException("Candidate email is required to create an application.");
        }
        if (request.getJobId() == null) {
            throw new IllegalArgumentException("Job ID is required to create an application.");
        }

        // Duplicate Application Detection (Critical Rule: Candidate cannot apply to same job more than once)
        if (applicationRepository.existsByJobIdAndCandidateId(request.getJobId(), effectiveCandidateId)) {
            throw new DuplicateApplicationException("You have already applied for this job.");
        }

        if (applicationRepository.existsByJobIdAndCandidateEmail(request.getJobId(), effectiveEmail)) {
            throw new DuplicateApplicationException("You have already applied for this job.");
        }

        Application application = new Application();
        application.setJobId(request.getJobId());
        application.setJobTitle(request.getJobTitle());
        application.setCompanyName(request.getCompanyName());
        application.setCandidateId(effectiveCandidateId);
        application.setCandidateEmail(effectiveEmail);
        application.setCandidateName(request.getCandidateName());
        application.setRecruiterId(request.getRecruiterId());
        application.setRecruiterEmail(request.getRecruiterEmail() != null ? request.getRecruiterEmail().trim().toLowerCase() : null);
        application.setResumeReference(request.getResumeReference());
        application.setCoverLetter(request.getCoverLetter());
        application.setNotes(request.getNotes());

        // System-managed fields: Initial status = APPLIED, appliedDate = current timestamp
        application.setStatus(ApplicationStatus.APPLIED);
        application.setAppliedDate(LocalDateTime.now());

        Application savedApplication = applicationRepository.save(application);
        return ApplicationResponse.fromEntity(savedApplication);
    }

    @Override
    @Transactional(readOnly = true)
    public ApplicationResponse getApplicationById(Long id) {
        Application application = findApplicationEntityById(id);

        UserPrincipal principal = UserPrincipal.getAuthenticatedPrincipal();
        if (principal != null) {
            boolean isAdmin = "ADMIN".equalsIgnoreCase(principal.getRole());
            boolean isCandidateOwner = application.getCandidateEmail() != null
                    && application.getCandidateEmail().equalsIgnoreCase(principal.getEmail());
            boolean isCandidateIdMatch = principal.getUserId() != null && application.getCandidateId() != null
                    && application.getCandidateId().equals(principal.getUserId());
            boolean isRecruiterOwner = application.getRecruiterEmail() != null
                    && application.getRecruiterEmail().equalsIgnoreCase(principal.getEmail());
            boolean isRecruiterIdMatch = principal.getUserId() != null && application.getRecruiterId() != null
                    && application.getRecruiterId().equals(principal.getUserId());

            if (!isAdmin && !isCandidateOwner && !isCandidateIdMatch && !isRecruiterOwner && !isRecruiterIdMatch) {
                throw new UnauthorizedApplicationAccessException("You do not have permission to view this application.");
            }
        }

        return ApplicationResponse.fromEntity(application);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getCandidateApplications(Long candidateId, String candidateEmail, ApplicationStatus status) {
        UserPrincipal principal = UserPrincipal.getAuthenticatedPrincipal();
        boolean isAdmin = principal != null && "ADMIN".equalsIgnoreCase(principal.getRole());

        String effectiveEmail = (!isAdmin && principal != null) ? principal.getEmail() : candidateEmail;
        Long effectiveId = (!isAdmin && principal != null && principal.getUserId() != null) ? principal.getUserId() : candidateId;

        List<Application> applications;
        if (effectiveId != null) {
            if (status != null) {
                applications = applicationRepository.findByCandidateIdAndStatus(effectiveId, status);
            } else {
                applications = applicationRepository.findByCandidateId(effectiveId);
            }
        } else if (effectiveEmail != null && !effectiveEmail.trim().isEmpty()) {
            String email = effectiveEmail.trim().toLowerCase();
            if (status != null) {
                applications = applicationRepository.findByCandidateEmailAndStatus(email, status);
            } else {
                applications = applicationRepository.findByCandidateEmail(email);
            }
        } else if (isAdmin) {
            applications = applicationRepository.findAll();
        } else {
            applications = Collections.emptyList();
        }

        return applications.stream()
                .map(ApplicationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getRecruiterApplications(Long recruiterId, String recruiterEmail, ApplicationStatus status) {
        UserPrincipal principal = UserPrincipal.getAuthenticatedPrincipal();
        boolean isAdmin = principal != null && "ADMIN".equalsIgnoreCase(principal.getRole());

        String effectiveEmail = (!isAdmin && principal != null) ? principal.getEmail() : recruiterEmail;
        Long effectiveId = (!isAdmin && principal != null && principal.getUserId() != null) ? principal.getUserId() : recruiterId;

        List<Application> applications;
        if (effectiveId != null) {
            if (status != null) {
                applications = applicationRepository.findByRecruiterIdAndStatus(effectiveId, status);
            } else {
                applications = applicationRepository.findByRecruiterId(effectiveId);
            }
        } else if (effectiveEmail != null && !effectiveEmail.trim().isEmpty()) {
            String email = effectiveEmail.trim().toLowerCase();
            if (status != null) {
                applications = applicationRepository.findByRecruiterEmailAndStatus(email, status);
            } else {
                applications = applicationRepository.findByRecruiterEmail(email);
            }
        } else if (isAdmin) {
            applications = applicationRepository.findAll();
        } else {
            applications = Collections.emptyList();
        }

        return applications.stream()
                .map(ApplicationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getJobApplications(Long jobId, ApplicationStatus status) {
        if (jobId == null) {
            throw new IllegalArgumentException("Job ID is required.");
        }

        List<Application> applications;
        if (status != null) {
            applications = applicationRepository.findByJobIdAndStatus(jobId, status);
        } else {
            applications = applicationRepository.findByJobId(jobId);
        }

        return applications.stream()
                .map(ApplicationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public ApplicationResponse updateApplicationStatus(Long id, UpdateApplicationStatusRequest request, String recruiterEmail, Long recruiterId) {
        Application application = findApplicationEntityById(id);
        verifyRecruiterOwnership(application, recruiterEmail, recruiterId);

        if (request.getStatus() == null) {
            throw new IllegalArgumentException("Application status is required.");
        }

        application.setStatus(request.getStatus());

        if (request.getNotes() != null && !request.getNotes().trim().isEmpty()) {
            application.setNotes(request.getNotes().trim());
        }

        Application updatedApplication = applicationRepository.save(application);
        return ApplicationResponse.fromEntity(updatedApplication);
    }

    @Override
    public void deleteApplication(Long id, String recruiterEmail, Long recruiterId) {
        Application application = findApplicationEntityById(id);
        verifyRecruiterOwnership(application, recruiterEmail, recruiterId);
        applicationRepository.delete(application);
    }

    private Application findApplicationEntityById(Long id) {
        if (id == null) {
            throw new IllegalArgumentException("Application ID is required.");
        }
        return applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with ID: " + id));
    }

    private void verifyRecruiterOwnership(Application application, String requesterEmail, Long requesterId) {
        UserPrincipal principal = UserPrincipal.getAuthenticatedPrincipal();
        if (principal != null && "ADMIN".equalsIgnoreCase(principal.getRole())) {
            return; // Admins have platform-wide modification authorization
        }

        String effectiveEmail = (principal != null) ? principal.getEmail() : requesterEmail;
        Long effectiveId = (principal != null && principal.getUserId() != null) ? principal.getUserId() : requesterId;

        if (effectiveEmail == null && effectiveId == null) {
            throw new UnauthorizedApplicationAccessException("Authentication is required to perform this action.");
        }

        boolean emailMatches = effectiveEmail != null && application.getRecruiterEmail() != null
                && application.getRecruiterEmail().equalsIgnoreCase(effectiveEmail.trim());
        boolean idMatches = effectiveId != null && application.getRecruiterId() != null
                && application.getRecruiterId().equals(effectiveId);

        if (!emailMatches && !idMatches) {
            throw new UnauthorizedApplicationAccessException("You do not have permission to modify this application.");
        }
    }
}
