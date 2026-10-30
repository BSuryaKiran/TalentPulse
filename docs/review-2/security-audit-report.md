# TalentPulse Authentication & Authorization Security Audit Report

**Date:** 2026-10-30  
**Project:** TalentPulse – Microservices Talent Acquisition & Application Portal  
**Target:** Review-2 Enhancement P1 — JWT Security Hardening & Backend Authorization  

---

## 1. Executive Summary

An audit of the existing backend services (`auth-service`, `job-service`, `application-service`, `api-gateway`) and the frontend React application (`frontend/src`) was conducted prior to making modifications.

The existing architecture establishes an HMAC-SHA256 JWT-based authentication flow with BCrypt password hashing and API Gateway routing. However, several critical security deficiencies were identified:
1. **Identity Spoofing via Headers/Query Parameters:** Downstream services (`job-service`, `application-service`) inspected `X-Recruiter-Email`, `X-Candidate-Email`, or URL query parameters for user identity, allowing malicious users to forge headers and tamper with other users' resources.
2. **Missing Backend Method-Level Role Restrictions:** Endpoints such as `GET /jobs/all` were accessible to any authenticated user instead of being restricted to `ADMIN`.
3. **Incomplete Ownership Enforcement:** Service implementations allowed access if headers were missing or did not strictly verify that the authenticated JWT subject matched the entity owner.
4. **Missing Profile Service Backend Endpoints:** Frontend calls to `/profiles/{userId}` were routed to a pending `PROFILE-SERVICE`, falling back to local client state without backend security validation.
5. **Inconsistent Security Error Responses:** Unauthenticated or unauthorized requests lacked standardized `AuthenticationEntryPoint` (401) and `AccessDeniedHandler` (403) handlers, returning default or blank responses rather than structured JSON.

---

## 2. Detailed Component Audit

### 2.1. JWT Generation (`auth-service`)
- **Library:** JJWT `0.12.5` (`io.jsonwebtoken`).
- **Signing Algorithm:** HMAC-SHA256 via `Keys.hmacShaKeyFor(secretKeyBytes)`.
- **Secret Key:** Loaded via `${application.security.jwt.secret-key}` (minimum 256-bit key).
- **Token Claims:**
  - `sub`: User email (`user.getEmail()`)
  - `userId`: Numeric identifier (`user.getId()`)
  - `fullName`: Display name (`user.getFullName()`)
  - `role`: Role string (`JOB_SEEKER`, `RECRUITER`, `ADMIN`)
  - `iat`: Issuance timestamp
  - `exp`: Expiration timestamp (default: 86400000 ms / 24 hours)
- **Password Encoding:** `BCryptPasswordEncoder(10)`. Passwords are encrypted before persisting and never returned in `AuthResponse` or `UserDto`.
- **Public Registration:** `AuthService.register()` already contains a check rejecting `Role.ADMIN` registration requests.

### 2.2. JWT Validation Across Microservices
- `job-service` & `application-service` validate tokens using JJWT parser with the shared secret key.
- Tokens are verified for signature validity and expiration.
- Roles are prefixed with `ROLE_` and assigned to Spring Security's `SecurityContextHolder`.
- **Gaps:**
  - Neither service extracted the `userId` claim into a structured `UserPrincipal` object, relying solely on email for the principal name.
  - Absence of custom `AuthenticationEntryPoint` (HTTP 401) and `AccessDeniedHandler` (HTTP 403) in `SecurityConfig`.

### 2.3. Endpoint Authorization & Ownership Checks
| Microservice | Endpoint | Required Role | Pre-Audit Vulnerability |
| :--- | :--- | :--- | :--- |
| `job-service` | `GET /jobs/all` | `ADMIN` | Any authenticated user could invoke |
| `job-service` | `POST /jobs` | `RECRUITER`, `ADMIN` | Trusted `X-Recruiter-Email` header |
| `job-service` | `PUT /jobs/{id}` | `RECRUITER`, `ADMIN` | Trusted `X-Recruiter-Email` header for ownership |
| `job-service` | `DELETE /jobs/{id}` | `RECRUITER`, `ADMIN` | Trusted `X-Recruiter-Email` header for ownership |
| `job-service` | `GET /jobs/recruiter` | `RECRUITER`, `ADMIN` | Recruiter A could pass `?email=recruiterB` |
| `application-service` | `POST /applications` | `JOB_SEEKER`, `ADMIN` | Candidate ID/Email accepted from request body |
| `application-service` | `GET /applications/candidate` | `JOB_SEEKER`, `ADMIN` | Candidate A could read Candidate B applications |
| `application-service` | `GET /applications/recruiter` | `RECRUITER`, `ADMIN` | Recruiter A could query Recruiter B applicants |
| `application-service` | `GET /applications/{id}` | Owner Candidate, Owner Recruiter, `ADMIN` | Any authenticated user could view application |
| `application-service` | `PATCH /applications/{id}/status` | Owner Recruiter, `ADMIN` | Recruiter ownership was checked against header |

### 2.4. Profile Management & Gateway Routing
- Frontend `profileService.js` makes requests to `/profiles/{userId}`.
- `api-gateway` originally had `PROFILE-SERVICE` mapped to `Path=/profile/**`, but no standalone profile service microservice exists in the repository.
- **Solution:** Implement Profile management directly inside `auth-service` (which maintains `users` table), enforcing ownership (users can view/edit only their own profile; admins can manage all), and configure API Gateway to route `/profiles/**` to `AUTH-SERVICE`.

---

## 3. Security Enhancement Action Items

1. **User Principal Helper (`UserPrincipal`):** Standardize principal representation across all services containing `userId`, `email`, and `role`.
2. **Standardized Security Exception Handlers:**
   - `RestAuthenticationEntryPoint` returning HTTP 401 JSON.
   - `RestAccessDeniedHandler` returning HTTP 403 JSON.
3. **Backend Ownership Enforcement:**
   - Replace all header/query identity parameters with `SecurityContextHolder.getContext().getAuthentication().getPrincipal()`.
   - In `JobServiceImpl`: verify authenticated user owns the job before edit/publish/close/delete.
   - In `ApplicationServiceImpl`: candidate applications forced to authenticated user; recruiter actions verified against job owner.
4. **Role-Based Method Security (`@PreAuthorize`):**
   - Restrict `GET /jobs/all` to `hasRole('ADMIN')`.
   - Restrict job modifications to `hasAnyRole('RECRUITER', 'ADMIN')`.
   - Restrict application submissions to `hasAnyRole('JOB_SEEKER', 'ADMIN')`.
   - Restrict application status updates to `hasAnyRole('RECRUITER', 'ADMIN')`.
5. **Profile Controller in Auth Service:**
   - `GET /profiles/{id}`: view profile with ownership validation.
   - `PUT /profiles/{id}`: update profile with ownership validation.
   - Route `/profiles/**` via API Gateway.
6. **Automated Unit & Integration Security Tests:**
   - Auth tests, Role tests, and Ownership tests covering all 19 required scenarios.
