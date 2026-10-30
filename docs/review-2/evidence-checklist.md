# TalentPulse Review-2 Screenshot Evidence Checklist

**Project:** TalentPulse – Enterprise Talent Acquisition & Job Application Tracking Portal  
**Document Version:** 1.0  
**Phase:** REVIEW-2 ENHANCEMENT P2 — Microservices Integration & Manual Validation  

> **Note for Evaluators & QA Testers:**  
> In accordance with academic and enterprise review integrity standards, this checklist defines the exact visual evidence required for Review-2 evaluation. Each section provides guidance on what to capture, the expected state, and verification criteria.

---

## Evidence Capture Matrix

| Item # | Evidence Artifact Name | Screen / Component to Capture | Key Elements to Verify | Status |
| :---: | :--- | :--- | :--- | :---: |
| **01** | `01_eureka_dashboard.png` | Eureka Web Console (`http://localhost:8761`) | - `Instances currently registered with Eureka` table<br>- Application IDs: `API-GATEWAY`, `AUTH-SERVICE`, `JOB-SERVICE`, `APPLICATION-SERVICE`<br>- Status: `UP (n) - [host:port]` for each service<br>- General Info: Environment `test`, Data center `default` | Pending Capture |
| **02** | `02_gateway_auth_login.png` | Postman / Browser Network Tab (`POST http://localhost:8080/auth/login`) | - Gateway Base URL (Port 8080)<br>- Status: `200 OK`<br>- Response body with `token`, `userId`, `email`, `role`<br>- Absence of password in response | Pending Capture |
| **03** | `03_gateway_job_browse.png` | Postman / Browser (`GET http://localhost:8080/jobs`) | - Status: `200 OK`<br>- Active job list array returned through API Gateway<br>- Gateway header forwarding | Pending Capture |
| **04** | `04_gateway_application_submit.png` | Postman / UI (`POST http://localhost:8080/applications`) | - Status: `201 Created`<br>- Returned application payload with generated `id`, `status: APPLIED`<br>- Verified binding to authenticated `candidateId` | Pending Capture |
| **05** | `05_valid_jwt_request.png` | Postman (`GET http://localhost:8080/auth/me` or `/applications/candidate`) | - Header: `Authorization: Bearer <valid_token>`<br>- Status: `200 OK`<br>- Valid user payload returned | Pending Capture |
| **06** | `06_invalid_jwt_response.png` | Postman (`GET http://localhost:8080/auth/me` with bad token) | - Header: `Authorization: Bearer invalid.token.value`<br>- Status: `401 Unauthorized`<br>- Structured JSON response with error message | Pending Capture |
| **07** | `07_role_access_denial.png` | Postman (`POST http://localhost:8080/jobs` with `JOB_SEEKER` token) | - Status: `403 Forbidden`<br>- Structured JSON error: `{"status": 403, "error": "Forbidden", "message": "Access Denied"}` | Pending Capture |
| **08** | `08_recruiter_ownership_denial.png` | Postman (`PUT http://localhost:8080/jobs/{otherRecruiterJobId}`) | - Status: `403 Forbidden`<br>- Message: `Access denied: You do not own this job posting.` | Pending Capture |
| **09** | `09_duplicate_application_409.png` | Postman (`POST http://localhost:8080/applications` duplicate submission) | - Status: `409 Conflict`<br>- Message: `You have already applied for this job posting.` | Pending Capture |
| **10** | `10_mysql_jobs_table.png` | MySQL Workbench / CLI (`SELECT * FROM talentpulse_jobs.jobs;`) | - Database: `talentpulse_jobs`<br>- Record showing `recruiter_id`, `status` (`DRAFT`, `ACTIVE`, `CLOSED`), timestamps | Pending Capture |
| **11** | `11_mysql_applications_table.png` | MySQL Workbench / CLI (`SELECT * FROM talentpulse_applications.applications;`) | - Database: `talentpulse_applications`<br>- Record showing `candidate_id`, `job_id`, `recruiter_id`, `status` (`APPLIED`, `SHORTLISTED`) | Pending Capture |
| **12** | `12_job_seeker_workflow.png` | React UI (`http://localhost:5173/jobs` & `/applications`) | - Job Seeker Dashboard<br>- Job browsing page with filters<br>- "My Applications" tracking view with current status badges | Pending Capture |
| **13** | `13_recruiter_workflow.png` | React UI (`http://localhost:5173/recruiter/jobs`) | - Recruiter Dashboard<br>- "Manage Jobs" table with status controls (`Publish`, `Close`, `Edit`)<br>- Applicant management modal showing candidate resume and status dropdown | Pending Capture |
| **14** | `14_admin_dashboard.png` | React UI (`http://localhost:5173/admin`) | - Admin Dashboard overview<br>- Platform statistics and user/job oversight screen | Pending Capture |
| **15** | `15_service_failure_handling.png` | Postman (`GET http://localhost:8080/jobs` with Job Service stopped) | - Status: `503 Service Unavailable` or `500`<br>- Clean Gateway error response without exposing internal JVM stack traces | Pending Capture |

---

## Instructions for Evidence Capture

1. **Service Startup Sequence:**
   - Terminal 1: `eureka-server` (Port 8761)
   - Terminal 2: `auth-service` (Port 8081)
   - Terminal 3: `job-service` (Port 8083)
   - Terminal 4: `application-service` (Port 8084)
   - Terminal 5: `api-gateway` (Port 8080)
   - Terminal 6: `frontend` (`npm run dev` on Port 5173)

2. **Capturing Screenshots:**
   - Save screenshots as PNG files inside `docs/review-2/screenshots/` following the naming convention listed above (`01_eureka_dashboard.png`, etc.).
   - Ensure the browser address bar, HTTP status code, and JSON payload are clearly legible in Postman and browser captures.
