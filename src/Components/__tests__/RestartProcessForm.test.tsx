/**
 * Tests for RestartProcessForm: no preselected starting point, the guarded submit, the
 * earlier-restart check, and navigating only to the instance the engine links back.
 *
 * @module
 */
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import RestartProcessForm from '../RestartProcessForm';
import { mockApi } from '../../__mocks__/api';

jest.mock('../../utils/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

jest.mock('../../utils/bpmnParsing', () => ({
  getBpmnElements: jest.fn(),
}));

import { get, post } from '../../utils/api';
import { getBpmnElements } from '../../utils/bpmnParsing';

const mockGet = get as jest.MockedFunction<typeof get>;
const mockPost = post as jest.MockedFunction<typeof post>;
const mockGetBpmnElements = getBpmnElements as jest.MockedFunction<typeof getBpmnElements>;

const props = {
  api: mockApi,
  processDefinitionId: 'def-1',
  processInstanceId: 'old-1',
  processInstanceState: 'EXTERNALLY_TERMINATED',
  processInstanceBusinessKey: 'bk-1',
};

/**
 * Answer history lookups: earlier restarts for the dry run, running ones after submit.
 */
function historyReturns(earlier: object[], running: object[]): void {
  mockGet.mockImplementation(async (_api, _path, params) => (params?.['unfinished'] === 'true' ? running : earlier));
}

/**
 * Choose where to restart, run the dry run, and wait for the acknowledgement.
 */
async function prepareRestart(label = /Task_1/): Promise<HTMLElement> {
  const input = await screen.findByPlaceholderText('-- Select Starting Point --');
  fireEvent.focus(input);
  fireEvent.click(await screen.findByRole('option', { name: label }));
  fireEvent.click(screen.getByRole('button', { name: 'Dry Run' }));
  return screen.findByRole('checkbox', { name: /I understand|I acknowledge/ });
}

/** The submit button. */
function restartButton(): HTMLElement {
  return screen.getByRole('button', { name: 'Restart Instance' });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockGetBpmnElements.mockResolvedValue({
    activities: [{ id: 'Task_1', name: 'Review', type: 'UserTask' }],
    sequenceFlows: [],
    messages: [],
  });
  mockPost.mockResolvedValue(null);
  historyReturns([], []);
});

describe('RestartProcessForm', () => {
  it('preselects no starting point and refuses a dry run without one', async () => {
    render(<RestartProcessForm {...props} />);

    const input = await screen.findByPlaceholderText('-- Select Starting Point --');
    expect(input).toHaveValue('');
    expect(restartButton()).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'Dry Run' }));
    expect(await screen.findByText(/choose where the restarted instance starts/)).toBeInTheDocument();
    expect(mockPost).not.toHaveBeenCalled();
  });

  it('previews the restart request with the engine defaults spelled out', async () => {
    render(<RestartProcessForm {...props} />);
    await prepareRestart();

    const preview = screen.getByLabelText('Request preview');
    expect(preview).toHaveTextContent('POST /process-definition/def-1/restart');
    expect(preview).toHaveTextContent('"initialVariables": false');
    expect(preview).toHaveTextContent('"withoutBusinessKey": false');
    expect(restartButton()).toBeDisabled();
  });

  it('restarts once, then navigates only to the instance linked back to this one', async () => {
    historyReturns(
      [],
      [
        { id: 'someone-else', restartedProcessInstanceId: null },
        { id: 'new-1', restartedProcessInstanceId: 'old-1' },
      ]
    );
    render(<RestartProcessForm {...props} />);
    fireEvent.click(await prepareRestart());
    fireEvent.click(restartButton());

    expect(await screen.findByText(/Navigating to runtime view/)).toBeInTheDocument();
    expect(mockPost).toHaveBeenCalledTimes(1);
    expect(mockPost).toHaveBeenCalledWith(
      mockApi,
      '/process-definition/def-1/restart',
      {},
      expect.stringContaining('"processInstanceIds":["old-1"]')
    );
    expect(restartButton()).toBeDisabled();
  });

  it('does not navigate to the newest instance when none links back', async () => {
    historyReturns([], [{ id: 'someone-else', restartedProcessInstanceId: null }]);
    render(<RestartProcessForm {...props} />);
    fireEvent.click(await prepareRestart());
    fireEvent.click(restartButton());

    expect(await screen.findByText('Process instance restarted successfully!')).toBeInTheDocument();
    expect(screen.queryByText(/Navigating/)).not.toBeInTheDocument();
  });

  it('warns when the instance has already been restarted', async () => {
    historyReturns([{ id: 'new-0', restartedProcessInstanceId: 'old-1' }], []);
    render(<RestartProcessForm {...props} />);
    const acknowledgement = await prepareRestart();

    expect(screen.getByText(/already been restarted as new-0/)).toBeInTheDocument();
    expect(acknowledgement.closest('label')).toHaveTextContent('already been restarted before');
  });

  it('asks to acknowledge restarting a normally completed instance', async () => {
    render(<RestartProcessForm {...props} processInstanceState="COMPLETED" />);
    const acknowledgement = await prepareRestart(/Default start event/);

    expect(acknowledgement.closest('label')).toHaveTextContent('completed normally');
    expect(screen.getByLabelText('Request preview')).not.toHaveTextContent('instructions');
  });

  it('keeps the preview when the restart fails, so it can be retried', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    mockPost.mockRejectedValueOnce(new Error('boom'));
    render(<RestartProcessForm {...props} />);
    fireEvent.click(await prepareRestart());
    fireEvent.click(restartButton());

    expect(await screen.findByText(/Failed to restart process instance: boom/)).toBeInTheDocument();
    await waitFor(() => {
      expect(restartButton()).toBeEnabled();
    });
  });
});
