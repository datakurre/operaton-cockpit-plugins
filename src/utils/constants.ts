/**
 * UI and timing constants used across the application.
 * Centralizes magic numbers for easier maintenance and configuration.
 */

// =============================================================================
// UI Constants
// =============================================================================

/** Modal overlay z-index to ensure modals appear above other content */
export const MODAL_Z_INDEX = 2000;

// =============================================================================
// Timing Constants
// =============================================================================

/** Polling interval for auto-refresh in milliseconds */
export const AUTO_REFRESH_POLL_INTERVAL_MS = 1000;

/** Delay before reloading page after successful operation (milliseconds) */
export const RELOAD_DELAY_MS = 2000;

/** Delay before showing submit feedback in milliseconds */
export const SUBMIT_FEEDBACK_DELAY_MS = 2000;

/** Delay for BPMN renderer initialization in milliseconds */
export const RENDER_DELAY_MS = 1500;

// =============================================================================
// Time Calculation Constants
// =============================================================================

/** Number of seconds in one hour */
export const SECONDS_PER_HOUR = 3600;

/** Number of hours in one day */
export const HOURS_PER_DAY = 24;

/** Number of days in one week */
export const DAYS_PER_WEEK = 7;

/** Milliseconds per second */
export const MS_PER_SECOND = 1000;

// =============================================================================
// Pagination Constants
// =============================================================================

/** Default page size for paginated lists */
export const DEFAULT_PAGE_SIZE = 50;

/** Default maximum results for history API queries */
export const DEFAULT_MAX_RESULTS = 1000;

// =============================================================================
// Retry Constants
// =============================================================================

/** Maximum number of retry attempts for API operations */
export const MAX_RETRIES = 5;

/** Interval between retry attempts in seconds */
export const RETRY_INTERVAL_SECONDS = 60;

// =============================================================================
// Validation Constants
// =============================================================================

/** Length of a standard UUID string */
export const UUID_LENGTH = 36;

// =============================================================================
// BPMN Viewer Constants
// =============================================================================

/** Zoom increment step for BPMN viewer controls */
export const ZOOM_INCREMENT = 0.1;
