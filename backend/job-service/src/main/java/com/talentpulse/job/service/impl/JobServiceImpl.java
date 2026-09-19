package com.talentpulse.job.service.impl;

import com.talentpulse.job.dto.CreateJobRequest;
import com.talentpulse.job.dto.JobResponse;
import com.talentpulse.job.dto.UpdateJobRequest;
import com.talentpulse.job.entity.EmploymentType;
import com.talentpulse.job.entity.Job;
import com.talentpulse.job.entity.JobStatus;
import com.talentpulse.job.entity.WorkMode;
import com.talentpulse.job.exception.ResourceNotFoundException;
import com.talentpulse.job.exception.UnauthorizedJobAccessException;
import com.talentpulse.job.repository.JobRepository;
import com.talentpulse.job.service.JobService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class JobServiceImpl implements JobService {

    private final JobRepository jobRepository;

    public JobServiceImpl(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    @Override
    public JobResponse createJob(CreateJobRequest request, String recruiterEmail, Long recruiterId) {
        String effectiveEmail = (recruiterEmail != null && !recruiterEmail.trim().isEmpty())
                ? recruiterEmail.trim().toLowerCase()
                : (request.getRecruiterEmail() != null ? request.getRecruiterEmail().trim().toLowerCase() : "recruiter@talentpulse.com");

        Long effectiveId = (recruiterId != null) ? recruiterId : request.getRecruiterId();

        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setCompanyName(request.getCompanyName());
        job.setDescription(request.getDescription());
        job.setEmploymentType(EmploymentType.fromString(request.getEmploymentType()));
        job.setWorkMode(WorkMode.fromString(request.getWorkMode()));
        job.setLocation(request.getLocation());
        job.setExperience(request.getExperience());
        job.setSalary(request.getSalary());
        job.setApplicationDeadline(request.getApplicationDeadline());
        job.setRequiredSkills(request.getRequiredSkills());
        job.setQualifications(request.getQualifications());
        job.setResponsibilities(request.getResponsibilities());
        job.setBenefits(request.getBenefits());
        job.setAdditionalInformation(request.getAdditionalInformation());
        job.setPostedDate(LocalDateTime.now());
        job.setApplicantCount(0);
        job.setRecruiterId(effectiveId);
        job.setRecruiterEmail(effectiveEmail);

        // Determine Status
        JobStatus targetStatus = request.getStatus() != null ? request.getStatus() : JobStatus.DRAFT;
        if (targetStatus == JobStatus.ACTIVE) {
            validatePublishRequirements(job);
        }
        job.setStatus(targetStatus);

        Job savedJob = jobRepository.save(job);
        return JobResponse.fromEntity(savedJob);
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponse> getAllJobs() {
        return jobRepository.findAll().stream()
                .map(JobResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponse> getActiveJobs() {
        return jobRepository.findByStatus(JobStatus.ACTIVE).stream()
                .map(JobResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public JobResponse getJobById(Long id) {
        Job job = findJobEntityById(id);
        return JobResponse.fromEntity(job);
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobResponse> getRecruiterJobs(String recruiterEmail, Long recruiterId) {
        if (recruiterEmail != null && !recruiterEmail.trim().isEmpty()) {
            return jobRepository.findByRecruiterEmail(recruiterEmail.trim().toLowerCase()).stream()
                    .map(JobResponse::fromEntity)
                    .collect(Collectors.toList());
        }
        if (recruiterId != null) {
            return jobRepository.findByRecruiterId(recruiterId).stream()
                    .map(JobResponse::fromEntity)
                    .collect(Collectors.toList());
        }
        // Fallback default recruiter demo email
        return jobRepository.findByRecruiterEmail("recruiter@talentpulse.com").stream()
                .map(JobResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public JobResponse updateJob(Long id, UpdateJobRequest request, String recruiterEmail, Long recruiterId) {
        Job job = findJobEntityById(id);
        verifyOwnership(job, recruiterEmail, recruiterId);

        job.setTitle(request.getTitle());
        job.setCompanyName(request.getCompanyName());
        job.setDescription(request.getDescription());
        job.setEmploymentType(EmploymentType.fromString(request.getEmploymentType()));
        job.setWorkMode(WorkMode.fromString(request.getWorkMode()));
        job.setLocation(request.getLocation());
        job.setExperience(request.getExperience());
        job.setSalary(request.getSalary());
        job.setApplicationDeadline(request.getApplicationDeadline());
        job.setRequiredSkills(request.getRequiredSkills());
        job.setQualifications(request.getQualifications());
        job.setResponsibilities(request.getResponsibilities());
        job.setBenefits(request.getBenefits());
        job.setAdditionalInformation(request.getAdditionalInformation());

        if (request.getStatus() != null) {
            if (request.getStatus() == JobStatus.ACTIVE) {
                validatePublishRequirements(job);
            }
            job.setStatus(request.getStatus());
        }

        Job updatedJob = jobRepository.save(job);
        return JobResponse.fromEntity(updatedJob);
    }

    @Override
    public JobResponse publishJob(Long id, String recruiterEmail, Long recruiterId) {
        Job job = findJobEntityById(id);
        verifyOwnership(job, recruiterEmail, recruiterId);
        validatePublishRequirements(job);

        job.setStatus(JobStatus.ACTIVE);
        Job publishedJob = jobRepository.save(job);
        return JobResponse.fromEntity(publishedJob);
    }

    @Override
    public JobResponse closeJob(Long id, String recruiterEmail, Long recruiterId) {
        Job job = findJobEntityById(id);
        verifyOwnership(job, recruiterEmail, recruiterId);

        job.setStatus(JobStatus.CLOSED);
        Job closedJob = jobRepository.save(job);
        return JobResponse.fromEntity(closedJob);
    }

    @Override
    public void deleteJob(Long id, String recruiterEmail, Long recruiterId) {
        Job job = findJobEntityById(id);
        verifyOwnership(job, recruiterEmail, recruiterId);
        jobRepository.delete(job);
    }

    private Job findJobEntityById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job requisition not found with ID: " + id));
    }

    private void verifyOwnership(Job job, String requesterEmail, Long requesterId) {
        // Dev / Gateway header check for recruiter ownership
        if (requesterEmail != null && !requesterEmail.trim().isEmpty()) {
            if (!job.getRecruiterEmail().equalsIgnoreCase(requesterEmail.trim())) {
                throw new UnauthorizedJobAccessException("You do not have permission to modify this job requisition.");
            }
            return;
        }
        if (requesterId != null && job.getRecruiterId() != null) {
            if (!job.getRecruiterId().equals(requesterId)) {
                throw new UnauthorizedJobAccessException("You do not have permission to modify this job requisition.");
            }
        }
        // In development without security headers set, default to allow if not explicitly mismatched
    }

    private void validatePublishRequirements(Job job) {
        if (job.getTitle() == null || job.getTitle().trim().isEmpty()) {
            throw new IllegalStateException("Cannot publish job: Title is required.");
        }
        if (job.getCompanyName() == null || job.getCompanyName().trim().isEmpty()) {
            throw new IllegalStateException("Cannot publish job: Company name is required.");
        }
        if (job.getDescription() == null || job.getDescription().trim().isEmpty()) {
            throw new IllegalStateException("Cannot publish job: Description is required.");
        }
        if (job.getApplicationDeadline() != null && job.getApplicationDeadline().isBefore(LocalDate.now())) {
            throw new IllegalStateException("Cannot publish job: Application deadline cannot be in the past.");
        }
    }
}
