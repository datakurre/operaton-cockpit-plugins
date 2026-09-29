/**
 * Tests for BatchModifyForm: the activity-instance-count wiring behind the "Cancel Activity
 * Instance" picker, and the guarded submit.
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

describe('BatchModifyForm guarded submit', () => {
  /** Requests the form posted, by path. */
  let posted: { url: string; body: unknown }[];

  beforeEach(() => {
    posted = [];
    mockFetch.mockImplementation(async (url: string, init?: RequestInit) => {
      const json = (body: unknown) => ({
        ok: true,
        status: 200,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => body,
      });
      if (url.includes('/xml')) {
        return json({ id: processDefinitionId, bpmn20Xml: simpleBpmnXml });
      }
      if (url.includes('/statistics')) {
        return json([{ id: 'Task_1', instances: 2 }]);
      }
      if (init?.method?.toUpperCase() === 'POST') {
        posted.push({ url, body: JSON.parse(String(init.body)) });
        return json({ id: 'batch-1' });
      }
      if (url.includes('/process-instance')) {
        return json([
          { id: 'pi-1', processDefinitionId },
          { id: 'pi-2', processDefinitionId },
        ]);
      }
      return json({});
    });
  });

  /**
   * Pick an activity for the first instruction from its searchable picker.
   */
  async function chooseActivity(placeholder: string, label: RegExp): Promise<void> {
    const input = await screen.findByPlaceholderText(placeholder);
    fireEvent.focus(input);
    fireEvent.click(await screen.findByRole('option', { name: label }));
  }

  /** The submit button. */
  function submitButton(): HTMLElement {
    return screen.getByRole('button', { name: 'Execute Batch Modification' });
  }

  it('sends only after a dry run and an acknowledgement, and only once', async () => {
    render(<BatchModifyForm api={mockApi} processDefinitionId={processDefinitionId} />);
    await chooseActivity('-- Select Activity --', /Task_1/);

    expect(submitButton()).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Dry Run' }));
    const acknowledgement = await screen.findByRole('checkbox', { name: /modify 2 process instances/ });
    expect(submitButton()).toBeDisabled();

    fireEvent.click(acknowledgement);
    expect(submitButton()).toBeEnabled();
    fireEvent.click(submitButton());

    expect(await screen.findByText(/Batch modification submitted successfully/)).toBeInTheDocument();
    expect(posted).toHaveLength(1);
    expect(posted[0]?.url).toContain('/modification/executeAsync');
    expect(submitButton()).toBeDisabled();
  });

  it('disables submit when the form changes after the dry run', async () => {
    render(<BatchModifyForm api={mockApi} processDefinitionId={processDefinitionId} />);
    await chooseActivity('-- Select Activity --', /Task_1/);
    fireEvent.click(screen.getByRole('button', { name: 'Dry Run' }));
    fireEvent.click(await screen.findByRole('checkbox', { name: /modify 2 process instances/ }));

    fireEvent.click(screen.getByRole('checkbox', { name: /Skip I\/O Mappings/ }));

    expect(await screen.findByText(/Preview out of date/)).toBeInTheDocument();
    expect(submitButton()).toBeDisabled();
  });

  it('refuses a batch that only cancels', async () => {
    render(<BatchModifyForm api={mockApi} processDefinitionId={processDefinitionId} />);
    await openCancelActivityPicker();
    fireEvent.click(await screen.findByRole('option', { name: /Task_1/ }));

    fireEvent.click(screen.getByRole('button', { name: 'Dry Run' }));

    expect(await screen.findByText(/cancelling instances in bulk is not offered here/)).toBeInTheDocument();
    expect(screen.queryByRole('checkbox', { name: /modify/ })).not.toBeInTheDocument();
    expect(submitButton()).toBeDisabled();
  });

  it('refuses ids that are not running instances of this definition', async () => {
    render(<BatchModifyForm api={mockApi} processDefinitionId={processDefinitionId} />);
    await chooseActivity('-- Select Activity --', /Task_1/);
    fireEvent.change(document.querySelector('select[name="instanceSelectionMode"]') as HTMLSelectElement, {
      target: { value: 'specific' },
    });
    fireEvent.change(await screen.findByLabelText(/Instance IDs/), { target: { value: 'pi-1, other-9' } });

    fireEvent.click(screen.getByRole('button', { name: 'Dry Run' }));

    expect(await screen.findByText(/Not found as running instances of this process definition: other-9/)).toBeVisible();
    expect(submitButton()).toBeDisabled();
  });
});
