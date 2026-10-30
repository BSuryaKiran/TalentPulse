# TalentPulse Review-2 Security Implementation Report

**Project:** TalentPulse – Enterprise Talent Acquisition & Job Application Tracking Portal  
**Document Version:** 1.0  
**Phase:** REVIEW-2 ENHANCEMENT — P1 (JWT Security Hardening & Backend Authorization)  
**Security Status:** Hardened & Verified  

---

## 1. Executive Summary

As part of the Review-2 rubric enhancement for **"Robust security with token validation, protected endpoints, and appropriate error handling"**, TalentPulse's security architecture was audited, refactored, and hardened across all microservices.

Prior to this enhancement, authorization checks were largely client-centric or vulnerable to client-spoofed headers (such as `X-Candidate-Email` and `X-Recruiter-Email`). The architecture has now been upgraded to enforce **defense-in-depth security** directly in the Spring Boot microservices layer. Identity claims (`userId`, `role`, `email`) are verified cryptographically via HMAC-SHA256 JWT tokens and extracted into a verified `UserPrincipal` in `SecurityContextHolder`. Client-supplied user/recruiter IDs or email headers are never trusted as proof of authorization.

---

## 2. Authentication Architecture

TalentPulse utilizes a microservices architecture coordinated by Spring Cloud Eureka and exposed through a single entry-point API Gateway.

```
+-------------------------------------------------------------------------+
|                              React Frontend                             |
|              (Axios Interceptor adds 'Authorization: Bearer <JWT>')     |
+------------------------------------+------------------------------------+
                                     |
                                     v HTTP Requests (Port 8080)
+------------------------------------+------------------------------------+
|                         Spring Cloud API Gateway                        |
|   - Preserves & forwards 'Authorization' headers to downstream services  |
|   - Exposes public routes (/auth/**) and secures API routes             |
+------------------------------------+------------------------------------+
                                     |
               +---------------------+---------------------+
               |                     |                     |
               v lb://AUTH-SERVICE   v lb://JOB-SERVICE    v lb://APPLICATION-SERVICE
+------------------------------+ +--------------------+ +-------------------------+
|         Auth Service         | |    Job Service     | |   Application Service   |
| - BCrypt Password Hashing    | | - JWT Filter       | | - JWT Filter            |
| - HMAC-SHA256 Token Issuance | | - Security Config  | | - Security Config       |
| - Profile Service Endpoints  | | - Ownership Checks | | - Ownership Checks      |
| - Custom 401/403 JSON        | | - Custom 401/403   | | - Custom 401/403 JSON   |
+------------------------------+ +--------------------+ +-------------------------+
               |                     |                     |
               +---------------------+---------------------+
                                     v
                           MySQL Database Instances
```

---

## 3. JWT Generation, Signature Validation & Claims

### 3.1 Cryptographic Algorithms & Keys
- **Signing Algorithm:** HMAC-SHA256 (`SignatureAlgorithm.HS256` / `io.jsonwebtoken.security.Keys.hmacShaKeyFor`).
- **Secret Key:** 256-bit cryptographic key loaded via environment variable `JWT_SECRET_KEY` (configured across `auth-service`, `job-service`, and `application-service`).
- **Token Validity:** Configured via `JWT_EXPIRATION_MS` (default: 86,400,000 ms / 24 hours).

### 3.2 Token Claims Payload
Every issued token contains the following verified claims:
```json
{
  "sub": "user@talentpulse.com",
  "userId": 101,
  "role": "JOB_SEEKER",
  "iat": 1793347200,
  "exp": 1793433600
}
```

### 3.3 Strict Downstream Token Validation
In each microservice (`auth-service`, `job-service`, `application-service`), incoming HTTP requests pass through `JwtAuthenticationFilter`:
1. Extracts `Authorization: Bearer <token>`.
2. Validates HMAC-SHA256 signature against the shared secret.
3. Validates token expiration (`isTokenExpired`).
4. Rejects malformed, tampered, expired, or unsupported tokens immediately.
5. Populates Spring Security's `SecurityContextHolder` with an immutable `UserPrincipal`:
   ```java
   UserPrincipal principal = new UserPrincipal(userId, email, role);
   UsernamePasswordAuthenticationToken authToken = 
       new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
   SecurityContextHolder.getContext().setAuthentication(authToken);
   ```

---

## 4. Role-Based Access Control (RBAC) Matrix

TalentPulse defines three distinct roles: `JOB_SEEKER`, `RECRUITER`, and `ADMIN`. Role-based authorization is enforced using `@PreAuthorize("hasAnyRole('...')")` and `SecurityFilterChain.authorizeHttpRequests()`.

| Service / Endpoint | HTTP Method | Permitted Roles | Description / Business Rule |
| :--- | :---: | :---: | :--- |
| **Auth Service** | | | |
| `/auth/register` | POST | Public | Registers `JOB_SEEKER` or `RECRUITER`. `ADMIN` role registration is strictly forbidden. |
| `/auth/login` | POST | Public | Authenticates credentials; returns token, role, and userId. |
| `/auth/me` | GET | Authenticated | Retrieves current authenticated profile. |
| `/profiles/{userId}` | GET | Authenticated | View profile details. |
| `/profiles/{userId}` | PUT | Owner or Admin | Update profile details. Enforces ownership (`userId == principal.userId`). |
| **Job Service** | | | |
| `/jobs` (public feed) | GET | Public | Job seekers and public can browse active job listings. |
| `/jobs/{id}` | GET | Public | View specific active job details. |
| `/jobs` | POST | `RECRUITER`, `ADMIN` | Create a job posting. Recruiter ID is bound to the token principal. |
| `/jobs/{id}` | PUT | `RECRUITER`, `ADMIN` | Edit job posting. Must be owner recruiter or admin. |
| `/jobs/{id}/publish` | PATCH | `RECRUITER`, `ADMIN` | Publish job. Must be owner recruiter or admin. |
| `/jobs/{id}/close` | PATCH | `RECRUITER`, `ADMIN` | Close job. Must be owner recruiter or admin. |
| `/jobs/{id}` | DELETE | `RECRUITER`, `ADMIN` | Delete job. Must be owner recruiter or admin. |
| `/jobs/my-jobs` | GET | `RECRUITER`, `ADMIN` | List recruiter's own jobs. |
| `/jobs/all` | GET | `ADMIN` | Platform-wide job management. Forbidden to Job Seekers and Recruiters. |
| **Application Service** | | | |
| `/applications` | POST | `JOB_SEEKER`, `ADMIN` | Apply for a job. Candidate ID and email are bound to the token principal. |
| `/applications/{id}` | GET | Owner / Recruiter / Admin | View application. Candidate can view own; recruiter can view for their job. |
| `/applications/candidate` | GET | `JOB_SEEKER`, `ADMIN` | View candidate's own application history. |
| `/applications/job/{jobId}` | GET | `RECRUITER`, `ADMIN` | View applications for a specific job. Ownership checked against recruiter. |
| `/applications/recruiter` | GET | `RECRUITER`, `ADMIN` | View applications for recruiter's jobs. |
| `/applications/{id}/status` | PATCH | `RECRUITER`, `ADMIN` | Update application status (`SHORTLISTED`, `REJECTED`, etc.). Must own job. |
| `/applications/all` | GET | `ADMIN` | Platform-wide application audit. |

---

## 5. Backend Ownership Enforcement & Anti-Spoofing

### 5.1 Anti-Spoofing Principle
Previously, downstream services relied on client headers like `X-Candidate-Email` or request payload parameters (`recruiterId`, `candidateId`). This allowed malicious users to impersonate others simply by tampering with headers or request JSON bodies.

Under the new implementation:
1. `UserPrincipal.getAuthenticatedPrincipal()` extracts the cryptographically verified user identity from `SecurityContextHolder`.
2. The authenticated `userId` and `email` override or validate any request body/param fields.
3. Ownership validation methods verify that the authenticated user actually owns the affected resource:

```java
// Job Service Ownership Check
private void verifyOwnership(Job job) {
    UserPrincipal principal = UserPrincipal.getAuthenticatedPrincipal();
    if (principal != null) {
        if ("ADMIN".equals(principal.getRole())) {
            return; // Admins are authorized
        }
        if (principal.getUserId() != null && !principal.getUserId().equals(job.getRecruiterId())) {
            throw new AccessDeniedException("Access denied: You do not own this job posting.");
        }
    }
}
```

```java
// Application Service Status Update Ownership Check
private void verifyRecruiterOwnership(Application application) {
    UserPrincipal principal = UserPrincipal.getAuthenticatedPrincipal();
    if (principal != null) {
        if ("ADMIN".equals(principal.getRole())) {
            return;
        }
        if (principal.getUserId() != null && !principal.getUserId().equals(application.getRecruiterId())) {
            throw new AccessDeniedException("Access denied: You do not own the job for this application.");
        }
    }
}
```

---

## 6. Consistent Security Error Handling

All services have been fitted with custom authentication entry points and access denied handlers to return uniform, structured JSON error responses rather than default HTML error pages or stack traces:

### 6.1 Missing or Invalid Token (401 Unauthorized)
Triggered by `RestAuthenticationEntryPoint`:
```json
{
  "timestamp": "2026-10-30T14:01:45.123",
  "status": 401,
  "error": "Unauthorized",
  "message": "Full authentication is required to access this resource",
  "path": "/jobs"
}
```

### 6.2 Insufficient Role or Ownership Violation (403 Forbidden)
Triggered by `RestAccessDeniedHandler` and handled in `GlobalExceptionHandler`:
```json
{
  "timestamp": "2026-10-30T14:01:46.456",
  "status": 403,
  "error": "Forbidden",
  "message": "Access denied: You do not own this job posting.",
  "path": "/jobs/102"
}
```

---

## 7. Automated Security Test Results

Comprehensive automated test suites were written and executed using JUnit 5, Spring Boot Test, and MockMvc across all services.

### 7.1 Test Execution Summary

| Service | Test Suite | Tests Run | Passed | Failures | Status |
| :--- | :--- | :---: | :---: | :---: | :---: |
| `auth-service` | `AuthServiceApplicationTests` + `AuthSecurityTest` | 16 | 16 | 0 | **PASSED** |
| `job-service` | `JobServiceApplicationTests` + `JobSecurityTest` | 10 | 10 | 0 | **PASSED** |
| `application-service` | `ApplicationServiceTest` + `ApplicationSecurityTest` | 25 | 25 | 0 | **PASSED** |
| `api-gateway` | `ApiGatewayApplicationTests` | 1 | 1 | 0 | **PASSED** |
| `eureka-server` | `EurekaServerApplicationTests` | 1 | 1 | 0 | **PASSED** |
| **TOTAL** | | **53** | **53** | **0** | **100% BUILD SUCCESS** |

### 7.2 Detailed Test Scenarios Covered

#### AUTH TESTS (AuthSecurityTest in `auth-service`):
1. **AUTH-1 (Valid Login):** User authenticates with valid credentials, receives 200 OK and valid JWT token.
2. **AUTH-2 (Invalid Password):** Bad credentials return 400 Bad Request with "Invalid email or password".
3. **AUTH-3 (Missing Token):** Accessing `/auth/me` without Bearer header returns 401 Unauthorized.
4. **AUTH-4 (Malformed Token):** Accessing `/auth/me` with `Bearer not.a.valid.jwt` returns 401 Unauthorized.
5. **AUTH-5 (Expired Token):** Accessing `/auth/me` with expired JWT returns 401 Unauthorized.
6. **AUTH-6 (Tampered Token):** Accessing `/auth/me` with tampered JWT signature returns 401 Unauthorized.
7. **AUTH-7 (Admin Self-Registration Rejection):** Attempting public registration with `ADMIN` role returns 400 Bad Request ("Public registration for ADMIN role is not permitted").
8. **AUTH-8 (Password Masking):** Registration response verifies that the `password` field is not exposed in the API response DTO.
9. **OWNERSHIP-PROFILE-1:** Candidate A can view and update their own profile (`/profiles/101`).
10. **OWNERSHIP-PROFILE-2:** Candidate A cannot update Candidate B's profile (`/profiles/102`), returning 403 Forbidden.

#### ROLE & OWNERSHIP TESTS (JobSecurityTest in `job-service`):
1. **ROLE-1:** Job Seeker accessing recruiter endpoint `POST /jobs` returns 403 Forbidden.
2. **ROLE-2:** Job Seeker accessing admin endpoint `GET /jobs/all` returns 403 Forbidden.
3. **ROLE-3:** Recruiter accessing admin endpoint `GET /jobs/all` returns 403 Forbidden.
4. **ROLE-4:** Admin accessing permitted admin endpoint `GET /jobs/all` returns 200 OK.
5. **ROLE-5:** Unauthenticated user accessing protected endpoint `POST /jobs` returns 401 Unauthorized.
6. **OWNERSHIP-1:** Recruiter A cannot edit Recruiter B's job (`PUT /jobs/{id}` returns 403 Forbidden).
7. **OWNERSHIP-2:** Recruiter A cannot delete Recruiter B's job (`DELETE /jobs/{id}` returns 403 Forbidden).
8. **OWNERSHIP-3:** Recruiter A cannot close Recruiter B's job (`PATCH /jobs/{id}/close` returns 403 Forbidden).

#### APPLICATION OWNERSHIP TESTS (ApplicationSecurityTest in `application-service`):
1. **OWNERSHIP-4:** Candidate A cannot view Candidate B's application record (`GET /applications/{id}` returns 403 Forbidden).
2. **OWNERSHIP-5:** Recruiter A cannot update status for Recruiter B's job applicant (`PATCH /applications/{id}/status` returns 403 Forbidden).
3. **OWNERSHIP-6:** Job Seeker cannot update application status (`PATCH /applications/{id}/status` returns 403 Forbidden).
4. **SEC-UNAUTH:** Unauthenticated user accessing `/applications/candidate` returns 401 Unauthorized.
5. **OWNERSHIP-VERIFY (Recruiter):** Recruiter B can update status for their own job's applications (200 OK).
6. **OWNERSHIP-VERIFY (Candidate):** Candidate B can view their own application details (200 OK).

---

## 8. Remaining Security Recommendations & Future Enhancements

While TalentPulse now enforces robust JWT validation, role-based access control, and backend ownership verification, the following items are recommended for subsequent phases:
1. **Refresh Token Rotation:** Currently tokens have a 24-hour expiration. Implementing an HTTP-only cookie-based refresh token with database tracking would allow shorter access token lifetimes (e.g., 15 minutes) and instant session revocation.
2. **Distributed Blacklist / Token Revocation:** Implementing a Redis-backed token blacklist would allow immediate invalidation upon logout or password change.
3. **Asymmetric Key Signing (RS256):** Transitioning from HMAC shared secrets to RSA or ECDSA asymmetric key pairs (where `auth-service` holds the private key and downstream microservices only verify via the public key) would eliminate shared secret distribution.
4. **Rate Limiting:** Configuring Spring Cloud Gateway Redis RateLimiter to defend against brute force attempts on `/auth/login`.

---

## 9. Verification & Sign-Off

All 53 unit, integration, and security tests across all 5 backend modules have executed and passed. The frontend integration remains fully compatible with zero breaking changes to existing endpoints or authentication contracts.
