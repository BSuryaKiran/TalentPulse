package com.talentpulse.application;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.talentpulse.application.dto.UpdateApplicationStatusRequest;
import com.talentpulse.application.entity.Application;
import com.talentpulse.application.entity.ApplicationStatus;
import com.talentpulse.application.repository.ApplicationRepository;
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
import java.time.LocalDateTime;
import java.util.Date;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
@ActiveProfiles("test")
public class ApplicationSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ApplicationRepository applicationRepository;

    private static final String SECRET_KEY = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

    private String candidateAToken;
    private String candidateBToken;
    private String recruiterAToken;
    private String recruiterBToken;

    private Application candidateBApplication;

    @BeforeEach
    void setUp() {
        applicationRepository.deleteAll();

        candidateAToken = createToken("candidateA@talentpulse.com", 101L, "JOB_SEEKER");
        candidateBToken = createToken("candidateB@talentpulse.com", 102L, "JOB_SEEKER");
        recruiterAToken = createToken("recruiterA@talentpulse.com", 201L, "RECRUITER");
        recruiterBToken = createToken("recruiterB@talentpulse.com", 202L, "RECRUITER");

        // Application submitted by Candidate B for Recruiter B's job
        candidateBApplication = new Application();
        candidateBApplication.setJobId(501L);
        candidateBApplication.setJobTitle("Cloud Architect");
        candidateBApplication.setCompanyName("CloudCorp");
        candidateBApplication.setCandidateId(102L);
        candidateBApplication.setCandidateEmail("candidateb@talentpulse.com");
        candidateBApplication.setCandidateName("Candidate B");
        candidateBApplication.setRecruiterId(202L);
        candidateBApplication.setRecruiterEmail("recruiterb@talentpulse.com");
        candidateBApplication.setStatus(ApplicationStatus.APPLIED);
        candidateBApplication.setAppliedDate(LocalDateTime.now());
        candidateBApplication = applicationRepository.save(candidateBApplication);
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
    @DisplayName("OWNERSHIP-4: Candidate A cannot view Candidate B's application record (403 Forbidden)")
    void testCandidateCannotViewOtherCandidateApplication_Returns403() throws Exception {
        mockMvc.perform(get("/applications/" + candidateBApplication.getId())
                        .header("Authorization", "Bearer " + candidateAToken))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403));
    }

    @Test
    @DisplayName("OWNERSHIP-5: Recruiter A cannot update status for Recruiter B's job application (403 Forbidden)")
    void testRecruiterCannotUpdateOtherRecruiterApplication_Returns403() throws Exception {
        UpdateApplicationStatusRequest request = new UpdateApplicationStatusRequest(ApplicationStatus.SHORTLISTED);

        mockMvc.perform(patch("/applications/" + candidateBApplication.getId() + "/status")
                        .header("Authorization", "Bearer " + recruiterAToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403));
    }

    @Test
    @DisplayName("OWNERSHIP-6: Job Seeker cannot update application status (403 Forbidden)")
    void testJobSeekerCannotUpdateStatus_Returns403() throws Exception {
        UpdateApplicationStatusRequest request = new UpdateApplicationStatusRequest(ApplicationStatus.SELECTED);

        mockMvc.perform(patch("/applications/" + candidateBApplication.getId() + "/status")
                        .header("Authorization", "Bearer " + candidateBToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403));
    }

    @Test
    @DisplayName("SEC-UNAUTH: Unauthenticated user accessing /applications returns 401 Unauthorized")
    void testUnauthenticatedAccess_Returns401() throws Exception {
        mockMvc.perform(get("/applications/candidate"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    @DisplayName("OWNERSHIP-VERIFY: Recruiter B can update status for Recruiter B's application (200 OK)")
    void testRecruiterCanUpdateOwnApplicationStatus_Returns200() throws Exception {
        UpdateApplicationStatusRequest request = new UpdateApplicationStatusRequest(ApplicationStatus.SHORTLISTED);

        mockMvc.perform(patch("/applications/" + candidateBApplication.getId() + "/status")
                        .header("Authorization", "Bearer " + recruiterBToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("SHORTLISTED"));
    }

    @Test
    @DisplayName("OWNERSHIP-VERIFY: Candidate B can view Candidate B's own application (200 OK)")
    void testCandidateCanViewOwnApplication_Returns200() throws Exception {
        mockMvc.perform(get("/applications/" + candidateBApplication.getId())
                        .header("Authorization", "Bearer " + candidateBToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.candidateName").value("Candidate B"));
    }
}
