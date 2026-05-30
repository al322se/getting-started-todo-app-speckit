import { useState } from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

export function AddItemForm({ onNewItem }) {
    const [newItem, setNewItem] = useState('');
    const [priority, setPriority] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const submitNewItem = (e) => {
        e.preventDefault();
        setSubmitting(true);

        const options = {
            method: 'POST',
            body: JSON.stringify({
                name: newItem,
                priority: priority || null,
                dueDate: dueDate || null,
            }),
            headers: { 'Content-Type': 'application/json' },
        };

        fetch('/api/items', options)
            .then(async (r) => {
                const body = await r.json();
                if (!r.ok) throw new Error(body.error);
                return body;
            })
            .then((item) => {
                onNewItem(item);
                setSubmitting(false);
                setNewItem('');
                setPriority('');
                setDueDate('');
                setError('');
            })
            .catch((err) => {
                setSubmitting(false);
                setError(err.message);
            });
    };

    return (
        <Form onSubmit={submitNewItem} className="new-item-form">
            {error && <Alert variant="danger">{error}</Alert>}
            <InputGroup className="mb-2">
                <Form.Control
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    type="text"
                    placeholder="New Item"
                    aria-label="New item"
                />
                <Form.Select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    aria-label="New item priority"
                    className="priority-select"
                >
                    <option value="">Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </Form.Select>
                <Form.Control
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    type="date"
                    aria-label="New item due date"
                    className="due-date-input"
                />
                <Button
                    type="submit"
                    variant="success"
                    disabled={!newItem.length}
                    className={submitting ? 'disabled' : ''}
                >
                    {submitting ? 'Adding...' : 'Add Item'}
                </Button>
            </InputGroup>
        </Form>
    );
}

AddItemForm.propTypes = {
    onNewItem: PropTypes.func,
};
