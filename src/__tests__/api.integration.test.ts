/**
 * API Integration tests using MSW (Mock Service Worker).
 *
 * These tests verify the API layer works correctly with mocked
 * HTTP responses, testing the full request/response cycle.
 *
 * @module
 */
import { http, HttpResponse } from 'msw';

import { mockApi } from '../__mocks__/api';
import { server } from '../__mocks__/server';
import { get, post } from '../utils/api';

/**
 * Helper to wait for async operations.
 */
async function flushPromises(): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 0));
}

describe('API Integration with MSW', () => {
  describe('GET requests', () => {
    it('should fetch history activity instances from MSW', async () => {
      const result = await get(mockApi, '/history/activity-instance', {
        processInstanceId: 'instance-123',
      });

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('activityId');
      expect(result[0]).toHaveProperty('activityName');
    });

    it('should fetch history variable instances from MSW', async () => {
      const result = await get(mockApi, '/history/variable-instance', {
        processInstanceId: 'instance-123',
      });

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('name');
      expect(result[0]).toHaveProperty('type');
    });

    it('should fetch process instance by ID from MSW', async () => {
      const result = await get(mockApi, '/history/process-instance/instance-123', {});

      expect(result).toHaveProperty('id', 'instance-123');
      expect(result).toHaveProperty('state', 'ACTIVE');
    });

    it('should handle empty response for non-matching queries', async () => {
      const result = await get(mockApi, '/history/activity-instance', {
        processInstanceId: 'empty-instance',
      });

      expect(result).toEqual([]);
    });

    it('should fetch process definition XML', async () => {
      const result = await get(mockApi, '/process-definition/definition-456/xml', {});

      expect(result).toHaveProperty('bpmn20Xml');
      expect(result.bpmn20Xml).toContain('bpmn:');
    });

    it('should fetch decision instances', async () => {
      const result = await get(mockApi, '/history/decision-instance', {
        activityInstanceIdIn: 'business-rule-1',
      });

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('decisionDefinitionId');
    });

    it('should fetch external tasks', async () => {
      const result = await get(mockApi, '/external-task', {
        processInstanceId: 'instance-with-tasks',
      });

      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0]).toHaveProperty('topicName');
      expect(result[0]).toHaveProperty('workerId');
    });
  });

  describe('POST requests', () => {
    it('should correlate message successfully', async () => {
      const result = await post(
        mockApi,
        '/message',
        {},
        JSON.stringify({
          messageName: 'test-message',
          processInstanceId: 'instance-123',
        })
      );

      expect(result).toBeInstanceOf(Array);
      expect(result[0]).toHaveProperty('resultType', 'Execution');
    });

    it('should throw ApiError for message correlation failure', async () => {
      await expect(
        post(
          mockApi,
          '/message',
          {},
          JSON.stringify({
            messageName: 'fail-message',
          })
        )
      ).rejects.toMatchObject({
        name: 'ApiError',
        status: 400,
      });
    });

    it('should modify process instance', async () => {
      const result = await post(
        mockApi,
        '/process-instance/instance-123/modification',
        {},
        JSON.stringify({
          skipCustomListeners: true,
          skipIoMappings: true,
          instructions: [
            {
              type: 'startBeforeActivity',
              activityId: 'Task_1',
            },
          ],
        })
      );

      // 204 No Content returns empty string
      expect(result).toBe('');
    });
  });

  describe('Error handling', () => {
    it('should throw ApiError for 404 responses', async () => {
      await expect(get(mockApi, '/history/process-instance/not-found', {})).rejects.toMatchObject({
        name: 'ApiError',
        status: 404,
      });
    });

    it('should throw ApiError for network errors', async () => {
      // MSW HttpResponse.error() doesn't work well with jsdom/undici
      // Instead, test that an unhandled route throws an error
      server.use(
        http.get('*/api/engine/default/test-unhandled-route', () => {
          // This handler throws to simulate an error condition
          throw new Error('Simulated network error');
        })
      );

      await expect(get(mockApi, '/test-unhandled-route', {})).rejects.toMatchObject({
        name: 'ApiError',
      });
    });

    it('should throw ApiError for 500 server errors', async () => {
      server.use(
        http.get('*/api/engine/default/test-500', () => {
          return HttpResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        })
      );

      await expect(get(mockApi, '/test-500', {})).rejects.toMatchObject({
        name: 'ApiError',
        status: 500,
      });
    });
  });

  describe('Request parameters', () => {
    it('should include maxResults for history endpoints', async () => {
      let capturedUrl: string | null = null;

      server.use(
        http.get('*/api/engine/default/history/activity-instance', ({ request }) => {
          capturedUrl = request.url;
          return HttpResponse.json([]);
        })
      );

      await get(mockApi, '/history/activity-instance', {
        processInstanceId: 'test',
      });

      expect(capturedUrl).toContain('maxResults=1000');
    });

    it('should include CSRF token in headers', async () => {
      let capturedHeaders: Headers | null = null;

      server.use(
        http.post('*/api/engine/default/test-headers', ({ request }) => {
          capturedHeaders = request.headers;
          return HttpResponse.json({});
        })
      );

      await post(mockApi, '/test-headers', {}, '{}');
      await flushPromises();

      expect(capturedHeaders?.get('x-xsrf-token')).toBe('test-csrf-token');
    });

    it('should set Content-Type to application/json', async () => {
      let capturedHeaders: Headers | null = null;

      server.use(
        http.post('*/api/engine/default/test-content-type', ({ request }) => {
          capturedHeaders = request.headers;
          return HttpResponse.json({});
        })
      );

      await post(mockApi, '/test-content-type', {}, '{}');
      await flushPromises();

      expect(capturedHeaders?.get('content-type')).toBe('application/json');
    });
  });

  describe('Response parsing', () => {
    it('should parse JSON responses correctly', async () => {
      server.use(
        http.get('*/api/engine/default/test-json', () => {
          return HttpResponse.json({
            id: 'test-123',
            name: 'Test Object',
            nested: { value: 42 },
          });
        })
      );

      const result = await get(mockApi, '/test-json', {});

      expect(result).toEqual({
        id: 'test-123',
        name: 'Test Object',
        nested: { value: 42 },
      });
    });

    it('should handle text responses', async () => {
      server.use(
        http.post('*/api/engine/default/test-text', () => {
          return HttpResponse.text('Success', {
            headers: { 'Content-Type': 'text/plain' },
          });
        })
      );

      const result = await post(mockApi, '/test-text', {}, '{}');

      expect(result).toBe('Success');
    });

    it('should handle empty 204 responses', async () => {
      // 204 No Content responses are common for PUT/DELETE operations
      // Test that the API layer handles them correctly
      server.use(
        http.post('*/api/engine/default/test-no-content', () => {
          return new HttpResponse(null, { status: 204 });
        })
      );

      const result = await post(mockApi, '/test-no-content', {}, '{}');

      // 204 returns empty string (no content)
      expect(result).toBe('');
    });
  });

  describe('Custom handler overrides', () => {
    it('should allow runtime handler overrides for specific tests', async () => {
      // Override the default handler for a specific test
      server.use(
        http.get('*/api/engine/default/history/activity-instance', () => {
          return HttpResponse.json([
            {
              id: 'custom-activity-1',
              activityId: 'CustomTask_1',
              activityName: 'Custom Test Activity',
              activityType: 'userTask',
              startTime: '2024-06-01T10:00:00.000Z',
              endTime: '2024-06-01T11:00:00.000Z',
              canceled: false,
            },
          ]);
        })
      );

      const result = await get(mockApi, '/history/activity-instance', {});

      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('activityName', 'Custom Test Activity');
    });

    it('should reset to default handlers after test', async () => {
      // This test runs after the override above, but server.resetHandlers()
      // in afterEach should have restored the default handlers
      const result = await get(mockApi, '/history/activity-instance', {
        processInstanceId: 'instance-123',
      });

      // Should return the default mock data, not the custom override
      expect(result.length).toBeGreaterThan(1);
    });
  });
});
