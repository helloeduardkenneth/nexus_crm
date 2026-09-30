# TASK-0002 — Spring Boot Bootstrap

## Phase

PHASE-00 — Foundation

## Status

Not Started

## Objective

Create the initial NexusCRM backend as a minimal Java 21 Spring Boot
application built with Maven.

The resulting application must compile, pass its automated startup
test, and start successfully without requiring external infrastructure.

## Context

NexusCRM requires a working backend foundation before database,
security, or business functionality can be introduced.

This task establishes the executable Spring Boot application, Maven
build, reproducible Maven Wrapper, basic configuration, and initial
startup test. Later Phase 00 tasks will add PostgreSQL, Flyway, and
additional testing infrastructure.

## Requirements

- Create the Spring Boot project under `backend/`.
- Use Java 21 as the source and target Java version.
- Use Spring Boot 4.1.1.
- Use Maven 3.9.16 through the Maven Wrapper.
- Use the following Maven identity:
  - Group: `io.github.helloeduardkenneth`
  - Artifact: `nexus-crm-backend`
  - Version: `0.0.1-SNAPSHOT`
- Use the base Java package:
  `io.github.helloeduardkenneth.nexuscrm`
- Package the application as an executable JAR.
- Add only these direct Spring dependencies:
  - `spring-boot-starter-web`
  - `spring-boot-starter-test` with test scope
- Configure the Spring Boot Maven plugin.
- Commit the cross-platform Maven Wrapper:
  - `.mvn/wrapper/maven-wrapper.properties`
  - `mvnw`
  - `mvnw.cmd`
- Create `NexusCrmApplication` as the application entry point.
- Create `src/main/resources/application.yml`.
- Configure the application name as `nexus-crm-backend`.
- Add a JUnit startup test named `NexusCrmApplicationTests`.
- Use a standard `@SpringBootTest` context-load test to prove that the
  Spring application context starts successfully.
- Ensure Maven build output under `backend/target/` is ignored by Git.
- Remove `backend/.gitkeep` after real backend files exist.

## Constraints

- Do not add PostgreSQL or a PostgreSQL driver.
- Do not add Spring Data JPA or Hibernate.
- Do not add Flyway or database migrations.
- Do not add Spring Security, authentication, JWT, users, roles, or
  permissions.
- Do not add business domains, services, repositories, controllers,
  DTOs, or API endpoints.
- Do not pre-create packages for future domain modules.
- Do not add Docker or Docker Compose configuration.
- Do not add Lombok, Actuator, DevTools, Testcontainers, Mockito
  declarations beyond what the test starter manages, or other
  unrequested dependencies.
- Do not modify frontend files or install frontend dependencies.
- Do not replace `application.yml` with a properties file.
- Do not rely on a globally installed Maven version for verification.

## Expected Result

The `backend/` directory contains:

- a Maven `pom.xml`
- Maven Wrapper scripts and configuration
- the `NexusCrmApplication` entry point
- a minimal `application.yml`
- a Spring Boot context-load test
- the existing backend-specific `AGENTS.md`

The backend can be compiled, tested, packaged, and started using the
Maven Wrapper without PostgreSQL or other external services.

## Acceptance Criteria

- [ ] The Maven project targets Java 21.
- [ ] Spring Boot 4.1.1 is configured.
- [ ] The Maven Wrapper pins Maven 3.9.16 and works on Windows and
      POSIX-compatible systems.
- [ ] `spring-boot-starter-web` is the only application starter.
- [ ] No persistence, migration, security, infrastructure, or business
      dependencies are present.
- [ ] `application.yml` exists and defines
      `spring.application.name: nexus-crm-backend`.
- [ ] `NexusCrmApplication` starts a Spring Boot application.
- [ ] The startup test loads the Spring application context.
- [ ] The project compiles successfully.
- [ ] All tests pass.
- [ ] An executable JAR is produced.
- [ ] The packaged application starts its embedded web server without
      external services.
- [ ] Maven build output is ignored by Git.
- [ ] No frontend files are changed.
- [ ] No business functionality is introduced.

## Verification

From `backend/`, run on Windows:

`mvnw.cmd --version`

Confirm that Maven 3.9.16 runs with Java 21.

`mvnw.cmd clean verify`

Confirm that compilation, the context-load test, and packaging succeed.

`java -jar target/nexus-crm-backend-0.0.1-SNAPSHOT.jar`

Confirm that the logs report `Started NexusCrmApplication` and that the
embedded web server starts successfully, then stop the process cleanly.

On macOS or Linux, use:

`./mvnw --version`

`./mvnw clean verify`

`java -jar target/nexus-crm-backend-0.0.1-SNAPSHOT.jar`

Finally:

- inspect the dependency tree for out-of-scope dependencies
- inspect Git status and the complete diff
- confirm `backend/target/` is not reported by Git
- confirm no frontend files changed

## Learning Objectives

After this task, the developer should understand:

- the standard structure of a Spring Boot Maven project
- how Java 21 is configured through Spring Boot and Maven
- how the Spring Boot application entry point starts the application
  context
- how starter dependencies and dependency management work
- why the Maven Wrapper makes builds reproducible
- how `application.yml` supplies externalized configuration
- how a Spring Boot context-load test verifies application context
  initialization
- how packaged-application startup verifies the embedded web server
- the difference between bootstrapping an application and implementing
  business functionality

## Definition of Done

1. Acceptance criteria are satisfied.
2. Maven Wrapper verification runs with Java 21.
3. The clean Maven build and all tests pass.
4. The packaged application and embedded web server start successfully.
5. Changes remain within backend bootstrap scope.
6. Git status and the complete diff have been reviewed.
7. No unresolved verification, security, or architecture issues remain.

## Completion

Status: Not Started

Implemented:

None

Verification:

None

Notes:

None
