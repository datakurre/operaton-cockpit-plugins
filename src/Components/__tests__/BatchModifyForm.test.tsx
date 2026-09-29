/**
 * Tests for BatchModifyForm, focused on the activity-instance-count wiring behind the
 * "Cancel Activity Instance" picker.
 */
import React from 'react';
import { render, screen, waitFor, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

import BatchModifyForm from '../BatchModifyForm';
import { mockApi } from '../../__mocks__/api';
import { simpleBpmnXml } from '../../__fixtures__/bpmn-xml';

const originalFetch = global.fetch;
let mockFetch: jest.Mock;

beforeAll(() => {
  mockFetch = jest.fn();
  global.fetch = mockFetch as unknown as typeof fetch;
});

afterAll(() => {
  global.fetch = originalFetch;
});

afterEach(() => {
  cleanup();
  mockFetch.mockReset();
  document.body.innerHTML = '';
});

const processDefinitionId = 'my-process:1:def-456';

/**
 * Selects "Cancel Activity Instance" and opens the "all instances of activity" picker.
 */
async function openCancelActivityPicker(): Promise<HTMLElement> {
  await waitFor(() => {
    expect(screen.getByText(/instruction type/i)).toBeInTheDocument();
  });
  const typeSelect = document.querySelector('select[name="instructions.0.type"]') as HTMLSelectElement;
  fireEvent.change(typeSelect, { target: { value: 'cancel' } });

  const activityInput = (await screen.findByPlaceholderText('-- Select Active Activity --')) as HTMLElement;
  fireEvent.focus(activityInput);
  return activityInput;
}

describe('BatchModifyForm activity statistics', () => {
  it('populates the cancel-activity picker with counts from /process-definition/{id}/statistics', async () => {
    mockFetch.mockImplementation(async (url: string) => {
      if (url.includes('/xml')) {
        return {
          ok: true,
          status: 200,
          headers: new Headers({ 'Content-Type': 'application/json' }),
          json: async () => ({ id: processDefinitionId, bpmn20Xml: simpleBpmnXml }),
        };
      }
      if (url.includes('/statistics')) {
        return {
          ok: true,
          status: 200,
          headers: new Headers({ 'Content-Type': 'application/json' }),
          json: async () => [{ id: 'Task_1', instances: 5 }],
        };
      }
      return {
        ok: true,
        status: 200,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => ({}),
      };
    });

    render(<BatchModifyForm api={mockApi} processDefinitionId={processDefinitionId} />);

    const activityInput = await openCancelActivityPicker();
    expect(activityInput).toHaveAttribute('placeholder', '-- Select Active Activity --');

    expect(await screen.findByText('Review Document (Task_1) — UserTask — 5 active')).toBeInTheDocument();
    // StartEvent_1 has no active instances recorded, so it must not appear in this picker.
    expect(screen.queryByText(/StartEvent_1/)).not.toBeInTheDocument();
  });

  it('degrades gracefully when the statistics request fails, without breaking the rest of the form', async () => {
    mockFetch.mockImplementation(async (url: string) => {
      if (url.includes('/xml')) {
        return {
          ok: true,
          status: 200,
          headers: new Headers({ 'Content-Type': 'application/json' }),
          json: async () => ({ id: processDefinitionId, bpmn20Xml: simpleBpmnXml }),
        };
      }
      if (url.includes('/statistics')) {
        return {
          ok: false,
          status: 500,
          headers: new Headers({ 'Content-Type': 'application/json' }),
          json: async () => ({ message: 'boom' }),
        };
      }
      return {
        ok: true,
        status: 200,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => ({}),
      };
    });

    render(<BatchModifyForm api={mockApi} processDefinitionId={processDefinitionId} />);

    // The activities themselves still load fine even though statistics failed.
    await waitFor(() => {
      expect(screen.getByText(/^activity:$/i)).toBeInTheDocument();
    });
    expect(screen.getByPlaceholderText('-- Select Activity --')).toBeInTheDocument();
  });
});
