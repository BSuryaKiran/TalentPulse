# TalentPulse – Application Service Microservice

The **Application Service** is a Spring Boot microservice responsible for managing the complete lifecycle of job applications within the TalentPulse Enterprise Talent Acquisition Portal. It provides pipeline tracking, duplicate submission prevention, candidate-scoped application retrieval, and recruiter candidate screening operations.

---

## Technical Stack & Configuration

- **Framework:** Spring Boot 3.3.0 (Java 17 / 21)
- **Database:** MySQL 8.x (`talentpulse_applications`)
- **Default Service Port:** `8084`
- **ORM / Persistence:** Spring Data JPA / Hibernate
- **Validation:** Jakarta Bean Validation (`spring-boot-starter-validation`)

---

## Database Configuration

The service connects to MySQL using the `talentpulse_applications` database. Environment variables can override default local parameters:

| Variable | Description | Default Value |
| :--- | :--- | :--- |
| `SERVER_PORT` | HTTP Server Listening Port | `8084` |
| `DB_HOST` | MySQL Server Hostname | `localhost` |
| `DB_PORT` | MySQL Server Port | `3306` |
| `DB_NAME` | Database Name | `talentpulse_applications` |
| `DB_USERNAME` | Database User | `root` |
| `DB_PASSWORD` | Database Password | `password` |

---

## Entity & Domain Model

### Application Entity (`applications`)
- `id` (Long, Primary Key)
- `jobId` (Long, Required, Indexed)
- `jobTitle` (String, Required)
- `companyName` (String, Required)
- `candidateId` (Long, Required, Indexed)
- `candidateEmail` (String, Required, Indexed)
- `candidateName` (String, Required)
- `recruiterId` (Long, Indexed)
- `recruiterEmail` (String, Indexed)
- `appliedDate` (LocalDateTime, Auto-generated, Non-updatable)
- `status` (`APPLIED`, `UNDER_REVIEW`, `SHORTLISTED`, `REJECTED`, `SELECTED`)
- `resumeReference` (String)
- `coverLetter` (Text)
- `notes` (Text)

### Unique Constraint & Duplicate Prevention
A unique database constraint `uk_job_candidate (job_id, candidate_id)` and service-layer validation enforce that a candidate cannot apply for the same job requisition more than once. Attempting a duplicate submission returns **HTTP 409 Conflict**.

---

## Application Status Lifecycle

Applications transition through standardized states:

```
                  ┌──────────────┐
                  │   APPLIED    │
                  └──────┬───────┘
                         │
                         ▼
                  ┌──────────────┐
                  │ UNDER_REVIEW │
                  └──────┬───────┘
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
  ┌──────────────┐                ┌──────────────┐
  │ SHORTLISTED  │                │   REJECTED   │
  └──────┬───────┘                └──────────────┘
         │                               ▲
         ▼                               │
  ┌──────────────┐                       │
  │   SELECTED   ├───────────────────────┘
  └──────────────┘
```

Allowed Status Values:
- `APPLIED` (Default initial status assigned on submission)
- `UNDER_REVIEW` (Candidate resume and qualifications being reviewed)
- `SHORTLISTED` (Candidate qualified for interviews and assessments)
- `REJECTED` (Candidate not selected for the role)
- `SELECTED` (Candidate successfully offered / selected for the requisition)

---

## REST API Specification

### Base Path: `/applications`

| Method | Endpoint | Description | Success Status | Error Statuses |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/applications` | Submit a new job application | `201 Created` | `400 Bad Request`, `409 Conflict` |
| `GET` | `/applications/{id}` | Retrieve application details by ID | `200 OK` | `404 Not Found` |
| `GET` | `/applications/candidate/{candidateId}` | List applications submitted by candidate | `200 OK` | `400 Bad Request` |
| `GET` | `/applications/candidate` | List applications by candidate context (`?email=...` or `X-Candidate-Email`) | `200 OK` | `400 Bad Request` |
| `GET` | `/applications/recruiter/{recruiterId}` | List applications for jobs owned by recruiter | `200 OK` | `400 Bad Request` |
| `GET` | `/applications/recruiter` | List applications by recruiter context (`?email=...` or `X-Recruiter-Email`) | `200 OK` | `400 Bad Request` |
| `GET` | `/applications/job/{jobId}` | List all applications submitted for a job | `200 OK` | `400 Bad Request` |
| `PATCH` | `/applications/{id}/status` | Update application status in hiring pipeline | `200 OK` | `400 Bad Request`, `403 Forbidden`, `404 Not Found` |
| `DELETE` | `/applications/{id}` | Delete application record (Authorized) | `204 No Content` | `403 Forbidden`, `404 Not Found` |

---

## Authentication & Security Boundary Note

> **Development Authorization & Gateway Integration:**  
> JWT authentication is handled centrally by the Auth Service. When the API Gateway is deployed in subsequent phases, it will validate bearer JWT tokens and forward verified identities in request headers (`X-Candidate-Email`, `X-Candidate-Id`, `X-Recruiter-Email`, `X-Recruiter-Id`). The Application Service is designed to accept these standard identity contexts seamlessly while remaining completely decoupled from token issuance.

---

## Running Locally

### Prerequisites
1. JDK 17 or JDK 21 installed.
2. MySQL Server running on port 3306 with database `talentpulse_applications` created (or auto-created by Hibernate).

### Build & Run
```bash
# Navigate to application service directory
cd backend/application-service

# Run all unit and integration tests
mvn clean test

# Package executable JAR
mvn clean package

# Run Spring Boot service on port 8084
mvn spring-boot:run
```
