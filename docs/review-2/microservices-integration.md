# TalentPulse Microservices Architecture & Integration Guide

**Project:** TalentPulse – Enterprise Talent Acquisition & Job Application Tracking Portal  
**Document Version:** 2.0  
**Phase:** REVIEW-2 ENHANCEMENT P2 — Architecture Specification & Microservices Integration  

---

## 1. System Architecture Overview

TalentPulse is designed around a decoupled, domain-driven microservices architecture coordinated by Netflix Eureka for service registration and discovery, with a unified Spring Cloud Gateway acting as the single secure entry point.

```
                           +-------------------------------------+
                           |            React + Vite             |
                           |       (Client SPA - Port 5173)      |
                           +------------------+------------------+
                                              |
                                              | HTTP / JSON (Port 8080)
                                              | Header: 'Authorization: Bearer <JWT>'
                                              v
                           +-------------------------------------+
                           |        Spring Cloud API Gateway     |
                           |             (Port 8080)             |
                           +------------------+------------------+
                                              |
                     +------------------------+------------------------+
                     | Service Lookup         | Service Lookup         | Service Lookup
                     v                        v                        v
        +------------------------------------------------------------------------+
        |                  Netflix Eureka Service Registry (Port 8761)           |
        +------------------------------------------------------------------------+
                     |                        |                        |
                     | lb://AUTH-SERVICE      | lb://JOB-SERVICE       | lb://APPLICATION-SERVICE
                     v                        v                        v
+-----------------------------+ +---------------------------+ +-------------------------------+
|         AUTH-SERVICE        | |        JOB-SERVICE        | |      APPLICATION-SERVICE      |
|         (Port 8081)         | |        (Port 8083)        | |          (Port 8084)          |
|-----------------------------| |---------------------------| |-------------------------------|
| - User Authentication       | | - Job Requisition CRUD    | | - Job Application Workflow    |
| - BCrypt Password Hashing   | | - Lifecycle Management    | | - Recruiter Applicant Review  |
| - JWT Issuance & Validation | | - Ownership Enforcement   | | - Status Progression         |
| - Profile Service APIs      | | - Active / Draft Filtering| | - Duplicate Prevention        |
+--------------+--------------+ +-------------+-------------+ +---------------+---------------+
               |                              |                               |
               v                              v                               v
+-----------------------------+ +---------------------------+ +-------------------------------+
|        MySQL Database       | |       MySQL Database      | |         MySQL Database        |
|      `talentpulse_auth`     | |     `talentpulse_jobs`    | |   `talentpulse_applications`  |
+-----------------------------+ +---------------------------+ +-------------------------------+
```

---

## 2. Microservice Inventory & Actual Ports

| Service Name | Spring Application ID | Default Port | Primary Responsibilities | Database Schema |
| :--- | :--- | :---: | :--- | :--- |
| **Eureka Server** | `eureka-server` | `8761` | Central Service Discovery Registry | N/A (In-memory registry) |
| **API Gateway** | `api-gateway` | `8080` | Reverse proxy, dynamic routing, CORS management | N/A (Stateless) |
| **Auth Service** | `auth-service` | `8081` | Authentication, JWT token issuance, User Profile APIs | `talentpulse_auth` |
| **Job Service** | `job-service` | `8083` | Job lifecycle (`DRAFT`, `ACTIVE`, `CLOSED`), recruiter ownership | `talentpulse_jobs` |
| **Application Service** | `application-service` | `8084` | Job applications, applicant tracking, status progression | `talentpulse_applications` |
| **Frontend Client** | `talentpulse-frontend` | `5173` | React 18 + Vite SPA, role-based dashboards | Browser LocalStorage |

> **Architectural Note on Profile Functionality:**  
> In accordance with domain modularity within TalentPulse, profile management (`/profiles/**`, `/profile/**`) is hosted natively inside `auth-service` to avoid unnecessary network latency for user credential/profile synchronicity. It is routed dynamically via the API Gateway under `lb://AUTH-SERVICE` with strict backend ownership enforcement (`com.talentpulse.auth.controller.ProfileController`).

---

## 3. Dynamic Gateway Routing & CORS Configuration

The API Gateway routes client requests dynamically using Eureka service identifiers (`lb://<SERVICE_NAME>`):

```properties
# Authentication & Profile Routing
spring.cloud.gateway.routes[0].id=auth-service-route
spring.cloud.gateway.routes[0].uri=lb://AUTH-SERVICE
spring.cloud.gateway.routes[0].predicates[0]=Path=/auth/**

spring.cloud.gateway.routes[1].id=profile-service-route
spring.cloud.gateway.routes[1].uri=lb://AUTH-SERVICE
spring.cloud.gateway.routes[1].predicates[0]=Path=/profile/**,/profiles/**

# Job Service Routing
spring.cloud.gateway.routes[2].id=job-service-route
spring.cloud.gateway.routes[2].uri=lb://JOB-SERVICE
spring.cloud.gateway.routes[2].predicates[0]=Path=/jobs/**

# Application Service Routing
spring.cloud.gateway.routes[3].id=application-service-route
spring.cloud.gateway.routes[3].uri=lb://APPLICATION-SERVICE
spring.cloud.gateway.routes[3].predicates[0]=Path=/applications/**
```

### Global CORS Policy
Configured in `api-gateway/src/main/resources/application.properties`:
- **Allowed Origins:** `http://localhost:5173`, `http://127.0.0.1:5173`, `http://localhost:3000`
- **Allowed Methods:** `GET, POST, PUT, PATCH, DELETE, OPTIONS`
- **Allowed Headers:** `*`
- **Allow Credentials:** `true`

---

## 4. End-to-End JWT Propagation & Security Workflow

Every secured request adheres to the following cryptographic verification pipeline:

```
1. Client Request
   Client -> API Gateway (Port 8080)
   Header: 'Authorization: Bearer <HMAC-SHA256 Token>'

2. Gateway Forwarding
   API Gateway forwards exact 'Authorization' header to target microservice
   (No logging of sensitive headers or JWT tokens)

3. Downstream Token Validation (JwtAuthenticationFilter)
   Target Microservice executes:
   a. Extracts Bearer token.
   b. Validates signature with shared 256-bit secret (JWT_SECRET_KEY).
   c. Checks expiration timestamp against current system clock.
   d. Extracts claims: 'userId', 'role', 'sub' (email).
   e. Instantiates UserPrincipal into SecurityContextHolder.

4. Method-Level Authorization (@PreAuthorize)
   Controller method evaluates user role (e.g. hasRole('RECRUITER')).
   Insufficient role -> 403 Forbidden via RestAccessDeniedHandler.

5. Service Layer Ownership Verification
   Service validates principal.userId == resource.ownerId.
   Ownership violation -> 403 Forbidden with descriptive JSON message.
```

---

## 5. Database Separation & Isolation

Each microservice maintains strict schema independence in MySQL:

1. **`talentpulse_auth`:**
   - Table `users`: `id`, `full_name`, `email` (unique index), `password` (BCrypt hashed), `role`, `phone`, `location`, `summary`, `skills`.
2. **`talentpulse_jobs`:**
   - Table `jobs`: `id`, `title`, `company_name`, `description`, `employment_type`, `work_mode`, `location`, `salary`, `recruiter_id`, `recruiter_email`, `status` (`DRAFT`, `ACTIVE`, `CLOSED`), `application_deadline`, `created_at`, `updated_at`.
3. **`talentpulse_applications`:**
   - Table `applications`: `id`, `job_id`, `job_title`, `company_name`, `candidate_id`, `candidate_name`, `candidate_email`, `candidate_phone`, `resume_url`, `cover_letter`, `recruiter_id`, `recruiter_email`, `status` (`APPLIED`, `UNDER_REVIEW`, `SHORTLISTED`, `REJECTED`, `SELECTED`), `applied_date`, `notes`.
   - Unique Constraint: `(job_id, candidate_id)` prevents duplicate applications at the database and service levels.

---

## 6. Microservices Startup Order & Lifecycle

To ensure clean service discovery and routing, start the components in the following order:

```bash
# Step 1: Start Eureka Discovery Server
cd backend/eureka-server
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"; .\mvnw.cmd spring-boot:run

# Step 2: Start Auth Service (Registers with Eureka, port 8081)
cd backend/auth-service
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"; .\mvnw.cmd spring-boot:run

# Step 3: Start Job Service (Registers with Eureka, port 8083)
cd backend/job-service
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"; .\mvnw.cmd spring-boot:run

# Step 4: Start Application Service (Registers with Eureka, port 8084)
cd backend/application-service
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"; .\mvnw.cmd spring-boot:run

# Step 5: Start API Gateway (Discovers services from Eureka, port 8080)
cd backend/api-gateway
$env:JAVA_HOME = "C:\Program Files\Java\jdk-21"; .\mvnw.cmd spring-boot:run

# Step 6: Start Frontend Application (Connects to Gateway at port 8080)
cd frontend
npm run dev
```

---

## 7. Frontend Integration Status

| UI View / Workflow | Route | Integration Status | Backend Endpoints Used |
| :--- | :--- | :---: | :--- |
| **Login & Registration** | `/login`, `/register` | **Real Backend** | `POST /auth/login`, `POST /auth/register` |
| **Candidate Profile** | `/profile` | **Real Backend** | `GET /profiles/:id`, `PUT /profiles/:id` |
| **Browse Jobs** | `/jobs` | **Real Backend** | `GET /jobs` |
| **Apply for Job** | `/jobs/:id/apply` | **Real Backend** | `POST /applications` |
| **Candidate Applications** | `/applications` | **Real Backend** | `GET /applications/candidate`, `GET /applications/:id` |
| **Recruiter Dashboard** | `/recruiter` | **Real Backend** | `GET /jobs/my-jobs`, `GET /applications/recruiter` |
| **Post / Edit Job** | `/recruiter/jobs/new` | **Real Backend** | `POST /jobs`, `PUT /jobs/:id` |
| **Manage Applicants** | `/recruiter/applications` | **Real Backend** | `GET /applications/job/:id`, `PATCH /applications/:id/status` |
| **Admin Dashboard** | `/admin` | **Hybrid / Mock** | View uses mock analytics / fallback; backend endpoints `/jobs/all` and `/applications/all` are implemented in backend and verified via automated tests. |

---

## 8. Summary of Pending & Future Capabilities

- **Asymmetric Key (RS256) Signing:** Move from HMAC shared secrets to Public/Private key verification.
- **Refresh Token Rotation:** Extend token lifecycle management with HTTP-only cookies.
- **Distributed Redis Cache:** Add caching for active job searches and Eureka service discovery instances.
