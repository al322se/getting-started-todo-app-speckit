const db = require('../../src/persistence/sqlite');
const fs = require('fs');
const location = process.env.SQLITE_DB_LOCATION || '/etc/todos/todo.db';

const ITEM = {
    id: '7aef3d7c-d301-4846-8358-2a91ec9d6be3',
    name: 'Test',
    completed: false,
    priority: null,
    dueDate: null,
};

beforeEach(async () => {
    try {
        await db.teardown();
    } catch (err) {
        // The database may not be initialized before the first test.
    }

    if (fs.existsSync(location)) {
        fs.unlinkSync(location);
    }
});

afterEach(async () => {
    await db.teardown();
});

test('it initializes correctly', async () => {
    await db.init();
});

test('it can store and retrieve items', async () => {
    await db.init();

    await db.storeItem(ITEM);

    const items = await db.getItems();
    expect(items.length).toBe(1);
    expect(items[0]).toEqual(ITEM);
});

test('it can update an existing item', async () => {
    await db.init();

    const initialItems = await db.getItems();
    expect(initialItems.length).toBe(0);

    await db.storeItem(ITEM);

    await db.updateItem(
        ITEM.id,
        Object.assign({}, ITEM, { completed: !ITEM.completed }),
    );

    const items = await db.getItems();
    expect(items.length).toBe(1);
    expect(items[0].completed).toBe(!ITEM.completed);
});

test('it can store and retrieve planning fields', async () => {
    await db.init();

    await db.storeItem({
        ...ITEM,
        priority: 'high',
        dueDate: '2026-06-15',
    });

    const item = await db.getItem(ITEM.id);
    expect(item).toEqual({
        ...ITEM,
        priority: 'high',
        dueDate: '2026-06-15',
    });
});

test('it can update and clear planning fields', async () => {
    await db.init();
    await db.storeItem({
        ...ITEM,
        priority: 'high',
        dueDate: '2026-06-15',
    });

    await db.updateItem(ITEM.id, {
        ...ITEM,
        priority: 'low',
        dueDate: '2026-06-20',
    });

    let item = await db.getItem(ITEM.id);
    expect(item.priority).toBe('low');
    expect(item.dueDate).toBe('2026-06-20');

    await db.updateItem(ITEM.id, {
        ...ITEM,
        priority: null,
        dueDate: null,
    });

    item = await db.getItem(ITEM.id);
    expect(item.priority).toBeNull();
    expect(item.dueDate).toBeNull();
});

test('it backfills planning columns for an existing table', async () => {
    await db.init();
    await db.teardown();

    const sqlite3 = require('sqlite3').verbose();
    await new Promise((acc, rej) => {
        const legacyDb = new sqlite3.Database(location, (err) => {
            if (err) return rej(err);
            legacyDb.run('DROP TABLE todo_items', (dropErr) => {
                if (dropErr) return rej(dropErr);
                legacyDb.run(
                    'CREATE TABLE todo_items (id varchar(36), name varchar(255), completed boolean)',
                    (createErr) => {
                        if (createErr) return rej(createErr);
                        legacyDb.run(
                            'INSERT INTO todo_items (id, name, completed) VALUES (?, ?, ?)',
                            [ITEM.id, ITEM.name, 0],
                            (insertErr) => {
                                if (insertErr) return rej(insertErr);
                                legacyDb.close((closeErr) =>
                                    closeErr ? rej(closeErr) : acc(),
                                );
                            },
                        );
                    },
                );
            });
        });
    });

    await db.init();

    const item = await db.getItem(ITEM.id);
    expect(item).toEqual(ITEM);
});

test('it can remove an existing item', async () => {
    await db.init();
    await db.storeItem(ITEM);

    await db.removeItem(ITEM.id);

    const items = await db.getItems();
    expect(items.length).toBe(0);
});

test('it can get a single item', async () => {
    await db.init();
    await db.storeItem(ITEM);

    const item = await db.getItem(ITEM.id);
    expect(item).toEqual(ITEM);
});
