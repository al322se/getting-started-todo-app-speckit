# Feature Specification: Todo Priorities and Due Dates

**Feature Branch**: `001-todo-priorities-due-dates`

**Created**: 2026-05-30

**Status**: Draft

**Input**: User description: "Add priorities and due dates to the todo list application."

## Clarifications

### Session 2026-05-30

- Q: How should incomplete tasks be ordered when both due dates and priorities are present? -> A: Sort by overdue status and earliest due date first, then priority.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Assign Priority and Due Date (Priority: P1)

As a todo app user, I want to set a priority and due date when creating or editing a task so that I can identify what matters most and when it must be completed.

**Why this priority**: This is the core user value of the feature; priorities and due dates are not useful unless users can add and change them on tasks.

**Independent Test**: Can be fully tested by creating a task with a priority and due date, editing those values, and confirming the task still displays the selected planning details.

**Acceptance Scenarios**:

1. **Given** the user is creating a new task, **When** they choose a priority and a due date before saving, **Then** the saved task shows the selected priority and due date.
2. **Given** an existing task has no priority or due date, **When** the user edits the task and adds both values, **Then** the task is saved with those values.
3. **Given** an existing task already has a priority and due date, **When** the user changes or clears either value, **Then** the task reflects the updated values after saving.

---

### User Story 2 - Recognize Urgent and Overdue Tasks (Priority: P2)

As a todo app user, I want the task list to make priority, due date, and overdue status easy to recognize so that I can decide what to work on next without opening every task.

**Why this priority**: Once planning details exist, the main list must surface them clearly enough to support day-to-day task selection.

**Independent Test**: Can be fully tested by viewing tasks with different priorities and due dates, including an overdue task, and confirming their status is visible in the list.

**Acceptance Scenarios**:

1. **Given** tasks have high, medium, and low priorities, **When** the user views the task list, **Then** each task shows its priority in a visually distinguishable way.
2. **Given** a task has a due date, **When** the user views the task list, **Then** the due date is visible with the task.
3. **Given** a task is incomplete and its due date has passed, **When** the user views the task list, **Then** the task is clearly marked as overdue.

---

### User Story 3 - Order Tasks by Planning Signals (Priority: P3)

As a todo app user, I want tasks to be ordered by priority and due date so that the list naturally promotes the most time-sensitive and important tasks.

**Why this priority**: Ordering improves productivity after the core fields and visible status are available, but the feature remains valuable without advanced ordering.

**Independent Test**: Can be fully tested by creating tasks with different priorities and due dates and confirming the list presents more urgent tasks ahead of less urgent tasks.

**Acceptance Scenarios**:

1. **Given** several incomplete tasks include overdue, due-soon, and later-due tasks, **When** the user views the list, **Then** overdue tasks appear first, followed by tasks with the earliest due dates.
2. **Given** several incomplete tasks have the same overdue or due-date status but different priorities, **When** the user views the list, **Then** higher-priority tasks appear before lower-priority tasks.
3. **Given** completed tasks are present, **When** the user views the list, **Then** completed tasks remain visually distinct and do not obscure incomplete urgent work.

### Edge Cases

- A task may be saved without a priority; it is treated as normal priority for display and ordering.
- A task may be saved without a due date; it is shown without deadline status and appears after dated tasks when priority is otherwise equal.
- A completed task with a past due date is not marked as overdue.
- If the current date changes while the app is open, overdue status is refreshed the next time the task list is viewed or updated.
- Invalid, impossible, or incomplete due date entries are rejected with a clear message before the task is saved.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Users MUST be able to assign one priority value to each task from a fixed set: high, medium, or low.
- **FR-002**: Users MUST be able to leave priority unset; unset priority MUST behave as medium priority wherever tasks are displayed or ordered.
- **FR-003**: Users MUST be able to assign one due date to each task.
- **FR-004**: Users MUST be able to leave due date unset.
- **FR-005**: Users MUST be able to add, change, or clear a task's priority and due date when creating or editing a task.
- **FR-006**: The task list MUST display each task's priority when a priority is set or implied.
- **FR-007**: The task list MUST display each task's due date when a due date is set.
- **FR-008**: The system MUST clearly identify incomplete tasks whose due date is earlier than the current date as overdue.
- **FR-009**: Completed tasks MUST NOT be identified as overdue, even when their due date is earlier than the current date.
- **FR-010**: The task list MUST order incomplete tasks by overdue status first, earliest due date second, and priority third when tasks have the same due-date urgency.
- **FR-011**: Existing tasks without priority or due date MUST remain usable and visible after the feature is introduced.
- **FR-012**: The system MUST preserve each task's priority and due date across app restarts.
- **FR-013**: The system MUST reject invalid due date values before saving and explain what the user must correct.
- **FR-014**: User-facing documentation or release notes MUST describe any changed task fields or observable task behavior introduced by this feature.

### Key Entities

- **Task**: A todo item that represents work the user wants to track. Key attributes include title, completion state, priority, and due date.
- **Priority**: The task importance level selected by the user. Valid values are high, medium, and low; unset priority behaves as medium.
- **Due Date**: The calendar date by which the user expects to complete the task. It may be unset.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 95% of users can create a task with a priority and due date in under 30 seconds during usability testing.
- **SC-002**: At least 95% of users can identify the highest-priority overdue incomplete task in a mixed list within 10 seconds.
- **SC-003**: 100% of existing tasks remain visible and editable after the feature is introduced.
- **SC-004**: In validation testing, 100% of invalid due date attempts are blocked before saving with a clear corrective message.
- **SC-005**: At least 90% of users report that the updated list makes it easier to decide what to work on next.

## Assumptions

- The app has a single general task list and does not require per-user permissions or shared-task workflows for this feature.
- Due dates are calendar dates, not specific times of day.
- "Overdue" means incomplete and due before the current calendar date.
- The first version uses three priority levels: high, medium, and low.
- Sorting behavior applies to the primary task list; additional filtering or custom sort controls are outside the initial scope unless added later.
- For incomplete tasks, due-date urgency takes precedence over priority when determining default list order.
