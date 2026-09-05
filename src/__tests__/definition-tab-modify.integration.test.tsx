/**
 * Integration tests for definition-tab-modify plugin.
 * Tests the batch modification, message correlation, and signal broadcasting flows.
 *
 * @module
 */

import React from 'react';
import { render, screen, waitFor, act, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

import { mockApi } from '../__mocks__/api';
import { simpleBpmnXml, bpmnWithMessages, bpmnWithStartEventMessage } from '../__fixtures__/bpmn-xml';

// Mock the angular module to prevent reload issues
jest.mock('../utils/angular', () => ({
  reloadAngularRoute: jest.fn(),
}));

// Mock global fetch
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
  jest.clearAllMocks();
  document.body.innerHTML = '';
});

describe('definition-tab-modify integration', () => {
  const processDefinitionId = 'my-process:1:def-456';

  /**
   * Helper to set up mock fetch responses
   */
  function setupMockFetch(
    options: {
      bpmnXml?: string;
      instanceCount?: number;
    } = {}
  ): void {
    const { bpmnXml = simpleBpmnXml, instanceCount = 5 } = options;

    mockFetch.mockImplementation(async (url: string, init?: RequestInit) => {
      const urlStr = url;

      if (urlStr.includes('/process-definition/') && urlStr.includes('/xml')) {
        return {
          ok: true,
          status: 200,
          headers: new Headers({ 'Content-Type': 'application/json' }),
          json: async () => ({ id: processDefinitionId, bpmn20Xml: bpmnXml }),
        };
      }

      if (urlStr.includes('/process-instance/count')) {
        return {
          ok: true,
          status: 200,
          headers: new Headers({ 'Content-Type': 'application/json' }),
          json: async () => ({ count: instanceCount }),
        };
      }

      if (urlStr.includes('/process-instance') && !urlStr.includes('/modification')) {
        return {
          ok: true,
          status: 200,
          headers: new Headers({ 'Content-Type': 'application/json' }),
          json: async () =>
            Array.from({ length: Math.min(instanceCount, 10) }, (_, i) => ({
              id: `instance-${i + 1}`,
              processDefinitionId,
              state: 'ACTIVE',
            })),
        };
      }

      if (urlStr.includes('/modification') && init?.method === 'POST') {
        return {
          ok: true,
          status: 204,
          headers: new Headers({ 'Content-Type': 'application/json' }),
          json: async () => ({}),
        };
      }

      if (urlStr.includes('/message') && init?.method === 'POST') {
        return {
          ok: true,
          status: 200,
          headers: new Headers({ 'Content-Type': 'application/json' }),
          json: async () => [{ resultType: 'Execution', execution: { id: 'exec-1' } }],
        };
      }

      if (urlStr.includes('/signal') && init?.method === 'POST') {
        return {
          ok: true,
          status: 204,
          headers: new Headers({ 'Content-Type': 'application/json' }),
          json: async () => ({}),
        };
      }

      // Default response
      return {
        ok: true,
        status: 200,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => ({}),
      };
    });
  }

  /**
   * Helper to render the plugin in a container
   */
  async function renderPlugin(): Promise<HTMLDivElement> {
    const definitionTabModify = require('../definition-tab-modify');
    const Plugin = definitionTabModify.default;

    const tabPlugin = Plugin.find(
      (p: { pluginPoint: string }) => p.pluginPoint === 'cockpit.processDefinition.runtime.tab'
    );
    expect(tabPlugin).toBeDefined();

    const container = document.createElement('div');
    container.setAttribute('data-testid', 'plugin-container');
    document.body.appendChild(container);

    await act(async () => {
      tabPlugin?.render(container, {
        api: mockApi,
        processDefinitionId,
      });
    });

    return container;
  }

  describe('Plugin structure', () => {
    it('should render three tabs: Batch Modify, Message, and Signal', async () => {
      setupMockFetch();

      await renderPlugin();

      await waitFor(() => {
        expect(screen.getByText('Batch Modify')).toBeInTheDocument();
        expect(screen.getByText('Message')).toBeInTheDocument();
        expect(screen.getByText('Signal')).toBeInTheDocument();
      });
    });

    it('should show Batch Modify tab content by default', async () => {
      setupMockFetch();

      await renderPlugin();

      await waitFor(() => {
        expect(screen.getByLabelText(/Select Instances By/i)).toBeInTheDocument();
      });
    });
  });

  describe('Batch Modify flow', () => {
    it('should load activities from BPMN and show instruction builder', async () => {
      setupMockFetch();

      const container = await renderPlugin();

      await waitFor(() => {
        expect(screen.getByLabelText(/Select Instances By/i)).toBeInTheDocument();
      });

      // Should have instruction type selector
      const typeSelect = container.querySelector('select[name="instructions.0.type"]');
      expect(typeSelect).not.toBeNull();

      // Should have Add Another Instruction button
      expect(screen.getByText('Add Another Instruction')).toBeInTheDocument();
    });

    it('should show instance selection options', async () => {
      setupMockFetch({ instanceCount: 10 });

      const container = await renderPlugin();

      await waitFor(() => {
        expect(screen.getByLabelText(/Select Instances By/i)).toBeInTheDocument();
      });

      // Should have selection mode dropdown
      expect(screen.getByLabelText(/Select Instances By/i)).toBeInTheDocument();

      // Should have the "all" option
      const selectElement = container.querySelector('#instanceSelectionMode');
      expect(selectElement).not.toBeNull();
      if (selectElement) {
        const options = Array.from(selectElement.querySelectorAll('option'));
        const optionTexts = options.map(opt => opt.textContent);
        expect(optionTexts).toContain('All active instances of this definition');
      }
    });

    it('should show dry-run button', async () => {
      setupMockFetch();

      await renderPlugin();

      await waitFor(() => {
        expect(screen.getByText(/Dry Run/)).toBeInTheDocument();
      });
    });

    it('should show warning box about modification dangers', async () => {
      setupMockFetch();

      await renderPlugin();

      await waitFor(() => {
        expect(screen.getByText(/Batch modification is a powerful operation/i)).toBeInTheDocument();
      });
    });
  });

  describe('Message tab flow', () => {
    it('should render message form when Message tab is clicked', async () => {
      setupMockFetch({ bpmnXml: bpmnWithMessages });

      await renderPlugin();

      await waitFor(() => {
        expect(screen.getByText('Message')).toBeInTheDocument();
      });

      // Click on Message tab
      const messageTab = screen.getByText('Message');
      await act(async () => {
        fireEvent.click(messageTab);
      });

      // Should show message label (the form has "Message" label for message select)
      await waitFor(() => {
        expect(screen.getByLabelText('Message')).toBeInTheDocument();
      });
    });

    it('should populate message dropdown from BPMN definitions', async () => {
      setupMockFetch({ bpmnXml: bpmnWithMessages });

      const container = await renderPlugin();

      // Click on Message tab
      await waitFor(() => {
        expect(screen.getByText('Message')).toBeInTheDocument();
      });

      const messageTab = screen.getByText('Message');
      await act(async () => {
        fireEvent.click(messageTab);
      });

      await waitFor(() => {
        expect(screen.getByLabelText('Message')).toBeInTheDocument();
      });

      // Check message select has the expected options
      const messageSelect = container.querySelector('select[name="messageName"]');
      expect(messageSelect).not.toBeNull();

      if (messageSelect) {
        const options = Array.from(messageSelect.querySelectorAll('option'));
        const optionValues = options.map(opt => opt.value);
        expect(optionValues).toContain('OrderReceived');
        expect(optionValues).toContain('CancelOrder');
      }
    });
  });

  describe('Message targeting and request preview', () => {
    /**
     * Open the Message tab and pick a message by name.
     */
    async function openMessageTab(container: HTMLElement, messageName: string): Promise<void> {
      await waitFor(() => {
        expect(screen.getByText('Message')).toBeInTheDocument();
      });
      await act(async () => {
        fireEvent.click(screen.getByText('Message'));
      });
      await waitFor(() => {
        expect(screen.getByLabelText('Message')).toBeInTheDocument();
      });
      const select = container.querySelector('select[name="messageName"]') as HTMLSelectElement;
      await act(async () => {
        fireEvent.change(select, { target: { value: messageName } });
      });
    }

    it('offers instance targeting for a message that is correlated', async () => {
      setupMockFetch({ bpmnXml: bpmnWithMessages });
      const container = await renderPlugin();
      await openMessageTab(container, 'OrderReceived');

      // Correlation used to hit every active instance with no way to narrow it.
      const modeSelect = container.querySelector('select[name="instanceSelectionMode"]') as HTMLSelectElement;
      expect(modeSelect).not.toBeNull();
      expect(Array.from(modeSelect.querySelectorAll('option')).map(o => o.value)).toEqual(['all', 'query', 'specific']);
    });

    it('previews the correlation request, narrowed to the chosen instances', async () => {
      setupMockFetch({ bpmnXml: bpmnWithMessages });
      const container = await renderPlugin();
      await openMessageTab(container, 'OrderReceived');

      const modeSelect = container.querySelector('select[name="instanceSelectionMode"]') as HTMLSelectElement;
      await act(async () => {
        fireEvent.change(modeSelect, { target: { value: 'specific' } });
      });
      const idsField = container.querySelector('textarea[name="specificInstanceIds"]') as HTMLTextAreaElement;
      await act(async () => {
        fireEvent.change(idsField, { target: { value: 'pi-1, pi-2' } });
      });

      const dryRun = Array.from(container.querySelectorAll('button')).find(b => /dry run/i.test(b.textContent ?? ''));
      expect(dryRun).toBeDefined();
      await act(async () => {
        fireEvent.click(dryRun as HTMLButtonElement);
      });

      const preview = await waitFor(() => {
        const el = container.querySelector('[aria-label="Request preview"]');
        expect(el).not.toBeNull();
        return el as HTMLElement;
      });

      expect(preview.textContent).toContain('POST /process-instance/message-async');
      const body = JSON.parse((preview.textContent ?? '').slice((preview.textContent ?? '').indexOf('{')));
      expect(body).toEqual({ messageName: 'OrderReceived', processInstanceIds: ['pi-1', 'pi-2'] });
    });

    it('offers a business key and previews the start request for a start message', async () => {
      setupMockFetch({ bpmnXml: bpmnWithStartEventMessage });
      const container = await renderPlugin();
      await openMessageTab(container, 'StartOrder');

      // A start message starts one instance, so it takes a business key instead of a target.
      const businessKey = container.querySelector('input[name="businessKey"]') as HTMLInputElement;
      expect(businessKey).not.toBeNull();
      expect(businessKey.value).not.toBe('');
      expect(container.querySelector('select[name="instanceSelectionMode"]')).toBeNull();

      await act(async () => {
        fireEvent.change(businessKey, { target: { value: 'order-7' } });
      });

      const dryRun = Array.from(container.querySelectorAll('button')).find(b => /dry run/i.test(b.textContent ?? ''));
      await act(async () => {
        fireEvent.click(dryRun as HTMLButtonElement);
      });

      const preview = await waitFor(() => {
        const el = container.querySelector('[aria-label="Request preview"]');
        expect(el).not.toBeNull();
        return el as HTMLElement;
      });

      expect(preview.textContent).toContain('POST /message');
      const body = JSON.parse((preview.textContent ?? '').slice((preview.textContent ?? '').indexOf('{')));
      expect(body).toEqual({ messageName: 'StartOrder', businessKey: 'order-7' });
    });
  });

  describe('Signal tab flow', () => {
    it('should render signal form when Signal tab is clicked', async () => {
      setupMockFetch();

      await renderPlugin();

      await waitFor(() => {
        expect(screen.getByText('Signal')).toBeInTheDocument();
      });

      // Click on Signal tab
      const signalTab = screen.getByText('Signal');
      await act(async () => {
        fireEvent.click(signalTab);
      });

      // Should show signal name label
      await waitFor(() => {
        expect(screen.getByText('Signal Name')).toBeInTheDocument();
      });
    });

    it('should have broadcast button in Signal form', async () => {
      setupMockFetch();

      await renderPlugin();

      // Wait for initial render to complete
      await waitFor(() => {
        expect(screen.getByText('Signal')).toBeInTheDocument();
      });

      // Click on Signal tab
      const signalTab = screen.getByText('Signal');
      await act(async () => {
        fireEvent.click(signalTab);
      });

      // Wait for Signal Name to appear, then check for button
      await waitFor(() => {
        expect(screen.getByText('Signal Name')).toBeInTheDocument();
      });

      // Check broadcast button - it contains "Broadcast Signal" text
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Broadcast Signal/i })).toBeInTheDocument();
      });
    });
  });

  describe('Tab switching', () => {
    it('should switch between all three tabs', async () => {
      setupMockFetch({ bpmnXml: bpmnWithMessages });

      await renderPlugin();

      // Wait for initial render
      await waitFor(() => {
        expect(screen.getByText('Batch Modify')).toBeInTheDocument();
      });

      // Initially on Batch Modify
      expect(screen.getByLabelText(/Select Instances By/i)).toBeInTheDocument();

      // Switch to Message
      await act(async () => {
        fireEvent.click(screen.getByText('Message'));
      });

      await waitFor(() => {
        expect(screen.getByLabelText('Message')).toBeInTheDocument();
      });

      // Switch to Signal
      await act(async () => {
        fireEvent.click(screen.getByText('Signal'));
      });

      await waitFor(() => {
        expect(screen.getByText('Signal Name')).toBeInTheDocument();
      });

      // Switch back to Batch Modify
      await act(async () => {
        fireEvent.click(screen.getByText('Batch Modify'));
      });

      await waitFor(() => {
        expect(screen.getByLabelText(/Select Instances By/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error handling', () => {
    it('should display error when loading activities fails', async () => {
      mockFetch.mockImplementation(async (url: string) => {
        const urlStr = url;

        if (urlStr.includes('/process-definition/') && urlStr.includes('/xml')) {
          return {
            ok: false,
            status: 500,
            headers: new Headers({ 'Content-Type': 'application/json' }),
            json: async () => ({ message: 'Server error' }),
          };
        }

        return {
          ok: true,
          status: 200,
          headers: new Headers({ 'Content-Type': 'application/json' }),
          json: async () => ({}),
        };
      });

      await renderPlugin();

      await waitFor(() => {
        expect(screen.getByText(/Failed to load process activities/i)).toBeInTheDocument();
      });
    });
  });
});
