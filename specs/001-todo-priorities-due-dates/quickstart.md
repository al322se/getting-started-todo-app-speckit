# Quickstart: Todo Priorities and Due Dates

## Run the App

```powershell
docker compose up --watch
```

Open `http://localhost`.

## Backend Verification

Run backend tests:

```powershell
cd backend
npm test
```

Expected coverage for this feature:

- Creating a task accepts valid `priority` and `dueDate`.
- Creating a task rejects invalid priority or due date values.
- Updating a task can add, change, or clear `priority` and `dueDate`.
- Existing rows without the new columns or values remain readable.
- Completed tasks with past due dates are not treated as overdue by returned data or documented client behavior.

## Client Verification

Run client checks:

```powershell
cd client
npm run lint
npm run build
```

Manual story checks at `http://localhost`:

1. Create a task with priority `high` and a future due date. Confirm both values appear on the task.
2. Edit or update an existing task to set, change, and clear priority and due date. Confirm saved values persist after refresh.
3. Create high, medium, and low priority tasks. Confirm priority is visually distinguishable and unset priority appears as medium behavior.
4. Create an incomplete task with yesterday's due date. Confirm it is clearly marked overdue.
5. Mark the overdue task complete. Confirm it remains completed and no longer appears as overdue.
6. Create several incomplete tasks with overdue, earlier, later, and no due dates. Confirm overdue tasks appear first, then earliest due dates, then priority when due-date urgency matches.

Manual sort cases for the primary list:

- Incomplete overdue tasks appear before incomplete future-dated and undated tasks.
- Two incomplete tasks with different due dates are ordered by the earlier date first.
- Two incomplete tasks with the same due date are ordered high, then medium, then low priority.
- Incomplete tasks without due dates stay after dated incomplete tasks unless completion status changes.
- Completed tasks stay after incomplete tasks, including completed tasks with past due dates.

## Data Safety Check

Before implementation testing, keep the existing `todo-mysql-data` volume. After the feature runs, previously created tasks must still be visible and editable.

Only remove the volume for a clean manual reset:

```powershell
docker compose down -v
```
