const db = require('../../src/persistence');
const updateItem = require('../../src/routes/updateItem');
const ITEM = { id: 12345 };

jest.mock('../../src/persistence', () => ({
    getItem: jest.fn(),
    updateItem: jest.fn(),
}));

beforeEach(() => {
    jest.clearAllMocks();
});

test('it updates items correctly', async () => {
    const req = {
        params: { id: 1234 },
        body: { name: 'New title', completed: false },
    };
    const res = { send: jest.fn() };

    db.getItem.mockReturnValue(Promise.resolve(ITEM));

    await updateItem(req, res);

    expect(db.updateItem.mock.calls.length).toBe(1);
    expect(db.updateItem.mock.calls[0][0]).toBe(req.params.id);
    expect(db.updateItem.mock.calls[0][1]).toEqual({
        name: 'New title',
        completed: false,
        priority: null,
        dueDate: null,
    });

    expect(db.getItem.mock.calls.length).toBe(2);
    expect(db.getItem.mock.calls[0][0]).toBe(req.params.id);

    expect(res.send.mock.calls[0].length).toBe(1);
    expect(res.send.mock.calls[0][0]).toEqual(ITEM);
});

test('it adds and changes priority and due date', async () => {
    const updatedItem = {
        id: 1234,
        name: 'File taxes',
        completed: false,
        priority: 'high',
        dueDate: '2026-06-15',
    };
    const req = {
        params: { id: 1234 },
        body: {
            name: 'File taxes',
            completed: false,
            priority: 'high',
            dueDate: '2026-06-15',
        },
    };
    const res = { send: jest.fn(), status: jest.fn().mockReturnThis() };

    db.getItem
        .mockReturnValueOnce(Promise.resolve(ITEM))
        .mockReturnValueOnce(Promise.resolve(updatedItem));

    await updateItem(req, res);

    expect(db.updateItem.mock.calls[0][1]).toEqual({
        name: 'File taxes',
        completed: false,
        priority: 'high',
        dueDate: '2026-06-15',
    });
    expect(res.send).toHaveBeenCalledWith(updatedItem);
});

test('it clears priority and due date', async () => {
    const existingItem = {
        id: 1234,
        name: 'File taxes',
        completed: false,
        priority: 'high',
        dueDate: '2026-06-15',
    };
    const updatedItem = {
        ...existingItem,
        priority: null,
        dueDate: null,
    };
    const req = {
        params: { id: 1234 },
        body: {
            name: 'File taxes',
            completed: false,
            priority: null,
            dueDate: '',
        },
    };
    const res = { send: jest.fn(), status: jest.fn().mockReturnThis() };

    db.getItem
        .mockReturnValueOnce(Promise.resolve(existingItem))
        .mockReturnValueOnce(Promise.resolve(updatedItem));

    await updateItem(req, res);

    expect(db.updateItem.mock.calls[0][1]).toEqual({
        name: 'File taxes',
        completed: false,
        priority: null,
        dueDate: null,
    });
    expect(res.send).toHaveBeenCalledWith(updatedItem);
});

test('it preserves planning fields when omitted', async () => {
    const existingItem = {
        id: 1234,
        name: 'File taxes',
        completed: false,
        priority: 'medium',
        dueDate: '2026-06-15',
    };
    const req = {
        params: { id: 1234 },
        body: { name: 'File taxes', completed: true },
    };
    const res = { send: jest.fn(), status: jest.fn().mockReturnThis() };

    db.getItem
        .mockReturnValueOnce(Promise.resolve(existingItem))
        .mockReturnValueOnce(
            Promise.resolve({ ...existingItem, completed: true }),
        );

    await updateItem(req, res);

    expect(db.updateItem.mock.calls[0][1]).toEqual({
        name: 'File taxes',
        completed: true,
        priority: 'medium',
        dueDate: '2026-06-15',
    });
});

test('it rejects invalid priority values', async () => {
    const req = {
        params: { id: 1234 },
        body: { name: 'File taxes', completed: false, priority: 'urgent' },
    };
    const res = { send: jest.fn(), status: jest.fn().mockReturnThis() };

    db.getItem.mockReturnValue(Promise.resolve(ITEM));

    await updateItem(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
        error: 'Priority must be high, medium, or low.',
    });
    expect(db.updateItem).not.toHaveBeenCalled();
});

test('it rejects invalid due date values', async () => {
    const req = {
        params: { id: 1234 },
        body: { name: 'File taxes', completed: false, dueDate: '2026-02-30' },
    };
    const res = { send: jest.fn(), status: jest.fn().mockReturnThis() };

    db.getItem.mockReturnValue(Promise.resolve(ITEM));

    await updateItem(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
        error: 'Due date must be a valid date in YYYY-MM-DD format.',
    });
    expect(db.updateItem).not.toHaveBeenCalled();
});

test('it returns completed past-due tasks with due dates', async () => {
    const completedPastDueItem = {
        id: 1234,
        name: 'Done old task',
        completed: true,
        priority: 'low',
        dueDate: '2026-01-15',
    };
    const req = {
        params: { id: 1234 },
        body: {
            name: 'Done old task',
            completed: true,
            priority: 'low',
            dueDate: '2026-01-15',
        },
    };
    const res = { send: jest.fn(), status: jest.fn().mockReturnThis() };

    db.getItem
        .mockReturnValueOnce(Promise.resolve(ITEM))
        .mockReturnValueOnce(Promise.resolve(completedPastDueItem));

    await updateItem(req, res);

    expect(res.send).toHaveBeenCalledWith(completedPastDueItem);
});
