package com.talentpulse.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.talentpulse.auth.dto.LoginRequest;
import com.talentpulse.auth.dto.RegisterRequest;
import com.talentpulse.auth.dto.UpdateProfileRequest;
import com.talentpulse.auth.entity.Role;
import com.talentpulse.auth.entity.User;
import com.talentpulse.auth.repository.UserRepository;
import com.talentpulse.auth.security.JwtService;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@TestPropertySource(locations = "classpath:application-test.properties")
@ActiveProfiles("test")
public class AuthSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    private static final String SECRET_KEY = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";

    private User candidateUser;
    private User recruiterUser;
    private String candidateToken;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        candidateUser = new User("Candidate One", "candidate@test.com", passwordEncoder.encode("Secret123!"), Role.JOB_SEEKER);
        candidateUser = userRepository.save(candidateUser);

        recruiterUser = new User("Recruiter One", "recruiter@test.com", passwordEncoder.encode("Recruiter123!"), Role.RECRUITER);
        recruiterUser = userRepository.save(recruiterUser);

        candidateToken = jwtService.generateToken(candidateUser);
    }

    @Test
    @DisplayName("AUTH-1: Valid login returns 200 OK with valid JWT token")
    void testValidLogin_ReturnsJwt() throws Exception {
        LoginRequest request = new LoginRequest("candidate@test.com", "Secret123!");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.email").value("candidate@test.com"))
                .andExpect(jsonPath("$.role").value("JOB_SEEKER"));
    }

    @Test
    @DisplayName("AUTH-2: Invalid password returns 401 Unauthorized")
    void testInvalidPassword_Returns401() throws Exception {
        LoginRequest request = new LoginRequest("candidate@test.com", "WrongPassword!");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    @DisplayName("AUTH-3: Missing token on protected endpoint /auth/me returns 401 Unauthorized")
    void testMissingToken_Returns401() throws Exception {
        mockMvc.perform(get("/auth/me"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401))
                .andExpect(jsonPath("$.error").value("Unauthorized"));
    }

    @Test
    @DisplayName("AUTH-4: Malformed token on protected endpoint returns 401 Unauthorized")
    void testMalformedToken_Returns401() throws Exception {
        mockMvc.perform(get("/auth/me")
                        .header("Authorization", "Bearer not.a.valid.jwt.token"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    @DisplayName("AUTH-5: Expired token on protected endpoint returns 401 Unauthorized")
    void testExpiredToken_Returns401() throws Exception {
        SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(SECRET_KEY));
        String expiredToken = Jwts.builder()
                .subject("candidate@test.com")
                .claim("userId", candidateUser.getId())
                .claim("role", "JOB_SEEKER")
                .issuedAt(new Date(System.currentTimeMillis() - 100000))
                .expiration(new Date(System.currentTimeMillis() - 50000))
                .signWith(key)
                .compact();

        mockMvc.perform(get("/auth/me")
                        .header("Authorization", "Bearer " + expiredToken))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    @DisplayName("AUTH-6: Tampered token with forged signature returns 401 Unauthorized")
    void testTamperedToken_Returns401() throws Exception {
        // Alter payload by replacing character
        String tamperedToken = candidateToken.substring(0, candidateToken.length() - 5) + "ABCDE";

        mockMvc.perform(get("/auth/me")
                        .header("Authorization", "Bearer " + tamperedToken))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.status").value(401));
    }

    @Test
    @DisplayName("AUTH-7: Registration attempting ADMIN role is rejected with 400 Bad Request")
    void testAdminRegistrationAttempt_RejectedWith400() throws Exception {
        RegisterRequest request = new RegisterRequest("Attacker", "hacker@test.com", "Secret123!", Role.ADMIN);

        mockMvc.perform(post("/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("Admin role cannot be self-registered")));
    }

    @Test
    @DisplayName("AUTH-8: Password is never exposed in response body")
    void testPasswordNotExposedInResponse() throws Exception {
        LoginRequest request = new LoginRequest("candidate@test.com", "Secret123!");

        mockMvc.perform(post("/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.password").doesNotExist());
    }

    @Test
    @DisplayName("OWNERSHIP-PROFILE: Candidate A cannot update Recruiter B's profile (403 Forbidden)")
    void testCandidateCannotUpdateOtherUserProfile_Returns403() throws Exception {
        UpdateProfileRequest updateReq = new UpdateProfileRequest("Hacked Name", "999", "NY", "Summary", List.of("Java"));

        mockMvc.perform(put("/profiles/" + recruiterUser.getId())
                        .header("Authorization", "Bearer " + candidateToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.status").value(403))
                .andExpect(jsonPath("$.message", containsString("cannot update another user's profile")));
    }

    @Test
    @DisplayName("OWNERSHIP-PROFILE: Candidate A can update Candidate A's own profile (200 OK)")
    void testCandidateCanUpdateOwnProfile_Returns200() throws Exception {
        UpdateProfileRequest updateReq = new UpdateProfileRequest("Updated Name", "1234567890", "San Francisco, CA", "Bio", List.of("Spring Boot", "React"));

        mockMvc.perform(put("/profiles/" + candidateUser.getId())
                        .header("Authorization", "Bearer " + candidateToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Updated Name"))
                .andExpect(jsonPath("$.phone").value("1234567890"));
    }
}
