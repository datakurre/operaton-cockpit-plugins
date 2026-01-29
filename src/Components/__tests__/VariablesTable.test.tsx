/**
 * Tests for VariablesTable component.
 *
 * @module
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VariablesTable from '../VariablesTable';
import APIContext from '../APIContext';

// Mock Clippy component
jest.mock('../Clippy', () => ({
  __esModule: true,
  Clippy: ({ children }: { children: React.ReactNode }) => {
    return <span data-testid="clippy">{children}</span>;
  },
}));

// Mock react-modal
jest.mock('react-modal', () => {
  const MockModal = ({ isOpen, children }: { isOpen: boolean; children: React.ReactNode }) => {
    if (!isOpen) {
      return null;
    }
    return <div data-testid="modal">{children}</div>;
  };
  MockModal.defaultStyles = {};
  return MockModal;
});

// Mock react-jason
jest.mock('react-jason', () => ({
  ReactJason: ({ value }: { value: unknown }) => <pre data-testid="json-viewer">{JSON.stringify(value, null, 2)}</pre>,
}));
jest.mock('react-jason/themes/github', () => ({}), { virtual: true });

/** Default mock API configuration. */
const mockApi = {
  engineApi: '/engine-rest',
  csrfCookieName: 'XSRF-TOKEN',
};

describe('VariablesTable', () => {
  /**
   * Creates a mock process instance.
   */
  function createMockInstance(overrides: Record<string, unknown> = {}) {
    return {
      id: 'instance-123',
      processDefinitionName: 'Test Process',
      ...overrides,
    };
  }

  /**
   * Creates a mock variable.
   */
  function createMockVariable(overrides: Record<string, unknown> = {}) {
    return {
      id: 'var-1',
      name: 'myVariable',
      type: 'String',
      value: 'test value',
      activityInstanceId: 'instance-123',
      createTime: '2024-01-01T10:00:00.000Z',
      ...overrides,
    };
  }

  /**
   * Renders the component with API context.
   */
  function renderWithContext(ui: React.ReactElement) {
    return render(<APIContext.Provider value={mockApi}>{ui}</APIContext.Provider>);
  }

  describe('rendering', () => {
    it('should render table with column headers', () => {
      const instance = createMockInstance();
      const activities = new Map<string, unknown>();
      const variables: unknown[] = [];

      renderWithContext(<VariablesTable instance={instance} activities={activities} variables={variables} />);

      expect(screen.getByText('Name')).toBeInTheDocument();
      expect(screen.getByText('Type')).toBeInTheDocument();
      expect(screen.getByText('Value')).toBeInTheDocument();
      expect(screen.getByText('Scope')).toBeInTheDocument();
      expect(screen.getByText('Created')).toBeInTheDocument();
    });

    it('should render variable rows', () => {
      const instance = createMockInstance();
      const activities = new Map<string, unknown>();
      const variables = [createMockVariable()];

      renderWithContext(<VariablesTable instance={instance} activities={activities} variables={variables} />);

      expect(screen.getByText('myVariable')).toBeInTheDocument();
      expect(screen.getByText('String')).toBeInTheDocument();
      expect(screen.getByText('test value')).toBeInTheDocument();
    });

    it('should render multiple variables', () => {
      const instance = createMockInstance();
      const activities = new Map<string, unknown>();
      const variables = [
        createMockVariable({ id: 'v1', name: 'variable1', value: 'value1' }),
        createMockVariable({ id: 'v2', name: 'variable2', value: 'value2' }),
        createMockVariable({ id: 'v3', name: 'variable3', value: 'value3' }),
      ];

      renderWithContext(<VariablesTable instance={instance} activities={activities} variables={variables} />);

      expect(screen.getByText('variable1')).toBeInTheDocument();
      expect(screen.getByText('variable2')).toBeInTheDocument();
      expect(screen.getByText('variable3')).toBeInTheDocument();
    });

    it('should handle empty variables array', () => {
      const instance = createMockInstance();
      const activities = new Map<string, unknown>();
      const variables: unknown[] = [];

      renderWithContext(<VariablesTable instance={instance} activities={activities} variables={variables} />);

      // Table should render with headers but no rows
      expect(screen.getByText('Name')).toBeInTheDocument();
      const table = screen.getByRole('table');
      const tbody = table.querySelector('tbody');
      expect(tbody?.querySelectorAll('tr')).toHaveLength(0);
    });
  });

  describe('variable types', () => {
    it('should display String variable value directly', () => {
      const instance = createMockInstance();
      const activities = new Map<string, unknown>();
      const variables = [createMockVariable({ type: 'String', value: 'Hello World' })];

      renderWithContext(<VariablesTable instance={instance} activities={activities} variables={variables} />);

      expect(screen.getByText('Hello World')).toBeInTheDocument();
    });

    it('should display Integer variable value directly', () => {
      const instance = createMockInstance();
      const activities = new Map<string, unknown>();
      const variables = [createMockVariable({ type: 'Integer', value: 42 })];

      renderWithContext(<VariablesTable instance={instance} activities={activities} variables={variables} />);

      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('should display Boolean variable value directly', () => {
      const instance = createMockInstance();
      const activities = new Map<string, unknown>();
      const variables = [createMockVariable({ type: 'Boolean', value: true })];

      renderWithContext(<VariablesTable instance={instance} activities={activities} variables={variables} />);

      expect(screen.getByText('true')).toBeInTheDocument();
    });

    it('should show View button for Object type variables', () => {
      const instance = createMockInstance();
      const activities = new Map<string, unknown>();
      const variables = [createMockVariable({ type: 'Object', value: { key: 'value' } })];

      renderWithContext(<VariablesTable instance={instance} activities={activities} variables={variables} />);

      expect(screen.getByText('View')).toBeInTheDocument();
    });

    it('should show View button for Json type variables', () => {
      const instance = createMockInstance();
      const activities = new Map<string, unknown>();
      const variables = [createMockVariable({ type: 'Json', value: '{"key":"value"}' })];

      renderWithContext(<VariablesTable instance={instance} activities={activities} variables={variables} />);

      expect(screen.getByText('View')).toBeInTheDocument();
    });

    it('should show Download link for File type variables', () => {
      const instance = createMockInstance();
      const activities = new Map<string, unknown>();
      const variables = [createMockVariable({ id: 'file-var-1', type: 'File', value: null })];

      renderWithContext(<VariablesTable instance={instance} activities={activities} variables={variables} />);

      const downloadLink = screen.getByText('Download');
      expect(downloadLink).toBeInTheDocument();
      expect(downloadLink.closest('a')).toHaveAttribute(
        'href',
        '/engine-rest/history/variable-instance/file-var-1/data'
      );
    });
  });

  describe('scope', () => {
    it('should display process definition name as scope for instance-level variables', () => {
      const instance = createMockInstance({
        id: 'instance-123',
        processDefinitionName: 'My Process',
      });
      const activities = new Map<string, unknown>();
      const variables = [createMockVariable({ activityInstanceId: 'instance-123' })];

      renderWithContext(<VariablesTable instance={instance} activities={activities} variables={variables} />);

      expect(screen.getByText('My Process')).toBeInTheDocument();
    });

    it('should display activity name as scope for activity-level variables', () => {
      const instance = createMockInstance({ id: 'instance-123' });
      const activities = new Map<string, unknown>([['activity-456', { activityName: 'User Task' }]]);
      const variables = [createMockVariable({ activityInstanceId: 'activity-456' })];

      renderWithContext(<VariablesTable instance={instance} activities={activities} variables={variables} />);

      expect(screen.getByText('User Task')).toBeInTheDocument();
    });
  });

  describe('filtering', () => {
    it('should only show variables for the current instance or known activities', () => {
      const instance = createMockInstance({ id: 'instance-123' });
      const activities = new Map<string, unknown>([['activity-known', { activityName: 'Known Activity' }]]);
      const variables = [
        createMockVariable({ id: 'v1', name: 'visible1', activityInstanceId: 'instance-123' }),
        createMockVariable({ id: 'v2', name: 'visible2', activityInstanceId: 'activity-known' }),
        createMockVariable({ id: 'v3', name: 'hidden', activityInstanceId: 'activity-unknown' }),
      ];

      renderWithContext(<VariablesTable instance={instance} activities={activities} variables={variables} />);

      expect(screen.getByText('visible1')).toBeInTheDocument();
      expect(screen.getByText('visible2')).toBeInTheDocument();
      expect(screen.queryByText('hidden')).not.toBeInTheDocument();
    });
  });

  describe('date formatting', () => {
    it('should format creation time correctly', () => {
      const instance = createMockInstance();
      const activities = new Map<string, unknown>();
      const variables = [createMockVariable({ createTime: '2024-06-15T14:30:45.000Z' })];

      renderWithContext(<VariablesTable instance={instance} activities={activities} variables={variables} />);

      // Check for formatted date pattern
      const clippyElements = screen.getAllByTestId('clippy');
      const datePattern = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/;
      const hasFormattedDate = clippyElements.some(el => datePattern.test(el.textContent ?? ''));
      expect(hasFormattedDate).toBe(true);
    });

    it('should handle missing creation time', () => {
      const instance = createMockInstance();
      const activities = new Map<string, unknown>();
      const variables = [createMockVariable({ createTime: null })];

      renderWithContext(<VariablesTable instance={instance} activities={activities} variables={variables} />);

      // Should render without error
      expect(screen.getByText('myVariable')).toBeInTheDocument();
    });
  });

  describe('modal', () => {
    it('should open modal when clicking View button for Object type', async () => {
      const user = userEvent.setup();
      const instance = createMockInstance();
      const activities = new Map<string, unknown>();
      const variables = [createMockVariable({ name: 'objectVar', type: 'Object', value: { nested: 'data' } })];

      renderWithContext(<VariablesTable instance={instance} activities={activities} variables={variables} />);

      const viewButton = screen.getByText('View');
      await user.click(viewButton);

      expect(screen.getByTestId('modal')).toBeInTheDocument();
      expect(screen.getByText(/Inspect "objectVar" variable/)).toBeInTheDocument();
    });
  });

  describe('sorting', () => {
    it('should allow clicking on column headers for sorting', async () => {
      const user = userEvent.setup();
      const instance = createMockInstance();
      const activities = new Map<string, unknown>();
      const variables = [
        createMockVariable({ id: 'v1', name: 'alpha' }),
        createMockVariable({ id: 'v2', name: 'beta' }),
      ];

      renderWithContext(<VariablesTable instance={instance} activities={activities} variables={variables} />);

      const nameHeader = screen.getByText('Name');
      await user.click(nameHeader);

      // Both should still be visible
      expect(screen.getByText('alpha')).toBeInTheDocument();
      expect(screen.getByText('beta')).toBeInTheDocument();
    });
  });
});
