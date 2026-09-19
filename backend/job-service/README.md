# TalentPulse – Job Service Microservice

The **Job Service** is a Spring Boot microservice responsible for managing the complete lifecycle of job requisitions within the TalentPulse Enterprise Talent Acquisition Portal.

---

## Technical Stack & Configuration

- **Framework:** Spring Boot 3.3.0 (Java 17)
- **Database:** MySQL 8.x (`talentpulse_jobs`)
- **Default Service Port:** `8083`
- **ORM / Persistence:** Spring Data JPA / Hibernate
- **Validation:** Jakarta Bean Validation (`spring-boot-starter-validation`)

---

## Database Configuration

The service connects to MySQL using the `talentpulse_jobs` database. Environment variables can override default local parameters:

| Variable | Description | Default Value |
| :--- | :--- | :--- |
| `SERVER_PORT` | HTTP Server Listening Port | `8083` |
| `DB_HOST` | MySQL Server Hostname | `localhost` |
| `DB_PORT` | MySQL Server Port | `3306` |
| `DB_NAME` | Database Name | `talentpulse_jobs` |
| `DB_USERNAME` | Database User | `root` |
| `DB_PASSWORD` | Database Password | `password` |

---

## Entity & Domain Model

### Job Entity (`jobs`)
- `id` (Long, Primary Key)
- `title` (String, Required)
- `companyName` (String, Required)
- `description` (Text, Required)
- `employmentType` (`FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP`)
- `workMode` (`HYBRID`, `REMOTE`, `ON_SITE`)
- `location` (String, Required)
- `experience` (String)
- `salary` (String)
- `applicationDeadline` (LocalDate)
- `requiredSkills` (List of Strings)
- `qualifications` (List of Strings)
- `responsibilities` (List of Strings)
- `benefits` (List of Strings)
- `additionalInformation` (Text)
- `postedDate` (LocalDateTime, Auto-generated)
- `status` (`DRAFT`, `ACTIVE`, `CLOSED`)
- `applicantCount` (Integer)
- `recruiterId` (Long)
- `recruiterEmail` (String, Required Ownership Key)

---

## REST API Specification

### Base Path: `/jobs`

| Method | Endpoint | Description | Access / Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/jobs` | Retrieve all `ACTIVE` job listings for candidate browsing | 200 OK |
| `GET` | `/jobs/all` | Administrative endpoint to list all jobs regardless of status | 200 OK |
| `GET` | `/jobs/{id}` | Retrieve job requisition by ID | 200 OK / 404 Not Found |
| `GET` | `/jobs/recruiter` | Retrieve jobs owned by recruiter (`?email=...` or `X-Recruiter-Email`) | 200 OK |
| `POST` | `/jobs` | Create new job requisition (`DRAFT` or `ACTIVE`) | 201 Created / 400 Bad Request |
| `PUT` | `/jobs/{id}` | Update existing job requisition | 200 OK / 403 Forbidden / 404 |
| `PATCH` | `/jobs/{id}/publish` | Transition status `DRAFT` $\rightarrow$ `ACTIVE` | 200 OK / 400 Bad Request / 403 |
| `PATCH` | `/jobs/{id}/close` | Transition status `ACTIVE` $\rightarrow$ `CLOSED` | 200 OK / 403 Forbidden / 404 |
| `DELETE` | `/jobs/{id}` | Permanently delete job requisition | 204 No Content / 403 / 404 |

---

## Authentication & Security Boundary Note

> **Development Authorization:**  
> Full API Gateway and shared JWT security context resolution will be integrated in Phase 4. Currently, the service verifies recruiter identity using the `X-Recruiter-Email` HTTP Header or request parameters. This provides clean boundary isolation so frontend Axios calls can transition seamlessly when JWT tokens are injected by the API Gateway.

---

## Running Locally

### Prerequisites
1. JDK 17 installed.
2. MySQL Server running locally on port 3306 with database `talentpulse_jobs` created (or auto-created via JDBC driver).

### Launching the Microservice
```bash
cd backend/job-service
./mvnw spring-boot:run
```
Or build the executable JAR:
```bash
./mvnw clean package
java -jar target/job-service-0.0.1-SNAPSHOT.jar
```
