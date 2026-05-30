# Contract: Items API

Base path: `/api/items`

## Task JSON

```json
{
  "id": "9d7b1e2f-0a7b-4d3f-8d3e-2c1c9f3b9000",
  "name": "File taxes",
  "completed": false,
  "priority": "high",
  "dueDate": "2026-06-15"
}
```

### Fields

| Field | Type | Required in response | Request behavior |
|-------|------|----------------------|------------------|
| `id` | string | Yes | Server generated on create; path parameter on update/delete. |
| `name` | string | Yes | Required for create/update by existing behavior. |
| `completed` | boolean | Yes | Created as false; update accepts explicit boolean. |
| `priority` | string or null | Yes | Optional on create/update. Valid values: `high`, `medium`, `low`, null, or omitted. Omitted/null behaves as medium. |
| `dueDate` | string or null | Yes | Optional on create/update. Valid format: `YYYY-MM-DD`, null, empty, or omitted. Null/empty clears the value. |

## GET /api/items

Returns all task items with the extended task JSON shape.

### Response 200

```json
[
  {
    "id": "9d7b1e2f-0a7b-4d3f-8d3e-2c1c9f3b9000",
    "name": "File taxes",
    "completed": false,
    "priority": "high",
    "dueDate": "2026-06-15"
  }
]
```

Existing rows without stored values must return `priority` as null or `medium` only if the implementation chooses response normalization consistently, and `dueDate` as null. Client behavior must treat either null or omitted legacy priority as medium.

## POST /api/items

Creates a new incomplete task.

### Request

```json
{
  "name": "File taxes",
  "priority": "high",
  "dueDate": "2026-06-15"
}
```

### Response 200

Returns the created task JSON with `completed: false`.

### Validation Failure 400

```json
{
  "error": "Due date must be a valid date in YYYY-MM-DD format."
}
```

Validation failures must not persist the task.

## PUT /api/items/{id}

Updates task title, completion state, priority, and due date.

### Request

```json
{
  "name": "File taxes",
  "completed": true,
  "priority": null,
  "dueDate": null
}
```

### Response 200

Returns the updated task JSON.

### Validation Failure 400

```json
{
  "error": "Priority must be high, medium, or low."
}
```

Validation failures must not update the task.

## DELETE /api/items/{id}

Existing behavior is unchanged. Deletes a task by id and returns the existing delete response.
