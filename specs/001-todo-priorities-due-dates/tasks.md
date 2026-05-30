# Tasks: Todo Priorities and Due Dates

**Input**: Design documents from `specs/001-todo-priorities-due-dates/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/items-api.md`, `quickstart.md`

**Tests**: Backend behavior changes MUST include Jest coverage. Client behavior uses the explicit manual verification path in `quickstart.md`, plus client lint/build checks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirm the existing project surface before feature work starts.

- [ ] T001 Inspect current backend item route and persistence behavior in `backend/src/routes/addItem.js`, `backend/src/routes/updateItem.js`, `backend/src/routes/getItems.js`, `backend/src/persistence/mysql.js`, and `backend/src/persistence/sqlite.js`
- [ ] T002 Inspect current todo form and item rendering behavior in `client/src/components/AddNewItemForm.jsx`, `client/src/components/ItemDisplay.jsx`, and `client/src/components/TodoListCard.jsx`
- [ ] T003 [P] Review the API contract in `specs/001-todo-priorities-due-dates/contracts/items-api.md` against existing route tests in `backend/spec/routes/addItem.spec.js`, `backend/spec/routes/updateItem.spec.js`, and `backend/spec/routes/getItems.spec.js`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Add shared task planning fields, validation helpers, and persistence support required by every user story.

**CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T004 Create shared item validation helpers for `priority` and `dueDate` in `backend/src/routes/itemValidation.js`
- [ ] T005 [P] Add Jest coverage for valid and invalid priority/date validation in `backend/spec/routes/itemValidation.spec.js`
- [ ] T006 Add nullable `priority` and `dueDate` schema migration/backfill logic for MySQL in `backend/src/persistence/mysql.js`
- [ ] T007 Add nullable `priority` and `dueDate` schema migration/backfill logic for SQLite in `backend/src/persistence/sqlite.js`
- [ ] T008 Update MySQL `getItems`, `getItem`, `storeItem`, and `updateItem` data mapping for `priority` and `dueDate` in `backend/src/persistence/mysql.js`
- [ ] T009 Update SQLite `getItems`, `getItem`, `storeItem`, and `updateItem` data mapping for `priority` and `dueDate` in `backend/src/persistence/sqlite.js`
- [ ] T010 [P] Add SQLite persistence Jest coverage for storing, updating, clearing, and reading `priority` and `dueDate` in `backend/spec/persistence/sqlite.spec.js`

**Checkpoint**: Foundation ready - all task records can safely carry optional planning fields.

---

## Phase 3: User Story 1 - Assign Priority and Due Date (Priority: P1) MVP

**Goal**: Users can create, edit, and clear priority and due date values, and saved tasks display those planning details.

**Independent Test**: Create a task with priority and due date, edit those values on an existing task, clear either value, refresh the app, and confirm the saved task still displays the expected planning details.

### Tests for User Story 1

- [ ] T011 [P] [US1] Add create-route Jest tests for accepted `priority` and `dueDate` values in `backend/spec/routes/addItem.spec.js`
- [ ] T012 [P] [US1] Add create-route Jest tests for rejected invalid `priority` and invalid `dueDate` values in `backend/spec/routes/addItem.spec.js`
- [ ] T013 [P] [US1] Add update-route Jest tests for adding, changing, and clearing `priority` and `dueDate` in `backend/spec/routes/updateItem.spec.js`
- [ ] T014 [P] [US1] Add update-route Jest tests for rejected invalid `priority` and invalid `dueDate` values in `backend/spec/routes/updateItem.spec.js`

### Implementation for User Story 1

- [ ] T015 [US1] Update item creation to validate and persist optional `priority` and `dueDate` in `backend/src/routes/addItem.js`
- [ ] T016 [US1] Update item editing to validate, persist, and clear optional `priority` and `dueDate` in `backend/src/routes/updateItem.js`
- [ ] T017 [US1] Add priority and due date controls to the create form request flow in `client/src/components/AddNewItemForm.jsx`
- [ ] T018 [US1] Add inline edit controls for task name, priority, and due date in `client/src/components/ItemDisplay.jsx`
- [ ] T019 [US1] Preserve priority and due date when toggling completion in `client/src/components/ItemDisplay.jsx`
- [ ] T020 [US1] Render priority and due date details for each task in `client/src/components/ItemDisplay.jsx`
- [ ] T021 [US1] Add styling for editable planning fields and task metadata in `client/src/components/ItemDisplay.scss`
- [ ] T022 [US1] Run the User Story 1 manual verification steps from `specs/001-todo-priorities-due-dates/quickstart.md`

**Checkpoint**: User Story 1 is fully functional and independently testable.

---

## Phase 4: User Story 2 - Recognize Urgent and Overdue Tasks (Priority: P2)

**Goal**: Users can quickly recognize high, medium, low, due-date, and overdue states in the task list.

**Independent Test**: View tasks with each priority, a due date, an overdue incomplete task, and a completed past-due task; confirm the list distinguishes priority, shows due dates, marks only incomplete past-due tasks overdue, and leaves completed past-due tasks unmarked.

### Tests for User Story 2

- [ ] T023 [P] [US2] Add route or validation Jest coverage confirming completed past-due tasks remain valid and are returned with their due date in `backend/spec/routes/updateItem.spec.js`

### Implementation for User Story 2

- [ ] T024 [P] [US2] Add client date and priority display helpers for effective priority and overdue detection in `client/src/components/itemPlanning.js`
- [ ] T025 [US2] Apply visually distinct priority badges and due date labels in `client/src/components/ItemDisplay.jsx`
- [ ] T026 [US2] Apply overdue labeling only to incomplete past-due tasks in `client/src/components/ItemDisplay.jsx`
- [ ] T027 [US2] Add priority, due date, and overdue visual styles in `client/src/components/ItemDisplay.scss`
- [ ] T028 [US2] Run the User Story 2 manual verification steps from `specs/001-todo-priorities-due-dates/quickstart.md`

**Checkpoint**: User Stories 1 and 2 both work independently.

---

## Phase 5: User Story 3 - Order Tasks by Planning Signals (Priority: P3)

**Goal**: The primary list promotes incomplete overdue and earliest-due tasks, using priority as the tie-breaker for equal due-date urgency.

**Independent Test**: Create overdue, due-soon, later-due, undated, and completed tasks with mixed priorities; confirm incomplete overdue tasks appear first, earlier due dates appear before later dates, higher priority wins within equal urgency, and completed tasks stay visually distinct after urgent incomplete work.

### Tests for User Story 3

- [ ] T029 [P] [US3] Add client planning sort helper tests or documented manual sort cases in `specs/001-todo-priorities-due-dates/quickstart.md`

### Implementation for User Story 3

- [ ] T030 [P] [US3] Add stable task ordering helper for completion, overdue status, due date, and priority in `client/src/components/itemPlanning.js`
- [ ] T031 [US3] Apply task ordering before rendering items in `client/src/components/TodoListCard.jsx`
- [ ] T032 [US3] Ensure new and updated items are re-sorted after create, update, and completion toggle in `client/src/components/TodoListCard.jsx`
- [ ] T033 [US3] Run the User Story 3 manual verification steps from `specs/001-todo-priorities-due-dates/quickstart.md`

**Checkpoint**: All user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Validate the full feature and update user-facing guidance.

- [ ] T034 [P] Update observable field and behavior documentation in `README.md` if setup, runtime, or user-visible behavior guidance changes
- [ ] T035 [P] Confirm the API contract still matches implementation details in `specs/001-todo-priorities-due-dates/contracts/items-api.md`
- [ ] T036 Run backend Jest tests with `npm test` from `backend/`
- [ ] T037 Run client lint with `npm run lint` from `client/`
- [ ] T038 Run client build with `npm run build` from `client/`
- [ ] T039 Run full manual verification from `specs/001-todo-priorities-due-dates/quickstart.md` using `docker compose up --watch`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational completion - MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational completion; practically builds on US1 display fields.
- **User Story 3 (Phase 5)**: Depends on Foundational completion; practically builds on US2 helper/display semantics.
- **Polish (Phase 6)**: Depends on all desired user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational phase and delivers the MVP.
- **User Story 2 (P2)**: Can start after Foundational phase, but easiest after US1 metadata rendering exists.
- **User Story 3 (P3)**: Can start after Foundational phase, but easiest after US2 planning helpers exist.

### Parallel Opportunities

- T003 can run in parallel with T001 and T002 after design docs are available.
- T005 and T010 can be prepared in parallel with schema/persistence implementation.
- US1 backend route tests T011-T014 can run in parallel because they target independent acceptance cases.
- US2 helper work T024 can run in parallel with backend test T023.
- US3 ordering helper T030 can run in parallel with manual sort case documentation T029.
- Polish documentation checks T034 and contract review T035 can run in parallel before final verification commands.

---

## Parallel Example: User Story 1

```bash
# Backend tests can be authored in parallel:
Task: "T011 [US1] Add create-route Jest tests for accepted priority and dueDate values in backend/spec/routes/addItem.spec.js"
Task: "T012 [US1] Add create-route Jest tests for rejected invalid priority and invalid dueDate values in backend/spec/routes/addItem.spec.js"
Task: "T013 [US1] Add update-route Jest tests for adding, changing, and clearing priority and dueDate in backend/spec/routes/updateItem.spec.js"
Task: "T014 [US1] Add update-route Jest tests for rejected invalid priority and invalid dueDate values in backend/spec/routes/updateItem.spec.js"
```

## Parallel Example: User Story 2

```bash
Task: "T023 [US2] Add route or validation Jest coverage confirming completed past-due tasks remain valid and are returned with their due date in backend/spec/routes/updateItem.spec.js"
Task: "T024 [US2] Add client date and priority display helpers for effective priority and overdue detection in client/src/components/itemPlanning.js"
```

## Parallel Example: User Story 3

```bash
Task: "T029 [US3] Add client planning sort helper tests or documented manual sort cases in specs/001-todo-priorities-due-dates/quickstart.md"
Task: "T030 [US3] Add stable task ordering helper for completion, overdue status, due date, and priority in client/src/components/itemPlanning.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 and Phase 2.
2. Complete Phase 3 for User Story 1.
3. Run backend route and persistence tests covering create/update field behavior.
4. Run the User Story 1 manual verification steps from `quickstart.md`.
5. Stop and validate before adding overdue visuals or ordering behavior.

### Incremental Delivery

1. Add shared schema, persistence, and validation foundation.
2. Deliver US1 so planning fields can be assigned, edited, cleared, displayed, and persisted.
3. Deliver US2 so visible urgency and overdue status are clear.
4. Deliver US3 so the list order promotes urgent and important work.
5. Run final backend tests, client lint/build, and full quickstart validation.

### Parallel Team Strategy

After Phase 2, one developer can complete US1 backend/API tasks while another prepares US2/US3 client helper work in `client/src/components/itemPlanning.js`. Coordinate edits to `ItemDisplay.jsx` and `TodoListCard.jsx` because those files are shared across story phases.

---

## Format Validation

All tasks use the required checklist format: `- [ ] T### [P?] [US?] Description with file path`.
