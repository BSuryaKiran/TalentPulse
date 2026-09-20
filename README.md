# TalentPulse – Enterprise Talent Acquisition & Job Application Tracking Portal

TalentPulse is an enterprise-grade Applicant Tracking System (ATS) and talent acquisition platform designed with a modern Spring Boot / Spring Cloud microservices backend and a React (Vite) frontend.

---

## High-Level Microservice Architecture

```
                    ┌──────────────────┐
                    │  React Frontend  │
                    │      :5173       │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │   API Gateway    │
                    │      :8080       │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  Eureka Server   │
                    │      :8761       │
                    └────────┬─────────┘
                             │
        ┌────────────────────┼────────────────────┬────────────────────┐
        ▼                    ▼                    ▼                    ▼
┌──────────────┐      ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Auth Service │      │ Job Service  │     │ Application  │     │ Profile      │
│    :8081     │      │    :8083     │     │ Service:8084 │     │ Service:8082 │
└───────┬──────┘      └───────┬──────┘     └───────┬──────┘     └───────┬──────┘
        │                     │                    │                    │
        ▼                     ▼                    ▼                    ▼
   MySQL Auth             MySQL Jobs           MySQL Apps         MySQL Profile
(talentpulse_auth)    (talentpulse_jobs)   (talentpulse_apps)   (talentpulse_prof)
```

---

## Service Port Allocation

| Component / Microservice | Default Port | Technology Stack | Status |
| :--- | :--- | :--- | :--- |
| **Eureka Discovery Server** | `8761` | Spring Boot 3.3.0 / Spring Cloud Eureka Server | **ONLINE** |
| **API Gateway** | `8080` | Spring Cloud Gateway / Reactive WebFlux | **ONLINE** |
| **Auth Service** | `8081` | Spring Boot / Spring Security / JJWT / MySQL | **ONLINE** |
| **Job Service** | `8083` | Spring Boot / Spring Data JPA / MySQL | **ONLINE** |
| **Application Service** | `8084` | Spring Boot / Spring Data JPA / MySQL | **ONLINE** |
| **Profile Service** | `8082` | Spring Boot / Spring Data JPA / MySQL | *PENDING* |
| **React Frontend** | `5173` | React 18 / Vite / Tailwind CSS / Vanilla CSS | **ONLINE** |

---

## API Gateway Route Table

The API Gateway on port `8080` acts as the single unified backend entry point for all frontend requests:

| Incoming Frontend Path | Target Microservice | Load-Balanced Destination URI | Access / Boundary |
| :--- | :--- | :--- | :--- |
| `/auth/**` | `AUTH-SERVICE` | `lb://AUTH-SERVICE` | Public (`/login`, `/register`) & Protected |
| `/profile/**` | `PROFILE-SERVICE` | `lb://PROFILE-SERVICE` | Profile Data & Resumes |
| `/jobs/**` | `JOB-SERVICE` | `lb://JOB-SERVICE` | Public Jobs & Recruiter Requisitions |
| `/applications/**` | `APPLICATION-SERVICE` | `lb://APPLICATION-SERVICE` | Candidate Submissions & Recruiter Pipeline |

---

## Recommended Local Startup Order

To run the complete TalentPulse enterprise platform locally, start components in the following sequence:

1. **MySQL Database Server**
   Ensure MySQL is running on port `3306` with databases:
   - `talentpulse_auth`
   - `talentpulse_jobs`
   - `talentpulse_applications`

2. **Eureka Discovery Server**
   ```bash
   cd backend/eureka-server
   mvn spring-boot:run
   ```
   *Dashboard available at: [http://localhost:8761](http://localhost:8761)*

3. **Core Backend Microservices**
   - **Auth Service:**
     ```bash
     cd backend/auth-service
     mvn spring-boot:run
     ```
   - **Job Service:**
     ```bash
     cd backend/job-service
     mvn spring-boot:run
     ```
   - **Application Service:**
     ```bash
     cd backend/application-service
     mvn spring-boot:run
     ```

4. **API Gateway**
   ```bash
   cd backend/api-gateway
   mvn spring-boot:run
   ```

5. **React Frontend**
   ```bash
   cd frontend
   npm run dev
   ```
   *Application available at: [http://localhost:5173](http://localhost:5173)*
