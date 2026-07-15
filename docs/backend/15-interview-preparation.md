# Backend Interview Preparation

## 2-Minute Backend Explanation

Madai has an ASP.NET Core Web API backend that supports a React frontend. It handles demo user authentication, JWT token creation, profile APIs, symptom checker APIs, doctor search, and safe medical report upload/history. My portfolio-polish work focuses on documenting the backend, making risky health-data flows safer, and aligning frontend/backend contracts one feature at a time.

## 5-Minute Technical Backend Explanation

The backend uses controllers for HTTP endpoints, services for business logic, contracts/interfaces for dependency injection, DTOs for request/response shapes, EF Core for database access, and JWT bearer authentication for protected endpoints. It uses SQLite locally and has integrations for OpenRouter-style AI, Google Places doctor search, and PDF text extraction. Because this is health-related, I treat it as fake/demo data only and avoid real medical documents or private health information.

## ASP.NET Core Web API

Say:

"ASP.NET Core Web API lets me expose HTTP endpoints with controllers. The Madai backend maps routes like `/api/auth/signin` and `/api/SymptomChecker` to controller actions."

## Controllers

Say:

"Controllers receive HTTP requests, validate input, call services or EF Core, and return HTTP responses."

## Services and Interfaces

Say:

"Services keep business logic out of controllers. Interfaces like `IAuthService` and `IDoctorService` make dependencies easier to replace and test."

## DTOs vs Entities

Say:

"Entities represent database tables. DTOs represent API input/output. DTOs help prevent leaking sensitive fields like password hashes or file bytes."

## EF Core

Say:

"EF Core is the ORM. `AppDbContext` exposes DbSets for users, symptoms, reports, and analysis results. Migrations track database schema changes."

## JWT Authentication

Say:

"After login, the backend creates a signed JWT. The frontend sends it as a bearer token. ASP.NET Core validates the token before protected endpoints run."

## Role-Based Authorization

Say:

"Roles like `Patient` and `Admin` are stored in the user model and included in JWT claims. Endpoints use `[Authorize(Roles = "Patient")]` or `[Authorize(Roles = "Admin")]`."

## External AI Service Safety

Say:

"External AI calls can expose sensitive text, so the portfolio demo uses fake data and safe fallbacks. I also document which endpoints still need more hardening."

## File Upload Safety

Say:

"Report upload is high risk. I added PDF type/size validation, disabled downloads, and made new demo uploads store metadata/analysis only instead of PDF bytes."

## Group Project Attribution

Say:

"Madai was originally created as a bachelor group project. I do not claim sole authorship of the original project."

## Portfolio-Polish Role

Say:

"My role is the portfolio-polish work: audit, documentation, safety cleanup, API contract alignment, safer demo behavior, and deployment readiness."

## AI-Assisted Development

"I used AI coding tools as a development assistant, but I reviewed, tested, debugged, documented, and improved the project myself."

## 15 Backend Interview Questions and Junior Answers

1. What does the backend do?
   - It provides APIs for auth, profile, symptoms, doctor search, and report upload/history.

2. What is a controller?
   - A class that maps HTTP requests to C# actions.

3. What is a service?
   - A class that holds business logic or external API logic.

4. What is dependency injection?
   - ASP.NET Core creates and provides services to controllers instead of manually creating them.

5. What is a DTO?
   - A request/response shape used by the API.

6. Why not return entities directly?
   - Entities can expose sensitive or internal fields.

7. What is EF Core?
   - An ORM that maps C# objects to database tables.

8. What is `AppDbContext`?
   - The EF Core context that defines database tables and relationships.

9. How does login work?
   - The backend verifies the password hash and returns a JWT.

10. Why use BCrypt?
    - To store password hashes instead of plain passwords.

11. What is JWT?
    - A signed token containing claims like user id and role.

12. What does `[Authorize]` do?
    - It blocks unauthenticated requests.

13. What is CORS?
    - Browser security that controls which frontend origins can call the backend.

14. Why are report uploads risky?
    - PDFs can contain private health information.

15. What would you improve next?
    - Add tests, centralized errors, health endpoint, safer recommendation fallback, production CORS, and CI.
