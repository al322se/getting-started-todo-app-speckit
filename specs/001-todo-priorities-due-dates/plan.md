# Implementation Plan: Todo Priorities and Due Dates

**Branch**: `001-todo-priorities-due-dates` | **Date**: 2026-05-30 | **Spec**: `specs/001-todo-priorities-due-dates/spec.md`

**Input**: Feature specification from `specs/001-todo-priorities-due-dates/spec.md`

## Summary

Add optional priority and due date planning fields to todo items so users can create, edit, recognize, and order tasks by urgency. The backend will validate and persist `priority` and `dueDate` through the existing `/api/items` routes, while the React client will add Bootstrap form controls, list badges, overdue status, and default ordering without changing the Docker Compose runtime.

## Technical Context

**Language/Version**: JavaScript on Node.js backend and React 19/Vite client

**Primary Dependencies**: Express 5.1, mysql2, sqlite3, uuid, React 19.1, Bootstrap 5.3, React Bootstrap 2.10

**Storage**: MySQL in Docker Compose for development, SQLite for local/test persistence modules

**Testing**: Jest for backend route and persistence behavior; client verification through Vite build/lint and manual quickstart scenarios

**Target Platform**: Docker Compose web app served through Traefik at `http://localhost` with backend API under `/api`

**Project Type**: Web application with split `client/` React frontend and `backend/` Express API

**Performance Goals**: Sorting and display logic must remain instant for normal sample-app list sizes; no additional network round trips beyond existing create/update/list calls

**Constraints**: Preserve `docker compose up --watch`; keep client data access through `/api`; avoid new runtime dependencies unless implementation discovers a concrete need

**Scale/Scope**: Single general todo list; one task entity; two new optional fields; no multi-user, filtering, notifications, or time-of-day scheduling

## Constitution Check

*GATE: Passed before Phase 0 research. Re-check after Phase 1 design: Passed.*

- **Container workflow**: Pass. No Compose, Dockerfile, port, or service changes are planned; `docker compose up --watch` remains the full-stack development path.
- **Client/API boundary**: Pass. Backend owns persistence, validation, and JSON response shape for `priority` and `dueDate`; client owns form controls, visual status, and presentation ordering.
- **Story verification**: Pass. Backend changes require Jest coverage for create, update, validation, persistence, and ordering data shape. Client behavior is covered by documented manual verification in `quickstart.md`, plus lint/build checks.
- **Data persistence safety**: Pass. Existing `todo_items` rows must remain visible by adding nullable `priority` and `dueDate` columns if missing; unset priority is normalized as medium for API output and ordering behavior.
- **Documentation impact**: Pass. Feature quickstart documents new fields, behavior, and verification; README update is required only if implementation changes setup, commands, ports, or troubleshooting.

## Project Structure

### Documentation (this feature)

```text
specs/001-todo-priorities-due-dates/
|-- plan.md
|-- research.md
|-- data-model.md
|-- quickstart.md
|-- contracts/
|   `-- items-api.md
`-- tasks.md
```

### Source Code (repository root)

```text
backend/
|-- src/
|   |-- index.js
|   |-- persistence/
|   |   |-- index.js
|   |   |-- mysql.js
|   |   `-- sqlite.js
|   `-- routes/
|       |-- addItem.js
|       |-- getItems.js
|       `-- updateItem.js
`-- spec/
    |-- persistence/
    |   `-- sqlite.spec.js
    `-- routes/
        |-- addItem.spec.js
        |-- getItems.spec.js
        `-- updateItem.spec.js

client/
`-- src/
    |-- App.jsx
    |-- index.scss
    `-- components/
        |-- AddNewItemForm.jsx
        |-- ItemDisplay.jsx
        |-- ItemDisplay.scss
        `-- TodoListCard.jsx
```

**Structure Decision**: Use the existing split web application structure: Express API and persistence changes in `backend/`, React/Bootstrap UI changes in `client/`, and feature documentation under `specs/001-todo-priorities-due-dates/`.

## Complexity Tracking

No constitution violations or added architectural complexity are currently justified.

## Phase 0: Research Summary

See `research.md` for decisions. All planning unknowns are resolved without adding new dependencies or changing the runtime architecture.

## Phase 1: Design Summary

See `data-model.md` for task field definitions and validation rules, `contracts/items-api.md` for the `/api/items` JSON contract, and `quickstart.md` for story-level verification.
