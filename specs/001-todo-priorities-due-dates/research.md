# Research: Todo Priorities and Due Dates

## Decision: Extend the Existing Task Record

Add nullable `priority` and `dueDate` fields to the existing `todo_items` table and task JSON shape.

**Rationale**: The feature adds planning metadata to the current task entity rather than introducing a separate workflow. Keeping the fields on the task preserves the existing API model and minimizes client and persistence changes.

**Alternatives considered**:

- Separate planning table: rejected because there is no multi-user or history requirement and it would add unnecessary joins.
- Client-only metadata: rejected because FR-012 requires values to persist across app restarts.

## Decision: Store Due Dates as Calendar Date Strings

Use ISO calendar dates in `YYYY-MM-DD` format for API payloads and persistence.

**Rationale**: The specification defines due dates as dates, not times. ISO date strings are stable across JSON, MySQL, SQLite, and HTML date inputs without introducing timezone conversion for a time-of-day value that the feature does not need.

**Alternatives considered**:

- JavaScript timestamps: rejected because they imply time and timezone behavior outside scope.
- Locale-formatted strings: rejected because they are harder to validate and sort reliably.

## Decision: Treat Unset Priority as Medium in Behavior

Allow persisted `priority` to be null for backward compatibility, but normalize item behavior so unset priority sorts and displays as medium.

**Rationale**: Existing tasks must remain usable without migration surprises, while the UI and sort order need one consistent priority rank.

**Alternatives considered**:

- Backfill every existing row to `medium`: acceptable but not required; nullable storage better distinguishes user-set values from implied behavior.
- Force a priority during create/edit: rejected because FR-002 allows priority to be unset.

## Decision: Backend Validates Shared State

Validate `priority` and `dueDate` in backend create/update routes before persistence; render validation errors as client-facing messages.

**Rationale**: The API is the shared data boundary, and the constitution requires validation that affects shared state to live in the backend. Client validation can improve ergonomics but cannot be the only guard.

**Alternatives considered**:

- Client-only validation: rejected because malformed API calls could still persist invalid data.
- Database-only constraints: rejected because validation messages would be harder to keep clear and consistent.

## Decision: Default Ordering Happens in the Client

Return complete task data from `/api/items`; sort tasks in `TodoListCard` for the primary list by completion, overdue status, earliest due date, priority, and stable fallback order.

**Rationale**: The app has one client view and no API-level pagination. Keeping presentation ordering in the client avoids making the backend route less reusable while still satisfying the visible list behavior.

**Alternatives considered**:

- SQL `ORDER BY` in persistence: rejected for this feature because completed-task visual grouping and overdue calculation depend on current client display behavior.
- New sort endpoint: rejected as unnecessary surface area for a single list.

## Decision: No New Runtime Dependencies

Use existing React Bootstrap controls, native `<input type="date">`, and small local utility functions for validation and ordering.

**Rationale**: The feature needs simple enum/date handling. Adding a date library would increase dependency surface without solving a real problem in this scope.

**Alternatives considered**:

- Date utility library: rejected because calendar-date parsing and comparison are simple with ISO date strings.
