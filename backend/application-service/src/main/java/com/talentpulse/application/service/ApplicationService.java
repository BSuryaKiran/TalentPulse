package com.talentpulse.application.service;

import com.talentpulse.application.dto.CreateApplicationRequest;
import com.talentpulse.application.dto.ApplicationResponse;
import com.talentpulse.application.dto.UpdateApplicationStatusRequest;
import com.talentpulse.application.entity.ApplicationStatus;
import java.util.List;

public interface ApplicationService {

    ApplicationResponse createApplication(CreateApplicationRequest request, String candidateEmail, Long candidateId);

    ApplicationResponse getApplicationById(Long id);

    List<ApplicationResponse> getCandidateApplications(Long candidateId, String candidateEmail, ApplicationStatus status);

    List<ApplicationResponse> getRecruiterApplications(Long recruiterId, String recruiterEmail, ApplicationStatus status);

    List<ApplicationResponse> getJobApplications(Long jobId, ApplicationStatus status);

    ApplicationResponse updateApplicationStatus(Long id, UpdateApplicationStatusRequest request, String recruiterEmail, Long recruiterId);

    void deleteApplication(Long id, String recruiterEmail, Long recruiterId);
}
