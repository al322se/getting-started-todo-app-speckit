const {
    normalizeDueDate,
    normalizePriority,
} = require('../../src/routes/itemValidation');

describe('item planning field validation', () => {
    test('accepts supported priority values', () => {
        expect(normalizePriority('high')).toBe('high');
        expect(normalizePriority('medium')).toBe('medium');
        expect(normalizePriority('low')).toBe('low');
    });

    test('normalizes empty priority values to null', () => {
        expect(normalizePriority(undefined)).toBeNull();
        expect(normalizePriority(null)).toBeNull();
        expect(normalizePriority('')).toBeNull();
    });

    test('rejects unsupported priority values', () => {
        expect(() => normalizePriority('urgent')).toThrow(
            'Priority must be high, medium, or low.',
        );
    });

    test('accepts valid calendar due dates', () => {
        expect(normalizeDueDate('2026-06-15')).toBe('2026-06-15');
    });

    test('normalizes empty due date values to null', () => {
        expect(normalizeDueDate(undefined)).toBeNull();
        expect(normalizeDueDate(null)).toBeNull();
        expect(normalizeDueDate('')).toBeNull();
    });

    test('rejects invalid due dates', () => {
        expect(() => normalizeDueDate('2026-02-30')).toThrow(
            'Due date must be a valid date in YYYY-MM-DD format.',
        );
        expect(() => normalizeDueDate('06/15/2026')).toThrow(
            'Due date must be a valid date in YYYY-MM-DD format.',
        );
    });
});
