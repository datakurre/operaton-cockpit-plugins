/**
 * MSW (Mock Service Worker) request handlers.
 *
 * Defines API mock handlers for integration testing.
 *
 * @module
 */
import { http, HttpResponse } from 'msw';

import { mockActivitiesSimpleFlow, mockBusinessRuleTask, mockCallActivity } from '../__fixtures__/activities';
import {
  createProcessDefinition,
  createProcessInstance,
  mockExternalTask,
  mockProcessDefinition,
  mockProcessInstance,
} from '../__fixtures__/api-responses';
import { simpleBpmnXml } from '../__fixtures__/bpmn-xml';
import { mockJsonVariable, mockIntegerVariable, mockStringVariable } from '../__fixtures__/variables';

/** Base API URL pattern for engine API. */
const ENGINE_API = '*/api/engine/default';

/**
 * Default API handlers for MSW.
 *
 * These handlers intercept API requests and return mock responses.
 */
export const handlers = [
  // GET /history/activity-instance - List historical activities
  http.get(`${ENGINE_API}/history/activity-instance`, ({ request }) => {
    const url = new URL(request.url);
    const processInstanceId = url.searchParams.get('processInstanceId');
    const processDefinitionId = url.searchParams.get('processDefinitionId');

    if (processInstanceId === 'instance-123' || processDefinitionId === 'definition-456') {
      return HttpResponse.json([...mockActivitiesSimpleFlow, mockBusinessRuleTask, mockCallActivity]);
    }

    if (processInstanceId === 'empty-instance') {
      return HttpResponse.json([]);
    }

    // Default response
    return HttpResponse.json(mockActivitiesSimpleFlow);
  }),

  // GET /history/variable-instance - List historical variables
  http.get(`${ENGINE_API}/history/variable-instance`, ({ request }) => {
    const url = new URL(request.url);
    const processInstanceId = url.searchParams.get('processInstanceId');

    if (processInstanceId === 'empty-instance') {
      return HttpResponse.json([]);
    }

    return HttpResponse.json([mockStringVariable, mockJsonVariable, mockIntegerVariable]);
  }),

  // GET /history/process-instance/:id - Get process instance by ID
  http.get(`${ENGINE_API}/history/process-instance/:id`, ({ params }) => {
    const { id } = params;

    if (id === 'not-found') {
      return HttpResponse.json(null, { status: 404 });
    }

    if (id === 'completed-instance') {
      return HttpResponse.json(
        createProcessInstance({
          id: id as string,
          state: 'COMPLETED',
          endTime: '2024-01-01T12:00:00.000Z',
        })
      );
    }

    return HttpResponse.json(
      createProcessInstance({
        id: id as string,
      })
    );
  }),

  // GET /history/process-instance - List process instances
  http.get(`${ENGINE_API}/history/process-instance`, ({ request }) => {
    const url = new URL(request.url);
    const processDefinitionId = url.searchParams.get('processDefinitionId');

    if (processDefinitionId === 'definition-456') {
      return HttpResponse.json([mockProcessInstance]);
    }

    return HttpResponse.json([]);
  }),

  // GET /history/decision-instance - List decision instances
  http.get(`${ENGINE_API}/history/decision-instance`, ({ request }) => {
    const url = new URL(request.url);
    const activityInstanceIdIn = url.searchParams.get('activityInstanceIdIn');

    if (activityInstanceIdIn?.includes('business-rule-1')) {
      return HttpResponse.json([
        {
          id: 'decision-instance-1',
          decisionDefinitionId: 'decision-def-1',
          activityInstanceId: 'business-rule-1',
        },
      ]);
    }

    return HttpResponse.json([]);
  }),

  // GET /process-definition/:id - Get process definition
  http.get(`${ENGINE_API}/process-definition/:id`, ({ params }) => {
    const { id } = params;

    if (id === 'not-found') {
      return HttpResponse.json(null, { status: 404 });
    }

    return HttpResponse.json(
      createProcessDefinition({
        id: id as string,
      })
    );
  }),

  // GET /process-definition/:id/xml - Get process definition BPMN XML
  http.get(`${ENGINE_API}/process-definition/:id/xml`, () => {
    return HttpResponse.json({
      id: 'definition-456',
      bpmn20Xml: simpleBpmnXml,
    });
  }),

  // GET /external-task - List external tasks
  http.get(`${ENGINE_API}/external-task`, ({ request }) => {
    const url = new URL(request.url);
    const processInstanceId = url.searchParams.get('processInstanceId');

    if (processInstanceId === 'instance-with-tasks') {
      return HttpResponse.json([mockExternalTask]);
    }

    return HttpResponse.json([]);
  }),

  // PUT /external-task/:id/unlock - Unlock external task
  http.put(`${ENGINE_API}/external-task/:id/unlock`, () => {
    return HttpResponse.text('', { status: 204 });
  }),

  // PUT /external-task/:id/retries - Set external task retries
  http.put(`${ENGINE_API}/external-task/:id/retries`, () => {
    return HttpResponse.text('', { status: 204 });
  }),

  // POST /message - Correlate message
  http.post(`${ENGINE_API}/message`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;

    if (body['messageName'] === 'fail-message') {
      return HttpResponse.json(
        { type: 'MismatchingMessageCorrelationException', message: 'No matching subscription' },
        { status: 400 }
      );
    }

    return HttpResponse.json([
      {
        resultType: 'Execution',
        execution: { id: 'execution-1', processInstanceId: 'instance-123' },
      },
    ]);
  }),

  // POST /process-instance/:id/modification - Modify process instance
  http.post(`${ENGINE_API}/process-instance/:id/modification`, () => {
    return HttpResponse.text('', { status: 204 });
  }),

  // GET /process-instance - List running process instances
  http.get(`${ENGINE_API}/process-instance`, ({ request }) => {
    const url = new URL(request.url);
    const processDefinitionId = url.searchParams.get('processDefinitionId');

    if (processDefinitionId === 'definition-456') {
      return HttpResponse.json([mockProcessInstance]);
    }

    return HttpResponse.json([]);
  }),

  // GET /process-definition - List process definitions
  http.get(`${ENGINE_API}/process-definition`, () => {
    return HttpResponse.json([mockProcessDefinition]);
  }),
];
