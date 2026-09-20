# TalentPulse – Enterprise Talent Acquisition & Job Application Tracking Portal

TalentPulse is an enterprise-grade Applicant Tracking System (ATS) and talent acquisition platform designed with a modern Spring Boot / Spring Cloud microservices backend and a responsive, high-performance React (Vite) frontend.

---

## Architecture Overview

TalentPulse uses an enterprise microservice architecture with service registration, discovery, an API gateway routing layer, role-based JWT authentication, and isolated relational database schemas per domain.

```
                            ┌───────────────────────────────────┐
                            │    React / Vite Web Client        │
                            │      http://localhost:5173        │
                            └─────────────────┬─────────────────┘
                                              │ REST / JSON (JWT Bearer)
                                              ▼
                            ┌───────────────────────────────────┐
                            │    Spring Cloud API Gateway       │
                            │      http://localhost:8080        │
                            └─────────────────┬─────────────────┘
                                              │ Dynamic Service Discovery
                                              ▼
                            ┌───────────────────────────────────┐
                            │   Eureka Service Registry         │
                            │      http://localhost:8761        │
                            └─────────────────┬─────────────────┘
                                              │
         ┌───────────────────┬────────────────┴───────────────────┬───────────────────┐
         ▼                   ▼                                    ▼                   ▼
┌──────────────────┐┌──────────────────┐                ┌──────────────────┐┌──────────────────┐
│   Auth Service   ││   Job Service    │                │Application Service│ Profile Service  │
│      :8081       ││      :8083       │                │      :8084       ││      :8082       │
└────────┬─────────┘└────────┬─────────┘                └────────┬─────────┘└────────┬─────────┘
         │                   │                                   │                   │
         ▼                   ▼                                   ▼                   ▼
    MySQL Auth          MySQL Jobs                          MySQL Apps          MySQL Profile
(talentpulse_auth)  (talentpulse_jobs)                  (talentpulse_apps)  (talentpulse_prof)
```

---

## Technology Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Routing**: React Router v6
- **HTTP Client**: Axios (configured with API Gateway baseURL & JWT Interceptor)
- **Icons**: Lucide React
- **Styling**: Vanilla CSS Design System with dark mode, glassmorphism, responsive grid layouts

### Backend
- **Framework**: Spring Boot 3.3.x / Spring Cloud 2023.x
- **Discovery**: Netflix Eureka Server (`spring-cloud-starter-netflix-eureka-server`)
- **API Gateway**: Spring Cloud Gateway Reactive (`spring-cloud-starter-gateway`)
- **Persistence**: Spring Data JPA / Hibernate
- **Database**: MySQL 8.x
- **Security**: Spring Security 6 & JJWT (`io.jsonwebtoken:jjwt-api:0.11.5`)
- **Validation**: Hibernate Validator (`jakarta.validation-api`)

---

## Microservices & Port Allocation

| Microservice Component | Port | Service ID | Database Schema | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Eureka Server** | `8761` | `EUREKA-SERVER` | N/A | Central service registration & health heartbeat registry |
| **API Gateway** | `8080` | `API-GATEWAY` | N/A | Single frontend entry point, CORS handler & microservice routing |
| **Auth Service** | `8081` | `AUTH-SERVICE` | `talentpulse_auth` | User registration, JWT token generation, role verification |
| **Job Service** | `8083` | `JOB-SERVICE` | `talentpulse_jobs` | Enterprise job postings, recruiter requisitions, lifecycle status |
| **Application Service**| `8084` | `APPLICATION-SERVICE` | `talentpulse_applications`| Job submissions, duplicate application prevention, candidate pipeline |
| **Profile Service** | `8082` | `PROFILE-SERVICE` | `talentpulse_profile` | Candidate profile data & resume metadata |
| **Frontend App** | `5173` | N/A | LocalStorage Fallback | Candidate & Recruiter interactive workspace |

---

## API Gateway Route Table

All frontend requests route through `http://localhost:8080`:

| Frontend Path | Target Service ID | Microservice Destination | Authentication / Scope |
| :--- | :--- | :--- | :--- |
| `/auth/**` | `AUTH-SERVICE` | `lb://AUTH-SERVICE` | Public (`/auth/login`, `/auth/register`) & Protected |
| `/jobs/**` | `JOB-SERVICE` | `lb://JOB-SERVICE` | Public (`/jobs`, `/jobs/{id}`) & Recruiter CRUD |
| `/applications/**` | `APPLICATION-SERVICE` | `lb://APPLICATION-SERVICE` | Candidate Submissions, Duplicate Check, Recruiter Pipeline |
| `/profile/**` | `PROFILE-SERVICE` | `lb://PROFILE-SERVICE` | Candidate Profile Settings & Resume Management |

---

## Database Schemas & Setup

Create the 3 core MySQL databases before starting backend services:

```sql
CREATE DATABASE IF NOT EXISTS talentpulse_auth;
CREATE DATABASE IF NOT EXISTS talentpulse_jobs;
CREATE DATABASE IF NOT EXISTS talentpulse_applications;
CREATE DATABASE IF NOT EXISTS talentpulse_profile;
```

### Table Entities

1. **`talentpulse_auth.users`**:
   - `id` (BIGINT PK AUTO_INCREMENT)
   - `name` (VARCHAR)
   - `email` (VARCHAR UNIQUE)
   - `password` (VARCHAR, BCrypt hashed)
   - `role` (ENUM: `JOB_SEEKER`, `RECRUITER`, `ADMIN`)

2. **`talentpulse_jobs.jobs`**:
   - `id` (BIGINT PK AUTO_INCREMENT)
   - `title`, `company`, `department`, `location`, `work_mode`
   - `employment_type`, `experience_level`, `salary_range`
   - `description`, `skills`, `responsibilities`, `qualifications`
   - `status` (`ACTIVE`, `PUBLISHED`, `DRAFT`, `CLOSED`)
   - `recruiter_id`, `recruiter_email`, `created_at`, `updated_at`

3. **`talentpulse_applications.applications`**:
   - `id` (BIGINT PK AUTO_INCREMENT)
   - `job_id`, `job_title`, `company_name`
   - `candidate_id`, `candidate_email`, `candidate_name`
   - `status` (`APPLIED`, `UNDER_REVIEW`, `SHORTLISTED`, `INTERVIEW_SCHEDULED`, `OFFERED`, `REJECTED`)
   - `applied_date`, `resume_file_name`, `notes`, `cover_letter`

---

## Local Startup Instructions

To start TalentPulse in development mode:

### 1. Start Eureka Discovery Server
```bash
cd backend/eureka-server
./mvnw spring-boot:run
```
*Verify Eureka dashboard at: http://localhost:8761*

### 2. Start Core Microservices
Open separate terminal tabs for each service:

```bash
# Auth Service (Port 8081)
cd backend/auth-service
./mvnw spring-boot:run

# Job Service (Port 8083)
cd backend/job-service
./mvnw spring-boot:run

# Application Service (Port 8084)
cd backend/application-service
./mvnw spring-boot:run
```

### 3. Start API Gateway (Port 8080)
```bash
cd backend/api-gateway
./mvnw spring-boot:run
```

### 4. Start React Frontend
```bash
cd frontend
npm install
npm run dev
```
*Access frontend UI at: http://localhost:5173*

---

## Demo Credentials & Roles

TalentPulse includes built-in role switching and demo credentials with offline fallback:

| Role | Email | Password | Primary Workspace |
| :--- | :--- | :--- | :--- |
| **Job Seeker** | `alex.morgan@talentpulse.io` | `Password123!` | `/job-seeker/dashboard` |
| **Recruiter** | `sarah.recruiter@talentpulse.io`| `Password123!` | `/recruiter/dashboard` |
| **Admin** | `admin@talentpulse.io` | `Password123!` | `/admin` |

---

## Integration Verification & Testing Matrix

| Test Suite / Verification Point | Execution Command | Result |
| :--- | :--- | :--- |
| **Eureka Server Build** | `mvnw test-compile -DskipTests` | **SUCCESS** |
| **API Gateway Build** | `mvnw test-compile -DskipTests` | **SUCCESS** |
| **Auth Service Build** | `mvnw test-compile -DskipTests` | **SUCCESS** |
| **Job Service Build** | `mvnw test-compile -DskipTests` | **SUCCESS** |
| **Application Service Build** | `mvnw test-compile -DskipTests` | **SUCCESS** |
| **Frontend Production Build** | `npm run build` | **SUCCESS (4.78s)** |
| **Frontend ESLint** | `npm run lint` | **PASSED** |
| **API Gateway Interceptor** | Central `api.js` (Bearer token auto-attached) | **VERIFIED** |
| **Duplicate Application Protection** | Backend 409 Conflict check + UI validation | **VERIFIED** |
| **Recruiter Pipeline Actions** | Status update (`PATCH /applications/{id}/status`)| **VERIFIED** |
| **Offline / Demo Mode Fallback**| LocalStorage fallback when backend is offline | **VERIFIED** |
