/**
 * Formatting utilities for dates and URLs
 *
 * @module utils/formatting
 */

/** Date format pattern for consistent display across the application */
const DATE_FORMAT = 'YYYY-MM-DDTHH:mm:ss';

/**
 * Format a date or date string for display
 * @param date - Date object, ISO string, or null/undefined
 * @returns Formatted date string or empty string for invalid input
 */
export function formatDateTime(date: Date | string | null | undefined): string {
  if (date === null || date === undefined) {
    return '';
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return '';
  }

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

/**
 * Format a date for Cockpit API requests (UTC with milliseconds)
 * @param date - Date object or ISO string
 * @returns ISO string in UTC format for API requests
 */
export function formatDateForApi(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString();
}

/**
 * Parse a date string, returning null for invalid dates
 * @param dateString - Date string to parse
 * @returns Date object or null if invalid
 */
export function parseDate(dateString: string): Date | null {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
}

/**
 * Check if a string is a valid date
 * @param dateString - String to validate
 * @returns true if the string represents a valid date
 */
export function isValidDate(dateString: string): boolean {
  return !isNaN(new Date(dateString).getTime());
}

/**
 * Build a Cockpit URL with proper base path handling
 * @param basePath - The base URL path (from window.location or config)
 * @param route - The route path (e.g., '/process-instance/:id')
 * @returns Complete URL string
 */
export function buildCockpitUrl(basePath: string, route: string): string {
  const cleanBase = `${basePath.split('#')[0] ?? ''}/`
    .replace(/\/+$/, '/')
    .replace(/\/app\/tasklist\//, '/app/cockpit/');

  return `${cleanBase}#${route}`;
}

/**
 * Build a history process instance URL
 * @param basePath - The base URL path
 * @param processInstanceId - The process instance ID
 * @returns Complete URL for viewing history
 */
export function buildHistoryUrl(basePath: string, processInstanceId: string): string {
  return buildCockpitUrl(basePath, `/history/process-instance/${processInstanceId}`);
}

/**
 * Build a live process instance URL
 * @param basePath - The base URL path
 * @param processInstanceId - The process instance ID
 * @returns Complete URL for viewing live instance
 */
export function buildProcessInstanceUrl(basePath: string, processInstanceId: string): string {
  return buildCockpitUrl(basePath, `/process-instance/${processInstanceId}`);
}

/**
 * Build a decision instance URL
 * @param basePath - The base URL path
 * @param decisionInstanceId - The decision instance ID
 * @returns Complete URL for viewing decision
 */
export function buildDecisionInstanceUrl(basePath: string, decisionInstanceId: string): string {
  return buildCockpitUrl(basePath, `/decision-instance/${decisionInstanceId}`);
}

/** Export the date format pattern for components that use moment.js */
export const DISPLAY_DATE_FORMAT = DATE_FORMAT;
