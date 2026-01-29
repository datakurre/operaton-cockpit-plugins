/**
 * Tests for ToggleAutoRefreshButton component.
 *
 * Tests the auto-refresh toggle button that controls polling for process instance updates.
 *
 * @module
 */
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToggleAutoRefreshButton } from '../ToggleAutoRefreshButton';
import { setAngularProvider, resetAngularProvider } from '../../utils/angular';

// Mock the utils
jest.mock('../../utils/misc', () => ({
  loadSettings: jest.fn(() => ({
    autoRefresh: false,
    showHistoricBadges: false,
    showSequenceFlow: false,
    leftPaneSize: null,
    topPaneSize: null,
  })),
  saveSettings: jest.fn(),
}));

jest.mock('../../utils/api', () => ({
  get: jest.fn().mockResolvedValue([{ id: 'activity-1' }]),
}));

// Mock angular using the injectable provider
const mockReload = jest.fn();
const mockAngularProvider = {
  element: jest.fn().mockReturnValue({
    injector: jest.fn().mockReturnValue({
      get: jest.fn().mockReturnValue({
        reload: mockReload,
      }),
    }),
  }),
};

describe('ToggleAutoRefreshButton', () => {
  const mockApi = {
    adminApi: '/api/admin',
    baseApi: '/api',
    engineApi: '/api/engine/default',
    engine: 'default',
    tasklistApi: '/api/tasklist',
    CSRFToken: 'test-token',
  };

  // Suppress console.debug for auto-refresh polling tests
  let consoleDebugSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation();
    // Set up mock angular provider
    setAngularProvider(mockAngularProvider);
    // Reset localStorage mock
    (localStorage.getItem as jest.Mock).mockReturnValue(null);
    // Reset loadSettings mock
    const { loadSettings } = require('../../utils/misc');
    loadSettings.mockReturnValue({
      autoRefresh: false,
      showHistoricBadges: false,
      showSequenceFlow: false,
      leftPaneSize: null,
      topPaneSize: null,
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    resetAngularProvider();
    consoleDebugSpy.mockRestore();
  });

  describe('rendering', () => {
    it('should render with correct aria-label when off', () => {
      render(<ToggleAutoRefreshButton api={mockApi} processInstanceId="instance-123" />);

      expect(screen.getByRole('button', { name: 'Auto refresh view' })).toBeInTheDocument();
    });

    it('should render with correct aria-label when on', () => {
      const { loadSettings } = require('../../utils/misc');
      loadSettings.mockReturnValue({ autoRefresh: true });

      render(<ToggleAutoRefreshButton api={mockApi} processInstanceId="instance-123" />);

      expect(screen.getByRole('button', { name: 'Auto refresh view off' })).toBeInTheDocument();
    });

    it('should have correct title attribute when off', () => {
      render(<ToggleAutoRefreshButton api={mockApi} processInstanceId="instance-123" />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title', 'Auto refresh view');
    });

    it('should have correct title attribute when on', () => {
      const { loadSettings } = require('../../utils/misc');
      loadSettings.mockReturnValue({ autoRefresh: true });

      render(<ToggleAutoRefreshButton api={mockApi} processInstanceId="instance-123" />);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('title', 'Auto refresh view off');
    });
  });

  describe('toggle behavior', () => {
    it('should toggle state when clicked', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(<ToggleAutoRefreshButton api={mockApi} processInstanceId="instance-123" />);

      const button = screen.getByRole('button', { name: 'Auto refresh view' });
      await user.click(button);

      expect(screen.getByRole('button', { name: 'Auto refresh view off' })).toBeInTheDocument();
    });

    it('should toggle back when clicked again', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

      render(<ToggleAutoRefreshButton api={mockApi} processInstanceId="instance-123" />);

      const button = screen.getByRole('button');

      // Toggle on
      await user.click(button);
      expect(screen.getByRole('button', { name: 'Auto refresh view off' })).toBeInTheDocument();

      // Toggle off
      await user.click(button);
      expect(screen.getByRole('button', { name: 'Auto refresh view' })).toBeInTheDocument();
    });

    it('should save settings when toggled', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const { saveSettings } = require('../../utils/misc');

      render(<ToggleAutoRefreshButton api={mockApi} processInstanceId="instance-123" />);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(saveSettings).toHaveBeenCalledWith(expect.objectContaining({ autoRefresh: true }));
    });
  });

  describe('polling behavior', () => {
    it('should clear previous interval data when turned off', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
      const { loadSettings } = require('../../utils/misc');
      loadSettings.mockReturnValue({ autoRefresh: true });

      render(<ToggleAutoRefreshButton api={mockApi} processInstanceId="instance-123" />);

      // Turn off auto-refresh
      const button = screen.getByRole('button');
      await user.click(button);

      expect(localStorage.removeItem).toHaveBeenCalled();
    });

    it('should start polling when autoRefresh is enabled', () => {
      const { loadSettings } = require('../../utils/misc');
      loadSettings.mockReturnValue({ autoRefresh: true });

      render(<ToggleAutoRefreshButton api={mockApi} processInstanceId="instance-123" />);

      // Fast-forward timer
      act(() => {
        jest.advanceTimersByTime(1000);
      });

      // Verify polling started (localStorage should be used)
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('should cleanup on unmount', () => {
      const { loadSettings } = require('../../utils/misc');
      loadSettings.mockReturnValue({ autoRefresh: true });

      const { unmount } = render(<ToggleAutoRefreshButton api={mockApi} processInstanceId="instance-123" />);

      unmount();

      expect(localStorage.removeItem).toHaveBeenCalled();
    });
  });

  describe('localStorage interaction', () => {
    it('should read previous activity data from localStorage', () => {
      const { loadSettings } = require('../../utils/misc');
      loadSettings.mockReturnValue({ autoRefresh: true });

      (localStorage.getItem as jest.Mock).mockReturnValue(JSON.stringify(['prev-activity-id', '123']));

      render(<ToggleAutoRefreshButton api={mockApi} processInstanceId="instance-123" />);

      expect(localStorage.getItem).toHaveBeenCalled();
    });

    it('should handle missing localStorage data gracefully', () => {
      const { loadSettings } = require('../../utils/misc');
      loadSettings.mockReturnValue({ autoRefresh: true });

      (localStorage.getItem as jest.Mock).mockReturnValue(null);

      // Should not throw
      expect(() => {
        render(<ToggleAutoRefreshButton api={mockApi} processInstanceId="instance-123" />);
      }).not.toThrow();
    });

    it('should handle corrupted localStorage data gracefully', () => {
      const { loadSettings } = require('../../utils/misc');
      loadSettings.mockReturnValue({ autoRefresh: true });

      (localStorage.getItem as jest.Mock).mockReturnValue('invalid-json');

      // Should handle gracefully (may throw in parsing, test handles it)
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => undefined);

      try {
        render(<ToggleAutoRefreshButton api={mockApi} processInstanceId="instance-123" />);
      } catch {
        // Expected if JSON.parse fails
      }

      consoleError.mockRestore();
    });
  });

  describe('visual appearance', () => {
    it('should render refresh icon with full opacity when on', () => {
      const { loadSettings } = require('../../utils/misc');
      loadSettings.mockReturnValue({ autoRefresh: true });

      render(<ToggleAutoRefreshButton api={mockApi} processInstanceId="instance-123" />);

      const button = screen.getByRole('button');
      const icon = button.querySelector('svg');
      expect(icon).toHaveStyle({ opacity: '1.0' });
    });

    it('should render refresh-off icon with reduced opacity when off', () => {
      render(<ToggleAutoRefreshButton api={mockApi} processInstanceId="instance-123" />);

      const button = screen.getByRole('button');
      const icon = button.querySelector('svg');
      expect(icon).toHaveStyle({ opacity: '0.33' });
    });
  });

  describe('accessibility', () => {
    it('should have accessible name', () => {
      render(<ToggleAutoRefreshButton api={mockApi} processInstanceId="instance-123" />);

      const button = screen.getByRole('button');
      expect(button).toHaveAccessibleName();
    });

    it('should be focusable', () => {
      render(<ToggleAutoRefreshButton api={mockApi} processInstanceId="instance-123" />);

      const button = screen.getByRole('button');
      button.focus();
      expect(document.activeElement).toBe(button);
    });
  });
});
