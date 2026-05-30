const db = require('../../src/persistence');
const addItem = require('../../src/routes/addItem');
const ITEM = { id: 12345 };
const { v4: uuid } = require('uuid');

jest.mock('uuid', () => ({ v4: jest.fn() }));

jest.mock('../../src/persistence', () => ({
    removeItem: jest.fn(),
    storeItem: jest.fn(),
    getItem: jest.fn(),
}));

beforeEach(() => {
    jest.clearAllMocks();
});

test('it stores item correctly', async () => {
    const id = 'something-not-a-uuid';
    const name = 'A sample item';
    const req = { body: { name } };
    const res = { send: jest.fn() };

    uuid.mockReturnValue(id);

    await addItem(req, res);

    const expectedItem = {
        id,
        name,
        completed: false,
        priority: null,
        dueDate: null,
    };

    expect(db.storeItem.mock.calls.length).toBe(1);
    expect(db.storeItem.mock.calls[0][0]).toEqual(expectedItem);
    expect(res.send.mock.calls[0].length).toBe(1);
    expect(res.send.mock.calls[0][0]).toEqual(expectedItem);
});

test('it stores priority and due date when provided', async () => {
    const id = 'something-not-a-uuid';
    const req = {
        body: {
            name: 'File taxes',
            priority: 'high',
            dueDate: '2026-06-15',
        },
    };
    const res = { send: jest.fn(), status: jest.fn().mockReturnThis() };

    uuid.mockReturnValue(id);

    await addItem(req, res);

    const expectedItem = {
        id,
        name: 'File taxes',
        completed: false,
        priority: 'high',
        dueDate: '2026-06-15',
    };

    expect(db.storeItem.mock.calls[0][0]).toEqual(expectedItem);
    expect(res.send.mock.calls[0][0]).toEqual(expectedItem);
});

test('it rejects invalid priority values', async () => {
    const req = { body: { name: 'File taxes', priority: 'urgent' } };
    const res = { send: jest.fn(), status: jest.fn().mockReturnThis() };

    await addItem(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
        error: 'Priority must be high, medium, or low.',
    });
    expect(db.storeItem).not.toHaveBeenCalled();
});

test('it rejects invalid due date values', async () => {
    const req = { body: { name: 'File taxes', dueDate: '2026-02-30' } };
    const res = { send: jest.fn(), status: jest.fn().mockReturnThis() };

    await addItem(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
        error: 'Due date must be a valid date in YYYY-MM-DD format.',
    });
    expect(db.storeItem).not.toHaveBeenCalled();
});
