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

/** Delay for CodeMirror initialization in milliseconds */
export const CODEMIRROR_INIT_DELAY_MS = 50;

/** Initial delay for BPMN zoom reset in milliseconds */
export const ZOOM_RESET_DELAY_INITIAL_MS = 100;

/** Final delay for BPMN zoom reset in milliseconds */
export const ZOOM_RESET_DELAY_FINAL_MS = 300;

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

/** Minutes per hour */
export const MINUTES_PER_HOUR = 60;

/** Seconds per minute */
export const SECONDS_PER_MINUTE = 60;

/** Width of admin panel in pixels */
export const ADMIN_PANEL_WIDTH_PX = 220;

// =============================================================================
// Pagination Constants
// =============================================================================

/** Default page size for paginated lists */
export const DEFAULT_PAGE_SIZE = 50;

/** Default maximum results for history API queries */
export const DEFAULT_MAX_RESULTS = 1000;

/** Maximum number of records per page */
export const MAX_PAGE_SIZE = 2000;

// =============================================================================
// Resource Type Constants (for authorization management)
// =============================================================================

/** Resource type ID for Process Definition */
export const RESOURCE_TYPE_PROCESS_DEFINITION = 6;

/** Resource type ID for Task */
export const RESOURCE_TYPE_TASK = 7;

/** Resource type ID for Process Instance */
export const RESOURCE_TYPE_PROCESS_INSTANCE = 8;

/** Resource type ID for Deployment */
export const RESOURCE_TYPE_DEPLOYMENT = 9;

/** Resource type ID for Decision Definition */
export const RESOURCE_TYPE_DECISION_DEFINITION = 10;

/** Resource type ID for Tenant */
export const RESOURCE_TYPE_TENANT = 14;

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
