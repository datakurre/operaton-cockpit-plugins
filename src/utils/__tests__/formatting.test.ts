/**
 * Tests for formatting utilities
 */
import {
  formatDateTime,
  formatDateForApi,
  parseDate,
  isValidDate,
  buildCockpitUrl,
  buildHistoryUrl,
  buildProcessInstanceUrl,
  buildDecisionInstanceUrl,
} from '../formatting';

describe('formatDateTime', () => {
  it('formats a Date object correctly', () => {
    const date = new Date('2024-06-15T14:30:45');
    expect(formatDateTime(date)).toBe('2024-06-15T14:30:45');
  });

  it('formats an ISO string correctly', () => {
    expect(formatDateTime('2024-06-15T14:30:45.000Z')).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/);
  });

  it('returns empty string for null', () => {
    expect(formatDateTime(null)).toBe('');
  });

  it('returns empty string for undefined', () => {
    expect(formatDateTime(undefined)).toBe('');
  });

  it('returns empty string for invalid date string', () => {
    expect(formatDateTime('not-a-date')).toBe('');
  });

  it('pads single digit values', () => {
    const date = new Date('2024-01-05T09:05:03');
    expect(formatDateTime(date)).toBe('2024-01-05T09:05:03');
  });
});

describe('formatDateForApi', () => {
  it('converts Date to ISO string', () => {
    const date = new Date('2024-06-15T14:30:45.000Z');
    expect(formatDateForApi(date)).toBe('2024-06-15T14:30:45.000Z');
  });

  it('handles string input', () => {
    const result = formatDateForApi('2024-06-15T14:30:45.000Z');
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });
});

describe('parseDate', () => {
  it('parses valid date string', () => {
    const result = parseDate('2024-06-15T14:30:45');
    expect(result).toBeInstanceOf(Date);
    expect(result?.getFullYear()).toBe(2024);
  });

  it('returns null for invalid date', () => {
    expect(parseDate('not-a-date')).toBeNull();
  });
});

describe('isValidDate', () => {
  it('returns true for valid date', () => {
    expect(isValidDate('2024-06-15')).toBe(true);
  });

  it('returns false for invalid date', () => {
    expect(isValidDate('not-a-date')).toBe(false);
  });
});

describe('buildCockpitUrl', () => {
  it('builds URL from base path and route', () => {
    const result = buildCockpitUrl('http://localhost:8080/app/cockpit/', '/process-instance/123');
    expect(result).toBe('http://localhost:8080/app/cockpit/#/process-instance/123');
  });

  it('handles base path with hash', () => {
    const result = buildCockpitUrl('http://localhost:8080/app/cockpit/#/old', '/process-instance/123');
    expect(result).toBe('http://localhost:8080/app/cockpit/#/process-instance/123');
  });

  it('replaces tasklist with cockpit', () => {
    const result = buildCockpitUrl('http://localhost:8080/app/tasklist/', '/process-instance/123');
    expect(result).toBe('http://localhost:8080/app/cockpit/#/process-instance/123');
  });

  it('normalizes trailing slashes', () => {
    const result = buildCockpitUrl('http://localhost:8080/app/cockpit///', '/route');
    expect(result).toBe('http://localhost:8080/app/cockpit/#/route');
  });
});

describe('buildHistoryUrl', () => {
  it('builds history process instance URL', () => {
    const result = buildHistoryUrl('http://localhost:8080/app/cockpit/', 'inst-123');
    expect(result).toBe('http://localhost:8080/app/cockpit/#/history/process-instance/inst-123');
  });
});

describe('buildProcessInstanceUrl', () => {
  it('builds live process instance URL', () => {
    const result = buildProcessInstanceUrl('http://localhost:8080/app/cockpit/', 'inst-123');
    expect(result).toBe('http://localhost:8080/app/cockpit/#/process-instance/inst-123');
  });
});

describe('buildDecisionInstanceUrl', () => {
  it('builds decision instance URL', () => {
    const result = buildDecisionInstanceUrl('http://localhost:8080/app/cockpit/', 'dec-123');
    expect(result).toBe('http://localhost:8080/app/cockpit/#/decision-instance/dec-123');
  });
});
