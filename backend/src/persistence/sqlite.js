const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const location = process.env.SQLITE_DB_LOCATION || '/etc/todos/todo.db';

let db, dbAll, dbRun;

function init() {
    const dirName = require('path').dirname(location);
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
    }

    return new Promise((acc, rej) => {
        db = new sqlite3.Database(location, (err) => {
            if (err) return rej(err);

            if (process.env.NODE_ENV !== 'test')
                console.log(`Using sqlite database at ${location}`);

            db.run(
                'CREATE TABLE IF NOT EXISTS todo_items (id varchar(36), name varchar(255), completed boolean)',
                (err) => {
                    if (err) return rej(err);

                    ensurePlanningColumns().then(acc).catch(rej);
                },
            );
        });
    });
}

function ensurePlanningColumns() {
    return new Promise((acc, rej) => {
        db.all('PRAGMA table_info(todo_items)', (err, rows) => {
            if (err) return rej(err);

            const columns = rows.map((row) => row.name);
            const migrations = [];

            if (!columns.includes('priority')) {
                migrations.push(
                    () =>
                        new Promise((resolve, reject) => {
                            db.run(
                                'ALTER TABLE todo_items ADD COLUMN priority varchar(10)',
                                (migrationErr) =>
                                    migrationErr
                                        ? reject(migrationErr)
                                        : resolve(),
                            );
                        }),
                );
            }

            if (!columns.includes('dueDate')) {
                migrations.push(
                    () =>
                        new Promise((resolve, reject) => {
                            db.run(
                                'ALTER TABLE todo_items ADD COLUMN dueDate varchar(10)',
                                (migrationErr) =>
                                    migrationErr
                                        ? reject(migrationErr)
                                        : resolve(),
                            );
                        }),
                );
            }

            migrations
                .reduce(
                    (chain, migration) => chain.then(migration),
                    Promise.resolve(),
                )
                .then(acc)
                .catch(rej);
        });
    });
}

function mapItem(item) {
    return Object.assign({}, item, {
        completed: item.completed === 1,
        priority: item.priority ?? null,
        dueDate: item.dueDate ?? null,
    });
}

async function teardown() {
    return new Promise((acc, rej) => {
        db.close((err) => {
            if (err) rej(err);
            else acc();
        });
    });
}

async function getItems() {
    return new Promise((acc, rej) => {
        db.all('SELECT * FROM todo_items', (err, rows) => {
            if (err) return rej(err);
            acc(rows.map(mapItem));
        });
    });
}

async function getItem(id) {
    return new Promise((acc, rej) => {
        db.all('SELECT * FROM todo_items WHERE id=?', [id], (err, rows) => {
            if (err) return rej(err);
            acc(rows.map(mapItem)[0]);
        });
    });
}

async function storeItem(item) {
    return new Promise((acc, rej) => {
        db.run(
            'INSERT INTO todo_items (id, name, completed, priority, dueDate) VALUES (?, ?, ?, ?, ?)',
            [
                item.id,
                item.name,
                item.completed ? 1 : 0,
                item.priority ?? null,
                item.dueDate ?? null,
            ],
            (err) => {
                if (err) return rej(err);
                acc();
            },
        );
    });
}

async function updateItem(id, item) {
    return new Promise((acc, rej) => {
        db.run(
            'UPDATE todo_items SET name=?, completed=?, priority=?, dueDate=? WHERE id = ?',
            [
                item.name,
                item.completed ? 1 : 0,
                item.priority ?? null,
                item.dueDate ?? null,
                id,
            ],
            (err) => {
                if (err) return rej(err);
                acc();
            },
        );
    });
}

async function removeItem(id) {
    return new Promise((acc, rej) => {
        db.run('DELETE FROM todo_items WHERE id = ?', [id], (err) => {
            if (err) return rej(err);
            acc();
        });
    });
}

module.exports = {
    init,
    teardown,
    getItems,
    getItem,
    storeItem,
    updateItem,
    removeItem,
};
