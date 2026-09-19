package com.talentpulse.job.service;

import com.talentpulse.job.dto.CreateJobRequest;
import com.talentpulse.job.dto.JobResponse;
import com.talentpulse.job.dto.UpdateJobRequest;
import java.util.List;

public interface JobService {

    JobResponse createJob(CreateJobRequest request, String recruiterEmail, Long recruiterId);

    List<JobResponse> getAllJobs();

    List<JobResponse> getActiveJobs();

    JobResponse getJobById(Long id);

    List<JobResponse> getRecruiterJobs(String recruiterEmail, Long recruiterId);

    JobResponse updateJob(Long id, UpdateJobRequest request, String recruiterEmail, Long recruiterId);

    JobResponse publishJob(Long id, String recruiterEmail, Long recruiterId);

    JobResponse closeJob(Long id, String recruiterEmail, Long recruiterId);

    void deleteJob(Long id, String recruiterEmail, Long recruiterId);
}
