# TalentPulse – API Gateway Microservice

The **API Gateway** is a Spring Cloud Gateway microservice serving as the single, centralized entry point for all frontend client API requests. It handles dynamic service routing through Eureka, cross-origin resource sharing (CORS), and authorization header propagation across the TalentPulse microservice ecosystem.

---

## Technical Stack & Configuration

- **Framework:** Spring Boot 3.3.0 / Spring Cloud Gateway 2023.0.3 (Reactive WebFlux & Netty)
- **Service Discovery:** Netflix Eureka Client
- **Default Port:** `8080`
- **Service Name:** `api-gateway`

---

## Route Table

All incoming requests to the API Gateway on port `8080` are dynamically routed to backend services registered in Eureka:

| Frontend Request Path | Predicate | Destination Service | Eureka Load Balanced URI |
| :--- | :--- | :--- | :--- |
| `/auth/**` | `Path=/auth/**` | `AUTH-SERVICE` | `lb://AUTH-SERVICE` |
| `/profile/**` | `Path=/profile/**` | `PROFILE-SERVICE` | `lb://PROFILE-SERVICE` |
| `/jobs/**` | `Path=/jobs/**` | `JOB-SERVICE` | `lb://JOB-SERVICE` |
| `/applications/**` | `Path=/applications/**` | `APPLICATION-SERVICE` | `lb://APPLICATION-SERVICE` |

---

## Security & Authorization Header Preservation

- Public endpoints such as `POST /auth/login` and `POST /auth/register` pass through without interference.
- Protected endpoints forward client HTTP `Authorization: Bearer <token>` headers transparently to downstream microservices.
- No custom JWT generation or secret verification happens at the Gateway layer, keeping security decoupled and aligned with Auth Service.

---

## CORS Configuration

Configured globally for Vite and React development environments:
- **Allowed Origins:** `http://localhost:5173`, `http://127.0.0.1:5173`, `http://localhost:3000`
- **Allowed Methods:** `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`
- **Allowed Headers:** `*`
- **Allow Credentials:** `true`

---

## Running Locally

```bash
cd backend/api-gateway

# Run unit tests
mvn clean test

# Run API Gateway
mvn spring-boot:run
```
