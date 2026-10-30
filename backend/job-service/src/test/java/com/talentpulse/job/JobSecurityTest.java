package com.talentpulse.job;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.talentpulse.job.dto.CreateJobRequest;
import com.talentpulse.job.dto.UpdateJobRequest;
import com.talentpulse.job.entity.EmploymentType;
import com.talentpulse.job.entity.Job;
import com.talentpulse.job.entity.JobStatus;
import com.talentpulse.job.entity.WorkMode;
import com.talentpulse.job.repository.JobRepository;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import javax.crypto.SecretKey;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
@ActiveProfiles("test")
public class JobSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JobRepository jobRepository;

    private static final String SECRET_KEY = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

    private String jobSeekerToken;
    private String recruiterAToken;
    private String recruiterBToken;
    private String adminToken;

    private Job recruiterBJob;

    @BeforeEach
    void setUp() {
        jobRepository.deleteAll();

        jobSeekerToken = createToken("seeker@talentpulse.com", 10L, "JOB_SEEKER");
        recruiterAToken = createToken("recruiterA@talentpulse.com", 20L, "RECRUITER");
        recruiterBToken = createToken("recruiterB@talentpulse.com", 30L, "RECRUITER");
        adminToken = createToken("admin@talentpulse.com", 99L, "ADMIN");

        // Create a job owned by Recruiter B
        recruiterBJob = new Job();
        recruiterBJob.setTitle("Backend Engineer");
        recruiterBJob.setCompanyName("TechPulse Corp");
        recruiterBJob.setDescription("Java Spring Boot Developer");
        recruiterBJob.setEmploymentType(EmploymentType.FULL_TIME);
        recruiterBJob.setWorkMode(WorkMode.REMOTE);
        recruiterBJob.setLocation("Remote");
        recruiterBJob.setStatus(JobStatus.ACTIVE);
        recruiterBJob.setRecruiterId(30L);
        recruiterBJob.setRecruiterEmail("recruiterb@talentpulse.com");
        recruiterBJob.setPostedDate(LocalDateTime.now());
        recruiterBJob.setApplicationDeadline(LocalDate.now().plusMonths(1));
        recruiterBJob = jobRepository.save(recruiterBJob);
    }

    private String createToken(String email, Long userId, String role) {
        SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET_KEY));
        return Jwts.builder()
                .subject(email)
                .claim("userId", userId)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(key)
                .compact();
    }

    @Test
    @DisplayName("ROLE-1: Job Seeker accessing recruiter endpoint POST /jobs returns 403 Forbidden")
    void testJobSeekerAccessingRecruiterEndpoint_Returns403() throws Exception {
        CreateJobRequest request = new CreateJobRequest();
        request.setTitle("DevOps Lead");
        request.setCompanyName("Cloud Corp");
        request.setDescription("Kubernetes specialist");
        request.setEmploymentType("Full-time");
        request.setWorkMode("Remote");
        request.setLocation("Remote");
        request.setApplicationDeadline(LocalDate.now().plusDays(30));

        mockMvc.perform(post("/jobs")
                        .header("Authorization", "Bearer " + jobSeekerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403));
    }

    @Test
    @DisplayName("ROLE-2: Job Seeker accessing admin endpoint GET /jobs/all returns 403 Forbidden")
    void testJobSeekerAccessingAdminEndpoint_Returns403() throws Exception {
        mockMvc.perform(get("/jobs/all")
                        .header("Authorization", "Bearer " + jobSeekerToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403));
    }

    @Test
    @DisplayName("ROLE-3: Recruiter accessing admin endpoint GET /jobs/all returns 403 Forbidden")
    void testRecruiterAccessingAdminEndpoint_Returns403() throws Exception {
        mockMvc.perform(get("/jobs/all")
                        .header("Authorization", "Bearer " + recruiterAToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403));
    }

    @Test
    @DisplayName("ROLE-4: Admin accessing permitted admin endpoint GET /jobs/all returns 200 OK")
    void testAdminAccessingAdminEndpoint_Returns200() throws Exception {
        mockMvc.perform(get("/jobs/all")
                        .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @DisplayName("ROLE-5: Unauthenticated user accessing protected endpoint POST /jobs returns 401 Unauthorized")
    void testUnauthenticatedUser_Returns401() throws Exception {
        CreateJobRequest request = new CreateJobRequest();
        request.setTitle("New Job");
        request.setCompanyName("Cloud Corp");
        request.setDescription("Kubernetes specialist");
        request.setEmploymentType("Full-time");
        request.setWorkMode("Remote");
        request.setLocation("Remote");
        request.setApplicationDeadline(LocalDate.now().plusDays(30));

        mockMvc.perform(post("/jobs")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    @DisplayName("OWNERSHIP-1: Recruiter A cannot edit Recruiter B's job (403 Forbidden)")
    void testRecruiterCannotEditOtherRecruiterJob_Returns403() throws Exception {
        UpdateJobRequest updateReq = new UpdateJobRequest();
        updateReq.setTitle("Malicious Title Update");
        updateReq.setCompanyName("Hacked Co");
        updateReq.setDescription("Attempting hijack");
        updateReq.setEmploymentType("Full-time");
        updateReq.setWorkMode("Remote");
        updateReq.setLocation("Remote");
        updateReq.setApplicationDeadline(LocalDate.now().plusDays(30));

        mockMvc.perform(put("/jobs/" + recruiterBJob.getId())
                        .header("Authorization", "Bearer " + recruiterAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403));
    }

    @Test
    @DisplayName("OWNERSHIP-2: Recruiter A cannot delete Recruiter B's job (403 Forbidden)")
    void testRecruiterCannotDeleteOtherRecruiterJob_Returns403() throws Exception {
        mockMvc.perform(delete("/jobs/" + recruiterBJob.getId())
                        .header("Authorization", "Bearer " + recruiterAToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403));
    }

    @Test
    @DisplayName("OWNERSHIP-3: Recruiter A cannot close Recruiter B's job (403 Forbidden)")
    void testRecruiterCannotCloseOtherRecruiterJob_Returns403() throws Exception {
        mockMvc.perform(patch("/jobs/" + recruiterBJob.getId() + "/close")
                        .header("Authorization", "Bearer " + recruiterAToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403));
    }

    @Test
    @DisplayName("OWNERSHIP-VERIFY: Recruiter B can edit Recruiter B's own job (200 OK)")
    void testRecruiterCanEditOwnJob_Returns200() throws Exception {
        UpdateJobRequest updateReq = new UpdateJobRequest();
        updateReq.setTitle("Senior Backend Engineer");
        updateReq.setCompanyName("TechPulse Corp");
        updateReq.setDescription("Updated description");
        updateReq.setEmploymentType("FULL_TIME");
        updateReq.setWorkMode("REMOTE");
        updateReq.setLocation("Remote");
        updateReq.setApplicationDeadline(LocalDate.now().plusMonths(2));

        mockMvc.perform(put("/jobs/" + recruiterBJob.getId())
                        .header("Authorization", "Bearer " + recruiterBToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Senior Backend Engineer"));
    }
}
