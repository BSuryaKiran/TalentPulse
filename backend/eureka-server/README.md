# TalentPulse – Eureka Discovery Server

The **Eureka Discovery Server** is a Spring Cloud Netflix Eureka service registry providing centralized service discovery and dynamic instance address resolution for the TalentPulse enterprise microservices topology.

---

## Technical Stack & Configuration

- **Framework:** Spring Boot 3.3.0 / Spring Cloud 2023.0.3
- **Default Port:** `8761`
- **Dashboard URL:** `http://localhost:8761`
- **Service Name:** `eureka-server`

---

## Configuration Properties

| Variable / Property | Description | Default Value |
| :--- | :--- | :--- |
| `SERVER_PORT` / `server.port` | Eureka HTTP Port | `8761` |
| `eureka.instance.hostname` | Registry Hostname | `localhost` |
| `eureka.client.register-with-eureka` | Standalone mode disable self-registration | `false` |
| `eureka.client.fetch-registry` | Standalone mode disable registry fetching | `false` |
| `eureka.server.enable-self-preservation` | Self-preservation mode (disabled for quick dev eviction) | `false` |

---

## Registered Microservices

When backend services start up, they register with Eureka using their application names:

| Service Application Name | Role | Default Port |
| :--- | :--- | :--- |
| `AUTH-SERVICE` | Authentication & JWT Token Management | `8081` |
| `JOB-SERVICE` | Job Requisitions & Candidate Browsing | `8083` |
| `APPLICATION-SERVICE` | Job Application Tracking & Pipelines | `8084` |
| `PROFILE-SERVICE` | User Profiles & Resumes (Pending) | `8082` |
| `API-GATEWAY` | Edge Routing & Single API Entry Point | `8080` |

---

## Running Locally

```bash
cd backend/eureka-server

# Run unit tests
mvn clean test

# Run Eureka Server
mvn spring-boot:run
```

Once running, navigate to [http://localhost:8761](http://localhost:8761) to view the Eureka Web Dashboard.
