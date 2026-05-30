import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Badge from 'react-bootstrap/Badge';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons/faTrash';
import faCheckSquare from '@fortawesome/fontawesome-free-regular/faCheckSquare';
import faSquare from '@fortawesome/fontawesome-free-regular/faSquare';
import {
    effectivePriority,
    formatDueDate,
    formatPriority,
    isOverdue,
} from './itemPlanning';
import './ItemDisplay.scss';

export function ItemDisplay({ item, onItemUpdate, onItemRemoval }) {
    const [draft, setDraft] = useState({
        name: item.name,
        priority: item.priority || '',
        dueDate: item.dueDate || '',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const overdue = isOverdue(item);
    const priority = effectivePriority(item);
    const dueDateLabel = formatDueDate(item.dueDate);
    const hasChanges =
        draft.name !== item.name ||
        draft.priority !== (item.priority || '') ||
        draft.dueDate !== (item.dueDate || '');

    useEffect(() => {
        setDraft({
            name: item.name,
            priority: item.priority || '',
            dueDate: item.dueDate || '',
        });
    }, [item]);

    const toggleCompletion = () => {
        fetch(`/api/items/${item.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: item.name,
                completed: !item.completed,
                priority: item.priority,
                dueDate: item.dueDate,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then((r) => r.json())
            .then(onItemUpdate);
    };

    const saveItem = (e) => {
        e.preventDefault();
        setSaving(true);

        fetch(`/api/items/${item.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: draft.name,
                completed: item.completed,
                priority: draft.priority || null,
                dueDate: draft.dueDate || null,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(async (r) => {
                const body = await r.json();
                if (!r.ok) throw new Error(body.error);
                return body;
            })
            .then((updatedItem) => {
                setSaving(false);
                setError('');
                onItemUpdate(updatedItem);
            })
            .catch((err) => {
                setSaving(false);
                setError(err.message);
            });
    };

    const removeItem = () => {
        fetch(`/api/items/${item.id}`, { method: 'DELETE' }).then(() =>
            onItemRemoval(item),
        );
    };

    return (
        <Container
            fluid
            className={`item ${item.completed ? 'completed' : ''} ${
                overdue ? 'overdue' : ''
            }`}
        >
            <Form onSubmit={saveItem}>
                <Row className="align-items-start g-2">
                    <Col xs={2} className="text-center">
                        <Button
                            className="toggles"
                            size="sm"
                            variant="link"
                            onClick={toggleCompletion}
                            aria-label={
                                item.completed
                                    ? 'Mark item as incomplete'
                                    : 'Mark item as complete'
                            }
                        >
                            <FontAwesomeIcon
                                icon={item.completed ? faCheckSquare : faSquare}
                            />
                            <i
                                className={`far ${
                                    item.completed
                                        ? 'fa-check-square'
                                        : 'fa-square'
                                }`}
                            />
                        </Button>
                    </Col>
                    <Col xs={10} md={5} className="name">
                        <Form.Control
                            value={draft.name}
                            onChange={(e) =>
                                setDraft({ ...draft, name: e.target.value })
                            }
                            type="text"
                            aria-label={`Item name ${item.name}`}
                            size="sm"
                        />
                        <div className="metadata">
                            <Badge className={`priority priority-${priority}`}>
                                {formatPriority(priority)}
                            </Badge>
                            {dueDateLabel && (
                                <Badge
                                    className={`due-date ${
                                        overdue ? 'due-date-overdue' : ''
                                    }`}
                                >
                                    {overdue ? 'Overdue' : 'Due'} {dueDateLabel}
                                </Badge>
                            )}
                        </div>
                        {error && <div className="item-error">{error}</div>}
                    </Col>
                    <Col xs={7} md={3}>
                        <Form.Select
                            value={draft.priority}
                            onChange={(e) =>
                                setDraft({ ...draft, priority: e.target.value })
                            }
                            aria-label={`Priority for ${item.name}`}
                            size="sm"
                        >
                            <option value="">Medium</option>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </Form.Select>
                    </Col>
                    <Col xs={5} md={2}>
                        <Form.Control
                            value={draft.dueDate}
                            onChange={(e) =>
                                setDraft({ ...draft, dueDate: e.target.value })
                            }
                            type="date"
                            aria-label={`Due date for ${item.name}`}
                            size="sm"
                        />
                    </Col>
                    <Col xs={12} md={2} className="text-center remove">
                        <Button
                            size="sm"
                            variant="outline-primary"
                            type="submit"
                            disabled={
                                !draft.name.length || !hasChanges || saving
                            }
                            className="save-item"
                        >
                            {saving ? 'Saving...' : 'Save'}
                        </Button>
                        <Button
                            size="sm"
                            variant="link"
                            onClick={removeItem}
                            aria-label="Remove Item"
                        >
                            <FontAwesomeIcon
                                icon={faTrash}
                                className="text-danger"
                            />
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}

ItemDisplay.propTypes = {
    item: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        completed: PropTypes.bool,
        priority: PropTypes.string,
        dueDate: PropTypes.string,
    }),
    onItemUpdate: PropTypes.func,
    onItemRemoval: PropTypes.func,
};
