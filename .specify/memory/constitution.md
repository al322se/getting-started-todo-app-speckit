<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles:
- Template principle 1 -> I. Container-First Development
- Template principle 2 -> II. Client/API Boundary Integrity
- Template principle 3 -> III. Testable User Stories
- Template principle 4 -> IV. Data Persistence Safety
- Template principle 5 -> V. Documentation and Developer Ergonomics
Added sections:
- Technology and Runtime Constraints
- Delivery Workflow and Quality Gates
Removed sections:
- None
Templates requiring updates:
- updated .specify/templates/plan-template.md
- updated .specify/templates/spec-template.md
- updated .specify/templates/tasks-template.md
- n/a .specify/templates/commands/*.md (directory not present)
Deferred items:
- None
-->
# Getting Started Todo App Constitution

## Core Principles

### I. Container-First Development

All application development MUST preserve the Docker Compose workflow as the
primary local runtime. Changes to backend, client, database, proxy, or tooling
MUST keep `docker compose up --watch` as the documented path for running the
full stack. Local-only shortcuts MAY exist, but they MUST NOT become the only
validated way to develop or test a feature.

Rationale: this project exists to demonstrate Docker development practices, so
the containerized workflow is part of the product surface.

### II. Client/API Boundary Integrity

The React client MUST communicate with application data through the backend API
under `/api`. Backend changes MUST preserve explicit route behavior and stable
JSON response shapes unless the feature specification documents a breaking
contract change. Client features MUST keep view logic in the client and data
access, persistence, and validation that affects shared state in the backend.

Rationale: the project is intentionally split into a Vite client and an
Express API during development, while production packaging serves the compiled
client through the backend.

### III. Testable User Stories

Every feature specification MUST define independently testable user stories and
acceptance scenarios. Implementation tasks that change backend behavior MUST
include Jest coverage for the affected route, persistence, or service behavior.
Client-only changes MUST include either automated coverage or a documented
manual verification path in the feature quickstart. Tests MUST be run, or the
reason they could not be run MUST be recorded before delivery.

Rationale: the sample app is intended to be learnable and safe to change; each
story must provide a clear path from requirement to verification.

### IV. Data Persistence Safety

Changes that affect todo data, schema, database connection behavior, or seed
state MUST define how existing local data is preserved, migrated, or safely
discarded. Development credentials in Compose MAY remain simple for local use,
but production-like examples MUST NOT introduce hard-coded secrets outside
local development configuration.

Rationale: MySQL state is persisted in a Docker volume, so data and schema
changes need explicit handling even in a sample application.

### V. Documentation and Developer Ergonomics

Any change that alters setup, runtime ports, service names, environment
variables, tests, or troubleshooting steps MUST update the relevant README,
quickstart, or feature documentation in the same change. New conventions MUST
prefer existing project tools: React with Vite for the client, Express for the
backend, Compose for orchestration, Jest for backend tests, ESLint/Prettier for
JavaScript formatting, and Bootstrap/React Bootstrap where the current UI
already uses them.

Rationale: this repository is a teaching sample; stale or fragmented guidance
directly undermines its purpose.

## Technology and Runtime Constraints

The supported application shape is a web app with `client/` for the React/Vite
frontend and `backend/` for the Node.js/Express API. Runtime orchestration MUST
remain compatible with `compose.yaml`, including Traefik routing for
`localhost`, backend routing for `/api`, MySQL as the primary Compose database,
and phpMyAdmin for local database inspection.

New dependencies MUST be justified in the implementation plan by the user
problem they solve and by why the existing stack is insufficient. Dependency
updates MUST keep lockfiles synchronized with package manifests.

Formatting and linting MUST use the package scripts already defined in
`client/package.json` and `backend/package.json` unless the plan explicitly
documents a replacement.

## Delivery Workflow and Quality Gates

Feature work MUST begin from a specification that captures prioritized user
stories, acceptance scenarios, functional requirements, success criteria, and
assumptions. Implementation plans MUST identify the real source paths touched,
the affected client/API/data contracts, and the test or manual verification
commands for each story.

Before implementation, the Constitution Check in `plan.md` MUST pass for:
container workflow compatibility, client/API boundary impact, independent
story verification, data persistence safety, and documentation impact. Any
violation MUST be recorded in Complexity Tracking with a simpler alternative
and a reason it was rejected.

Tasks MUST be grouped by independently deliverable user story, include exact
file paths, include required tests or manual verification, and preserve the
ability to validate the MVP story before later stories are implemented.

## Governance

This constitution supersedes conflicting project conventions and templates.
Amendments require a documented change to this file, a version bump, and a
Sync Impact Report that states which templates or runtime guidance were
reviewed or updated.

Versioning follows semantic versioning:
- MAJOR for incompatible changes to governance or removal/redefinition of core
  principles.
- MINOR for new principles, new governance sections, or materially expanded
  requirements.
- PATCH for clarifications, wording fixes, and non-semantic refinements.

Every feature plan and review MUST verify constitution compliance. If a
principle cannot be met, the plan MUST document the exception, the risk, and
the follow-up needed to restore compliance.

**Version**: 1.0.0 | **Ratified**: 2026-05-30 | **Last Amended**: 2026-05-30
