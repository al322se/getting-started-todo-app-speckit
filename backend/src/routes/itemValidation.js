const VALID_PRIORITIES = ['high', 'medium', 'low'];

function normalizePriority(priority) {
    if (priority === undefined || priority === null || priority === '') {
        return null;
    }

    if (!VALID_PRIORITIES.includes(priority)) {
        throw new Error('Priority must be high, medium, or low.');
    }

    return priority;
}

function normalizeDueDate(dueDate) {
    if (dueDate === undefined || dueDate === null || dueDate === '') {
        return null;
    }

    if (typeof dueDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dueDate)) {
        throw new Error('Due date must be a valid date in YYYY-MM-DD format.');
    }

    const [year, month, day] = dueDate.split('-').map(Number);
    const parsed = new Date(Date.UTC(year, month - 1, day));
    const isValid =
        parsed.getUTCFullYear() === year &&
        parsed.getUTCMonth() === month - 1 &&
        parsed.getUTCDate() === day;

    if (!isValid) {
        throw new Error('Due date must be a valid date in YYYY-MM-DD format.');
    }

    return dueDate;
}

function normalizePlanningFields(body, fallback = {}) {
    return {
        priority:
            body.priority === undefined
                ? fallback.priority ?? null
                : normalizePriority(body.priority),
        dueDate:
            body.dueDate === undefined
                ? fallback.dueDate ?? null
                : normalizeDueDate(body.dueDate),
    };
}

module.exports = {
    normalizeDueDate,
    normalizePlanningFields,
    normalizePriority,
};
