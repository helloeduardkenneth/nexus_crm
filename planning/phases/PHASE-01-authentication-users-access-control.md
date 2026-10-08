# PHASE-01 — Authentication, Users & Access Control

Status: Not Started

Forward-looking plan: the phase structure is approved; proposed capability details
remain adaptable. Individual tasks are authored incrementally. No implementation
or completion is implied by this document.

## Phase Name and Objective

Establish secure employee access, administrative user/team management and the authorization/audit foundation for later CRM workflows.

## Why This Phase Exists

Sales, finance, support and administrators need accountable access before sensitive customer or commercial information is introduced.

## Prerequisites

- [Completed Phase 00](PHASE-00-foundation.md): application, migration and test foundations.
- Human approval of single-organization versus multi-tenant operation before persistence or authorization tasks. Neither model is assumed.
- Approved identity, account provisioning, session and visibility policies before affected implementation.

## In Scope

- Employee authentication, authenticated identity and JWT/refresh-token lifecycle in the existing roadmap direction.
- Bounded users, teams, roles, permissions, account activation/deactivation and administrative access.
- First required persisted-domain/request-boundary foundations, consistent with Phase 00's JPA/Hibernate and validation deferrals.
- Minimal audit capture and authorized audit inspection for implemented access-management actions.

## Out of Scope

- Customer/sales domains; public self-registration, external identity providers or SSO unless separately approved.
- A general organization-management platform, speculative tenancy implementation, Redis, RabbitMQ or microservices.
- Finalizing token transport/storage, recovery channels or schemas during phase planning.

## Core User Workflows

Administrator provisions an employee → assigns approved role/team access → employee signs in → sees permitted navigation/account actions → refreshes or ends a session.

Administrator changes permissions or deactivates an account → subsequent access follows the approved revocation policy → authorized administrator inspects attributable history.

## UX and Usability Requirements

- Clear sign-in errors without account enumeration; understandable permission-denied and expired-session recovery.
- Small role-appropriate landing views, helpful empty states and obvious account/admin actions rather than an empty advanced dashboard.
- Accessible labels, keyboard/focus behavior, responsive forms, confirmations and safe context restoration after sign-in.

## Backend Responsibilities

- Spring Security authentication and authoritative permission checks; validated DTO boundaries and consistent safe errors.
- Flyway-managed identity persistence, transactional administration and the first necessary JPA/Hibernate integration with schema validation, never schema mutation.
- Audit identity, secret redaction and approved session revocation/refresh behavior; no future empty modules.

## Frontend Responsibilities

- Sign-in/account interactions, user/team/role administration and permission-aware navigation.
- Keep server identity distinct from shared UI state; use existing React Router, React Hook Form and Zustand according to their established responsibilities.
- Permission hiding is UX, not a replacement for backend authorization.

## Data Model Direction

Conceptual users, bounded teams, roles, permissions, memberships and session/token lifecycle records. Organizational boundaries affect every relationship and must be approved first. Audit events identify actor, action, target, time and outcome without credential contents. Detailed schemas and token representation remain task decisions.

## Authorization / Security Considerations

- Enforce permissions on administration, audit access and every protected operation; prevent self-escalation and unauthorized assignment.
- Approve object/team/organizational visibility rules and initial administrator provisioning before exposing persistent data.
- Password protection, refresh replay/revocation, account deactivation and token leakage require explicit verification; never log secrets.

## Auditability

Capture user provisioning, role/permission/team changes, activation changes, session/security outcomes and relevant denied privileged actions. Distinguish audit records from diagnostic logs; record sufficient context without passwords, tokens or excessive personal data. Retention/access decisions remain gated.

## Testing Expectations

- Unit tests for identity/permission rules; PostgreSQL integration for constraints, memberships and lifecycle consistency.
- Authentication-negative, privilege-escalation, refresh replay, revocation/deactivation and cross-boundary access cases under the approved model.
- Frontend sign-in/error/navigation/keyboard tests and real browser workflow verification; reuse existing tooling rather than installing E2E infrastructure automatically.

## Performance / Concurrency Considerations

Concurrent refresh, duplicate provisioning and role changes must not silently grant inconsistent access. Choose transactional constraints and conflict handling when tasks define invariants. Bound user/audit lists; avoid persistence N+1 behavior. Revocation consistency must match the approved session contract.

## Acceptance Criteria

- [ ] Organization scope and identity/session/visibility policies are explicitly approved before affected tasks.
- [ ] Employees can sign in, use permitted functionality and end sessions under the approved lifecycle.
- [ ] Authorized administrators manage users, bounded teams and access without enabling privilege escalation.
- [ ] Direct backend requests with missing or insufficient access are rejected, including relevant cross-boundary cases.
- [ ] Account/permission changes have the approved access effect and attributable audit history without secrets.
- [ ] Accessible sign-in/admin workflows and meaningful basic landing actions work without advanced reporting.
- [ ] Required tests, regression verification, independent review and QA pass.

## Candidate Tasks

1. Resolve organization, identity/session and visibility decision gates.
2. Introduce required identity persistence, validated request boundaries and audit capture alongside the first mutations.
3. Implement authentication and approved session lifecycle.
4. Establish users, bounded teams and backend-enforced RBAC with attributable mutation history.
5. Deliver authorized inspection of access-management audit events.
6. Deliver accessible sign-in/account/admin workflows.
7. Verify security-negative, concurrency and regression scenarios.

## Deferred Decisions / Risks

Established: modular monolith, existing Spring/React stack, DTO boundaries, backend authorization, Flyway authority and PostgreSQL testing. See [repository instructions](../../AGENTS.md).

Proposed: bounded team administration and access-related audit inspection; no broad tenant administration.

Deferred approval gates: organization scope before persistence/authorization; provisioning and recovery requirements, JWT transport/storage/rotation/revocation, initial administrator creation, role/visibility matrix and audit retention before affected tasks. Empty architecture/security documents do not approve these choices.
