/**
 * Tests for MessageCorrelationForm component.
 *
 * @module
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MessageCorrelationForm from '../MessageCorrelationForm';
import { mockApi } from '../../__mocks__/api';
import { setAngularProvider, resetAngularProvider } from '../../utils/angular';

// Mock the API module
jest.mock('../../utils/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
}));

// Mock bpmnParsing module
jest.mock('../../utils/bpmnParsing', () => ({
  getBpmnElements: jest.fn(),
}));

// Mock angular using the injectable provider
const mockRouteReload = jest.fn();
const mockAngularProvider = {
  element: jest.fn(() => ({
    injector: jest.fn(() => ({
      get: jest.fn(() => ({
        reload: mockRouteReload,
      })),
    })),
  })),
};

// Import mocked modules
import { get, post } from '../../utils/api';
import { getBpmnElements } from '../../utils/bpmnParsing';

const mockGet = get as jest.MockedFunction<typeof get>;
const mockPost = post as jest.MockedFunction<typeof post>;
const mockGetBpmnElements = getBpmnElements as jest.MockedFunction<typeof getBpmnElements>;

describe('MessageCorrelationForm', () => {
  const defaultProps = {
    api: mockApi,
    processInstanceId: 'instance-123',
    processDefinitionId: 'definition-456',
    processData: {
      id: 'instance-123',
      definitionId: 'definition-456',
    },
  };

  const mockMessages = [
    { id: 'Message_Order', name: 'OrderReceived' },
    { id: 'Message_Cancel', name: 'CancelOrder' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Set up mock angular provider
    setAngularProvider(mockAngularProvider);
    mockGetBpmnElements.mockResolvedValue({
      activities: [],
      sequenceFlows: [],
      messages: mockMessages,
    });
    mockPost.mockResolvedValue({ status: 'ok' });
    mockRouteReload.mockClear();
  });

  afterEach(() => {
    resetAngularProvider();
  });

  describe('message dropdown population', () => {
    it('should load and display messages from BPMN definition', async () => {
      render(<MessageCorrelationForm {...defaultProps} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading messages...')).not.toBeInTheDocument();
      });

      const select = screen.getByRole('combobox');
      expect(select).toBeInTheDocument();

      const options = screen.getAllByRole('option');
      expect(options).toHaveLength(2);
      expect(options[0]).toHaveValue('OrderReceived');
      expect(options[1]).toHaveValue('CancelOrder');
    });

    it('should show loading state initially', async () => {
      render(<MessageCorrelationForm {...defaultProps} />);
      expect(screen.getByText('Loading messages...')).toBeInTheDocument();
      // Wait for async operations to complete to avoid act() warnings
      await waitFor(() => {
        expect(screen.queryByText('Loading messages...')).not.toBeInTheDocument();
      });
    });

    it('should display empty message when no message events found', async () => {
      mockGetBpmnElements.mockResolvedValue({
        activities: [],
        sequenceFlows: [],
        messages: [],
      });

      render(<MessageCorrelationForm {...defaultProps} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading messages...')).not.toBeInTheDocument();
      });

      expect(screen.getByText(/No message catch events found/i)).toBeInTheDocument();
    });

    it('should fetch process definition if not provided', async () => {
      mockGet.mockResolvedValue({ definitionId: 'def-from-api' });

      render(
        <MessageCorrelationForm
          api={mockApi}
          processInstanceId="instance-123"
          processDefinitionId={undefined}
          processData={undefined}
        />
      );

      await waitFor(() => {
        expect(mockGet).toHaveBeenCalledWith(mockApi, '/process-instance/instance-123');
      });
    });
  });

  describe('form submission', () => {
    it('should submit correlation request with message name', async () => {
      const user = userEvent.setup();
      render(<MessageCorrelationForm {...defaultProps} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading messages...')).not.toBeInTheDocument();
      });

      const submitButton = screen.getByRole('button', { name: 'Correlate Message' });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockPost).toHaveBeenCalledWith(
          mockApi,
          '/message',
          {},
          expect.stringContaining('"messageName":"OrderReceived"')
        );
      });
    });

    it('should include processInstanceId in correlation request', async () => {
      const user = userEvent.setup();
      render(<MessageCorrelationForm {...defaultProps} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading messages...')).not.toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Correlate Message' }));

      await waitFor(() => {
        expect(mockPost).toHaveBeenCalledWith(
          mockApi,
          '/message',
          {},
          expect.stringContaining('"processInstanceId":"instance-123"')
        );
      });
    });

    it('should disable submit button while submitting', async () => {
      const user = userEvent.setup();
      // Delay the post response
      mockPost.mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(() => {
              resolve({ status: 'ok' });
            }, 100)
          )
      );

      render(<MessageCorrelationForm {...defaultProps} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading messages...')).not.toBeInTheDocument();
      });

      const submitButton = screen.getByRole('button', { name: 'Correlate Message' });
      await user.click(submitButton);

      expect(screen.getByRole('button', { name: 'Correlating...' })).toBeDisabled();
    });

    it('should allow selecting different message from dropdown', async () => {
      const user = userEvent.setup();
      render(<MessageCorrelationForm {...defaultProps} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading messages...')).not.toBeInTheDocument();
      });

      const select = screen.getByRole('combobox');
      await user.selectOptions(select, 'CancelOrder');

      await user.click(screen.getByRole('button', { name: 'Correlate Message' }));

      await waitFor(() => {
        expect(mockPost).toHaveBeenCalledWith(
          mockApi,
          '/message',
          {},
          expect.stringContaining('"messageName":"CancelOrder"')
        );
      });
    });
  });

  describe('advanced options toggle', () => {
    it('should not show advanced options by default', async () => {
      render(<MessageCorrelationForm {...defaultProps} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading messages...')).not.toBeInTheDocument();
      });

      expect(screen.queryByText('Correlation Keys')).not.toBeInTheDocument();
      expect(screen.queryByText('Local Correlation Keys')).not.toBeInTheDocument();
    });

    it('should show advanced options when checkbox is checked', async () => {
      const user = userEvent.setup();
      render(<MessageCorrelationForm {...defaultProps} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading messages...')).not.toBeInTheDocument();
      });

      const advancedCheckbox = screen.getByRole('checkbox', { name: /advanced correlation options/i });
      await user.click(advancedCheckbox);

      expect(screen.getByText('Correlation Keys')).toBeInTheDocument();
      expect(screen.getByText('Local Correlation Keys')).toBeInTheDocument();
      expect(screen.getByText('Process Variables')).toBeInTheDocument();
      expect(screen.getByText('Process Variables Local')).toBeInTheDocument();
    });

    it('should hide advanced options when checkbox is unchecked', async () => {
      const user = userEvent.setup();
      render(<MessageCorrelationForm {...defaultProps} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading messages...')).not.toBeInTheDocument();
      });

      const advancedCheckbox = screen.getByRole('checkbox', { name: /advanced correlation options/i });
      await user.click(advancedCheckbox); // Show
      await user.click(advancedCheckbox); // Hide

      expect(screen.queryByText('Correlation Keys')).not.toBeInTheDocument();
    });
  });

  describe('error display', () => {
    // Suppress console.error for these tests since they intentionally trigger error handling
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    it('should show error message when BPMN loading fails', async () => {
      mockGetBpmnElements.mockRejectedValue(new Error('Failed to load'));

      render(<MessageCorrelationForm {...defaultProps} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading messages...')).not.toBeInTheDocument();
      });

      expect(screen.getByText(/Failed to load BPMN messages/i)).toBeInTheDocument();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should show error message when correlation request fails', async () => {
      const user = userEvent.setup();
      mockPost.mockRejectedValue(new Error('Correlation failed'));

      render(<MessageCorrelationForm {...defaultProps} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading messages...')).not.toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Correlate Message' }));

      await waitFor(() => {
        expect(screen.getByText(/Failed to correlate message/i)).toBeInTheDocument();
      });
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    it('should style error messages with error colors', async () => {
      mockPost.mockRejectedValue(new Error('Correlation failed'));

      const user = userEvent.setup();
      render(<MessageCorrelationForm {...defaultProps} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading messages...')).not.toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Correlate Message' }));

      await waitFor(() => {
        const errorDiv = screen.getByText(/Failed to correlate message/i).closest('div');
        expect(errorDiv).toHaveClass('alert', 'alert-danger');
      });
    });
  });

  describe('success message and reload', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should show success message after successful correlation', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<MessageCorrelationForm {...defaultProps} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading messages...')).not.toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Correlate Message' }));

      await waitFor(() => {
        expect(screen.getByText(/Message correlated successfully/i)).toBeInTheDocument();
      });
    });

    it('should style success messages with success colors', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<MessageCorrelationForm {...defaultProps} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading messages...')).not.toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Correlate Message' }));

      await waitFor(() => {
        const successDiv = screen.getByText(/Message correlated successfully/i).closest('div');
        expect(successDiv).toHaveClass('alert', 'alert-success');
      });
    });

    it('should reload page after successful correlation', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      render(<MessageCorrelationForm {...defaultProps} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading messages...')).not.toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Correlate Message' }));

      await waitFor(() => {
        expect(screen.getByText(/Message correlated successfully/i)).toBeInTheDocument();
      });

      // Fast-forward past the reload delay
      jest.advanceTimersByTime(2000);

      await waitFor(() => {
        expect(mockRouteReload).toHaveBeenCalled();
      });
    });
  });

  describe('variable transformation', () => {
    it('should submit correlation request with correct structure', async () => {
      const user = userEvent.setup();
      render(<MessageCorrelationForm {...defaultProps} />);

      await waitFor(() => {
        expect(screen.queryByText('Loading messages...')).not.toBeInTheDocument();
      });

      // Submit form with default values
      await user.click(screen.getByRole('button', { name: 'Correlate Message' }));

      await waitFor(() => {
        expect(mockPost).toHaveBeenCalledWith(mockApi, '/message', {}, expect.stringContaining('"correlationKeys":{}'));
      });
    });
  });
});
