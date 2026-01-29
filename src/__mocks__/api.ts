/**
 * Mock API configuration for tests.
 *
 * @module
 */
import type { API } from '../types';

/**
 * Creates a mock API configuration for testing.
 *
 * @param overrides - Optional overrides for API properties
 * @returns Mock API configuration
 */
export function createMockApi(overrides: Partial<API> = {}): API {
  return {
    adminApi: '/api/admin',
    baseApi: '/api',
    engineApi: '/api/engine/default',
    engine: 'default',
    tasklistApi: '/api/tasklist',
    CSRFToken: 'test-csrf-token',
    ...overrides,
  };
}

/** Default mock API configuration. */
export const mockApi = createMockApi();
