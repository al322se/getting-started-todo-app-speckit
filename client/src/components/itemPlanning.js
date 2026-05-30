export const PRIORITY_OPTIONS = ['high', 'medium', 'low'];

const PRIORITY_RANK = {
    high: 0,
    medium: 1,
    low: 2,
};

export function effectivePriority(item) {
    return item.priority || 'medium';
}

export function formatPriority(priority) {
    return priority.charAt(0).toUpperCase() + priority.slice(1);
}

export function isOverdue(item, today = new Date()) {
    if (item.completed || !item.dueDate) return false;

    return item.dueDate < toLocalDateString(today);
}

export function formatDueDate(dueDate) {
    if (!dueDate) return null;

    const [year, month, day] = dueDate.split('-').map(Number);
    return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(year, month - 1, day));
}

export function sortItemsByPlanning(items, today = new Date()) {
    return items
        .map((item, index) => ({ item, index }))
        .sort((left, right) => compareItems(left, right, today))
        .map(({ item }) => item);
}

function compareItems(left, right, today) {
    const leftItem = left.item;
    const rightItem = right.item;

    if (leftItem.completed !== rightItem.completed) {
        return leftItem.completed ? 1 : -1;
    }

    if (!leftItem.completed) {
        const leftOverdue = isOverdue(leftItem, today);
        const rightOverdue = isOverdue(rightItem, today);

        if (leftOverdue !== rightOverdue) return leftOverdue ? -1 : 1;
    }

    const leftDueDate = leftItem.dueDate || '9999-12-31';
    const rightDueDate = rightItem.dueDate || '9999-12-31';

    if (leftDueDate !== rightDueDate) {
        return leftDueDate < rightDueDate ? -1 : 1;
    }

    const priorityDelta =
        PRIORITY_RANK[effectivePriority(leftItem)] -
        PRIORITY_RANK[effectivePriority(rightItem)];

    if (priorityDelta !== 0) return priorityDelta;

    return left.index - right.index;
}

function toLocalDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}
