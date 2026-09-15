package com.talentpulse.auth;

import com.talentpulse.auth.dto.AuthResponse;
import com.talentpulse.auth.dto.LoginRequest;
import com.talentpulse.auth.dto.RegisterRequest;
import com.talentpulse.auth.entity.Role;
import com.talentpulse.auth.entity.User;
import com.talentpulse.auth.exception.InvalidCredentialsException;
import com.talentpulse.auth.exception.UserAlreadyExistsException;
import com.talentpulse.auth.repository.UserRepository;
import com.talentpulse.auth.security.JwtService;
import com.talentpulse.auth.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.TestPropertySource;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.properties")
class AuthServiceApplicationTests {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void testSuccessfulJobSeekerRegistration() {
        RegisterRequest request = new RegisterRequest("Jane Candidate", "jane@example.com", "password123", Role.JOB_SEEKER);
        AuthResponse response = authService.register(request);

        assertNotNull(response.getToken());
        assertEquals("jane@example.com", response.getEmail());
        assertEquals(Role.JOB_SEEKER, response.getRole());

        User savedUser = userRepository.findByEmail("jane@example.com").orElseThrow();
        assertTrue(passwordEncoder.matches("password123", savedUser.getPassword()));
        assertNotEquals("password123", savedUser.getPassword());
    }

    @Test
    void testSuccessfulRecruiterRegistration() {
        RegisterRequest request = new RegisterRequest("Sam Recruiter", "sam@company.com", "recruiterPass", Role.RECRUITER);
        AuthResponse response = authService.register(request);

        assertNotNull(response.getToken());
        assertEquals(Role.RECRUITER, response.getRole());
    }

    @Test
    void testAdminRegistrationRejected() {
        RegisterRequest request = new RegisterRequest("Admin User", "admin@talentpulse.com", "adminPass123", Role.ADMIN);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> authService.register(request));
        assertTrue(exception.getMessage().contains("Admin role cannot be self-registered"));
    }

    @Test
    void testDuplicateEmailRegistrationRejected() {
        RegisterRequest request1 = new RegisterRequest("User One", "duplicate@example.com", "pass123", Role.JOB_SEEKER);
        authService.register(request1);

        RegisterRequest request2 = new RegisterRequest("User Two", "duplicate@example.com", "pass456", Role.JOB_SEEKER);
        assertThrows(UserAlreadyExistsException.class, () -> authService.register(request2));
    }

    @Test
    void testSuccessfulLogin() {
        RegisterRequest registerReq = new RegisterRequest("Login User", "login@example.com", "mySecret123", Role.JOB_SEEKER);
        authService.register(registerReq);

        LoginRequest loginReq = new LoginRequest("login@example.com", "mySecret123");
        AuthResponse response = authService.login(loginReq);

        assertNotNull(response.getToken());
        assertEquals("login@example.com", response.getEmail());
        assertTrue(jwtService.isTokenValid(response.getToken(), "login@example.com"));
    }

    @Test
    void testLoginWithIncorrectPasswordFails() {
        RegisterRequest registerReq = new RegisterRequest("User", "user@example.com", "correctPass", Role.JOB_SEEKER);
        authService.register(registerReq);

        LoginRequest loginReq = new LoginRequest("user@example.com", "wrongPass");
        assertThrows(InvalidCredentialsException.class, () -> authService.login(loginReq));
    }
}
