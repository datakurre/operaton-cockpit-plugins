/**
 * MSW (Mock Service Worker) server setup for Node.js testing.
 *
 * This server intercepts HTTP requests during tests and returns
 * mock responses defined in handlers.ts.
 *
 * @module
 */
import { setupServer } from 'msw/node';

import { handlers } from './handlers';

/**
 * MSW server instance for use in Jest tests.
 *
 * Use this server in setupTests.ts to enable API mocking:
 * - `server.listen()` - Start intercepting requests
 * - `server.resetHandlers()` - Reset to default handlers
 * - `server.close()` - Stop intercepting requests
 *
 * @example
 * ```typescript
 * // In setupTests.ts
 * import { server } from './__mocks__/server';
 *
 * beforeAll(() => server.listen());
 * afterEach(() => server.resetHandlers());
 * afterAll(() => server.close());
 * ```
 */
export const server = setupServer(...handlers);
