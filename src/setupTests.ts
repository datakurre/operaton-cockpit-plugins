/**
 * Jest setup file - runs before each test suite.
 * Configures testing-library, mocks, and global test utilities.
 *
 * Note: Polyfills for fetch/MSW are in setupPolyfills.js which runs first.
 */
import '@testing-library/jest-dom';

import { server } from './__mocks__/server';
import { clearApiCache, resetFetchFunction } from './utils/api';
import { resetAngularProvider } from './utils/angular';

// Setup MSW (Mock Service Worker) for API mocking
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'bypass' });
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
    readText: jest.fn().mockResolvedValue(''),
  },
});

// Mock ResizeObserver
class ResizeObserverMock {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}
window.ResizeObserver = ResizeObserverMock;

// Mock IntersectionObserver
class IntersectionObserverMock {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
  root = null;
  rootMargin = '';
  thresholds = [];
}
window.IntersectionObserver = IntersectionObserverMock as unknown as typeof IntersectionObserver;

// Reset mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
  localStorageMock.getItem.mockReturnValue(null);
  // Reset location.hash (jsdom provides a real location object)
  window.location.hash = '';
  // Reset injectable dependencies to defaults
  resetFetchFunction();
  resetAngularProvider();
  // Clear API caches between tests
  clearApiCache();
});

// Clean up after all tests - ensure no leaking timers or handles
afterEach(() => {
  // Clear all pending timers to avoid open handle warnings
  jest.clearAllTimers();
});

afterAll(() => {
  // Use real timers to allow proper cleanup
  jest.useRealTimers();
});
