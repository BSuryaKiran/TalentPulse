package com.talentpulse.application.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.talentpulse.application.dto.ApplicationResponse;
import com.talentpulse.application.dto.CreateApplicationRequest;
import com.talentpulse.application.dto.UpdateApplicationStatusRequest;
import com.talentpulse.application.entity.ApplicationStatus;
import com.talentpulse.application.exception.DuplicateApplicationException;
import com.talentpulse.application.exception.ResourceNotFoundException;
import com.talentpulse.application.service.ApplicationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ApplicationController.class)
class ApplicationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private ApplicationService applicationService;

    private CreateApplicationRequest validCreateRequest;
    private ApplicationResponse mockResponse;

    @BeforeEach
    void setUp() {
        validCreateRequest = new CreateApplicationRequest();
        validCreateRequest.setJobId(101L);
        validCreateRequest.setJobTitle("Senior Frontend Engineer");
        validCreateRequest.setCompanyName("CloudPulse Technologies");
        validCreateRequest.setCandidateId(1L);
        validCreateRequest.setCandidateEmail("seeker@talentpulse.com");
        validCreateRequest.setCandidateName("Alex Morgan");
        validCreateRequest.setRecruiterId(2L);
        validCreateRequest.setRecruiterEmail("recruiter@talentpulse.com");

        mockResponse = new ApplicationResponse();
        mockResponse.setId(1L);
        mockResponse.setJobId(101L);
        mockResponse.setJobTitle("Senior Frontend Engineer");
        mockResponse.setCompanyName("CloudPulse Technologies");
        mockResponse.setCandidateId(1L);
        mockResponse.setCandidateEmail("seeker@talentpulse.com");
        mockResponse.setCandidateName("Alex Morgan");
        mockResponse.setRecruiterId(2L);
        mockResponse.setRecruiterEmail("recruiter@talentpulse.com");
        mockResponse.setStatus(ApplicationStatus.APPLIED);
        mockResponse.setAppliedDate(LocalDateTime.now());
    }

    @Test
    void testCreateApplication_Returns201() throws Exception {
        when(applicationService.createApplication(any(CreateApplicationRequest.class), any(), any()))
                .thenReturn(mockResponse);

        mockMvc.perform(post("/applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validCreateRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.jobTitle").value("Senior Frontend Engineer"))
                .andExpect(jsonPath("$.status").value("APPLIED"));
    }

    @Test
    void testCreateApplication_DuplicateReturns409Conflict() throws Exception {
        when(applicationService.createApplication(any(CreateApplicationRequest.class), any(), any()))
                .thenThrow(new DuplicateApplicationException("You have already applied for this job."));

        mockMvc.perform(post("/applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validCreateRequest)))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.status").value(409))
                .andExpect(jsonPath("$.message").value("You have already applied for this job."));
    }

    @Test
    void testCreateApplication_ValidationFailureReturns400() throws Exception {
        CreateApplicationRequest invalidRequest = new CreateApplicationRequest();
        // Missing required fields

        mockMvc.perform(post("/applications")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.fieldErrors").exists());
    }

    @Test
    void testGetApplicationById_Returns200() throws Exception {
        when(applicationService.getApplicationById(1L)).thenReturn(mockResponse);

        mockMvc.perform(get("/applications/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.candidateName").value("Alex Morgan"));
    }

    @Test
    void testGetApplicationById_NotFoundReturns404() throws Exception {
        when(applicationService.getApplicationById(999L))
                .thenThrow(new ResourceNotFoundException("Application not found with ID: 999"));

        mockMvc.perform(get("/applications/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Application not found with ID: 999"));
    }

    @Test
    void testGetApplicationsByCandidateId_Returns200() throws Exception {
        when(applicationService.getCandidateApplications(eq(1L), any(), any()))
                .thenReturn(List.of(mockResponse));

        mockMvc.perform(get("/applications/candidate/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].candidateEmail").value("seeker@talentpulse.com"));
    }

    @Test
    void testGetApplicationsByRecruiterId_Returns200() throws Exception {
        when(applicationService.getRecruiterApplications(eq(2L), any(), any()))
                .thenReturn(List.of(mockResponse));

        mockMvc.perform(get("/applications/recruiter/2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].recruiterId").value(2L));
    }

    @Test
    void testGetApplicationsByJobId_Returns200() throws Exception {
        when(applicationService.getJobApplications(eq(101L), any()))
                .thenReturn(List.of(mockResponse));

        mockMvc.perform(get("/applications/job/101"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1))
                .andExpect(jsonPath("$[0].jobId").value(101L));
    }

    @Test
    void testUpdateStatus_Returns200() throws Exception {
        mockResponse.setStatus(ApplicationStatus.SHORTLISTED);
        UpdateApplicationStatusRequest updateRequest = new UpdateApplicationStatusRequest(ApplicationStatus.SHORTLISTED);

        when(applicationService.updateApplicationStatus(eq(1L), any(UpdateApplicationStatusRequest.class), any(), any()))
                .thenReturn(mockResponse);

        mockMvc.perform(patch("/applications/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SHORTLISTED"));
    }
}
