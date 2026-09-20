package com.talentpulse.application.service;

import com.talentpulse.application.dto.ApplicationResponse;
import com.talentpulse.application.dto.CreateApplicationRequest;
import com.talentpulse.application.dto.UpdateApplicationStatusRequest;
import com.talentpulse.application.entity.Application;
import com.talentpulse.application.entity.ApplicationStatus;
import com.talentpulse.application.exception.DuplicateApplicationException;
import com.talentpulse.application.exception.ResourceNotFoundException;
import com.talentpulse.application.exception.UnauthorizedApplicationAccessException;
import com.talentpulse.application.repository.ApplicationRepository;
import com.talentpulse.application.service.impl.ApplicationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplicationServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @InjectMocks
    private ApplicationServiceImpl applicationService;

    private CreateApplicationRequest createRequest;
    private Application mockApplication;

    @BeforeEach
    void setUp() {
        createRequest = new CreateApplicationRequest();
        createRequest.setJobId(101L);
        createRequest.setJobTitle("Senior Full Stack Developer");
        createRequest.setCompanyName("CloudPulse Technologies");
        createRequest.setCandidateId(1L);
        createRequest.setCandidateEmail("seeker@talentpulse.com");
        createRequest.setCandidateName("Alex Morgan");
        createRequest.setRecruiterId(2L);
        createRequest.setRecruiterEmail("recruiter@talentpulse.com");
        createRequest.setResumeReference("Alex_Morgan_Resume.pdf");
        createRequest.setCoverLetter("Passionate developer looking to make an impact.");
        createRequest.setNotes("Portfolio enclosed.");

        mockApplication = new Application();
        mockApplication.setId(1L);
        mockApplication.setJobId(101L);
        mockApplication.setJobTitle("Senior Full Stack Developer");
        mockApplication.setCompanyName("CloudPulse Technologies");
        mockApplication.setCandidateId(1L);
        mockApplication.setCandidateEmail("seeker@talentpulse.com");
        mockApplication.setCandidateName("Alex Morgan");
        mockApplication.setRecruiterId(2L);
        mockApplication.setRecruiterEmail("recruiter@talentpulse.com");
        mockApplication.setAppliedDate(LocalDateTime.now());
        mockApplication.setStatus(ApplicationStatus.APPLIED);
        mockApplication.setResumeReference("Alex_Morgan_Resume.pdf");
        mockApplication.setCoverLetter("Passionate developer looking to make an impact.");
        mockApplication.setNotes("Portfolio enclosed.");
    }

    @Test
    void testCreateApplication_Success() {
        when(applicationRepository.existsByJobIdAndCandidateId(101L, 1L)).thenReturn(false);
        when(applicationRepository.existsByJobIdAndCandidateEmail(101L, "seeker@talentpulse.com")).thenReturn(false);
        when(applicationRepository.save(any(Application.class))).thenReturn(mockApplication);

        ApplicationResponse response = applicationService.createApplication(createRequest, null, null);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(101L, response.getJobId());
        assertEquals("Senior Full Stack Developer", response.getJobTitle());
        assertEquals(ApplicationStatus.APPLIED, response.getStatus());
        assertEquals("seeker@talentpulse.com", response.getCandidateEmail());
        verify(applicationRepository, times(1)).save(any(Application.class));
    }

    @Test
    void testCreateApplication_DuplicateThrowsException() {
        when(applicationRepository.existsByJobIdAndCandidateId(101L, 1L)).thenReturn(true);

        DuplicateApplicationException ex = assertThrows(DuplicateApplicationException.class, () ->
                applicationService.createApplication(createRequest, null, null)
        );

        assertEquals("You have already applied for this job.", ex.getMessage());
        verify(applicationRepository, never()).save(any(Application.class));
    }

    @Test
    void testGetApplicationById_Success() {
        when(applicationRepository.findById(1L)).thenReturn(Optional.of(mockApplication));

        ApplicationResponse response = applicationService.getApplicationById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Senior Full Stack Developer", response.getJobTitle());
    }

    @Test
    void testGetApplicationById_NotFound() {
        when(applicationRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () ->
                applicationService.getApplicationById(999L)
        );
    }

    @Test
    void testGetCandidateApplications() {
        when(applicationRepository.findByCandidateId(1L)).thenReturn(List.of(mockApplication));

        List<ApplicationResponse> results = applicationService.getCandidateApplications(1L, null, null);

        assertEquals(1, results.size());
        assertEquals("Alex Morgan", results.get(0).getCandidateName());
    }

    @Test
    void testGetRecruiterApplications() {
        when(applicationRepository.findByRecruiterId(2L)).thenReturn(List.of(mockApplication));

        List<ApplicationResponse> results = applicationService.getRecruiterApplications(2L, null, null);

        assertEquals(1, results.size());
        assertEquals("CloudPulse Technologies", results.get(0).getCompanyName());
    }

    @Test
    void testGetJobApplications() {
        when(applicationRepository.findByJobId(101L)).thenReturn(List.of(mockApplication));

        List<ApplicationResponse> results = applicationService.getJobApplications(101L, null);

        assertEquals(1, results.size());
        assertEquals(101L, results.get(0).getJobId());
    }

    @Test
    void testUpdateApplicationStatus_Success() {
        when(applicationRepository.findById(1L)).thenReturn(Optional.of(mockApplication));
        when(applicationRepository.save(any(Application.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UpdateApplicationStatusRequest updateRequest = new UpdateApplicationStatusRequest(
                ApplicationStatus.SHORTLISTED,
                "Strong candidate, proceed to technical interview."
        );

        ApplicationResponse response = applicationService.updateApplicationStatus(1L, updateRequest, "recruiter@talentpulse.com", 2L);

        assertNotNull(response);
        assertEquals(ApplicationStatus.SHORTLISTED, response.getStatus());
        assertEquals("Strong candidate, proceed to technical interview.", response.getNotes());
    }

    @Test
    void testUpdateApplicationStatus_Unauthorized() {
        when(applicationRepository.findById(1L)).thenReturn(Optional.of(mockApplication));

        UpdateApplicationStatusRequest updateRequest = new UpdateApplicationStatusRequest(ApplicationStatus.UNDER_REVIEW);

        assertThrows(UnauthorizedApplicationAccessException.class, () ->
                applicationService.updateApplicationStatus(1L, updateRequest, "other_recruiter@talentpulse.com", 99L)
        );
    }
}
