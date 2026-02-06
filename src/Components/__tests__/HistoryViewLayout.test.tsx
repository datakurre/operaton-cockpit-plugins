/**
 * Tests for HistoryViewLayout component.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HistoryViewLayout from '../HistoryViewLayout';

// Mock allotment to avoid CSS issues
jest.mock('allotment', () => ({
  Allotment: ({ children, onChange }: { children: React.ReactNode; onChange?: (sizes: number[]) => void }) => {
    // Call onChange to test settings saving
    if (onChange) {
      onChange([300, 600]);
    }
    return <div data-testid="allotment">{children}</div>;
  },
  __esModule: true,
}));

// Extend the mock Allotment with Pane
const AllotmentMock = require('allotment').Allotment;
AllotmentMock.Pane = ({ children }: { children: React.ReactNode }) => (
  <div data-testid="allotment-pane">{children}</div>
);

// Mock the child components to simplify testing
jest.mock('../BPMN', () => ({
  __esModule: true,
  default: () => <div data-testid="bpmn-viewer">BPMN Viewer</div>,
}));

jest.mock('../ProcessInfoPanel', () => ({
  __esModule: true,
  default: ({ instance }: { instance: { id: string } }) => (
    <div data-testid="process-info-panel">Process Info: {instance.id}</div>
  ),
}));

jest.mock('../AuditLogTable', () => ({
  __esModule: true,
  default: ({ activities }: { activities: unknown[] }) => (
    <div data-testid="audit-log-table">Audit Log: {activities.length} activities</div>
  ),
}));

jest.mock('../VariablesTable', () => ({
  __esModule: true,
  default: ({ variables }: { variables: unknown[] }) => (
    <div data-testid="variables-table">Variables: {variables.length} variables</div>
  ),
}));

// Mock settings utilities
jest.mock('../../utils/misc', () => ({
  loadSettings: jest.fn(() => ({})),
  saveSettings: jest.fn(),
}));

describe('HistoryViewLayout', () => {
  const mockInstance = {
    id: 'test-instance-123',
    processDefinitionId: 'process:1:abc',
    businessKey: 'BK-001',
    startTime: '2024-01-15T10:00:00.000+0000',
    endTime: null,
    state: 'ACTIVE' as const,
  };

  const mockHistoricInstance = {
    id: 'test-instance-123',
    processDefinitionId: 'process:1:abc',
    businessKey: 'BK-001',
    startTime: '2024-01-15T10:00:00.000+0000',
    endTime: null,
    state: 'ACTIVE' as const,
  };

  const mockDefinition = {
    id: 'process:1:abc',
    key: 'process',
    name: 'Test Process',
    version: 1,
    versionTag: null,
  };

  const mockActivities = [
    { id: 'activity1', endTime: null },
    { id: 'activity2', endTime: '2024-01-15T10:05:00.000+0000' },
  ];

  const mockVariables = [
    { name: 'var1', value: 'value1' },
    { name: 'var2', value: 42 },
  ];

  const mockActivityById = new Map([
    ['activity1', { id: 'activity1', endTime: null }],
    ['activity2', { id: 'activity2', endTime: '2024-01-15T10:05:00.000+0000' }],
  ]);

  const mockDecisionByActivity = new Map<string, string>();

  const defaultProps = {
    instance: mockInstance,
    historicInstance: mockHistoricInstance,
    definition: mockDefinition,
    diagramXML: '<bpmn />',
    activities: mockActivities,
    variables: mockVariables,
    activityById: mockActivityById,
    decisionByActivity: mockDecisionByActivity,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render the layout container', () => {
      render(<HistoryViewLayout {...defaultProps} />);

      // Multiple nested allotments, use getAllByTestId
      const allotments = screen.getAllByTestId('allotment');
      expect(allotments.length).toBeGreaterThan(0);
    });

    it('should render process info panel', () => {
      render(<HistoryViewLayout {...defaultProps} />);

      expect(screen.getByTestId('process-info-panel')).toBeInTheDocument();
      expect(screen.getByText(/Process Info: test-instance-123/)).toBeInTheDocument();
    });

    it('should render BPMN viewer', () => {
      render(<HistoryViewLayout {...defaultProps} />);

      expect(screen.getByTestId('bpmn-viewer')).toBeInTheDocument();
    });

    it('should render audit log tab', () => {
      render(<HistoryViewLayout {...defaultProps} />);

      expect(screen.getByRole('button', { name: /audit log/i })).toBeInTheDocument();
    });

    it('should render variables tab', () => {
      render(<HistoryViewLayout {...defaultProps} />);

      expect(screen.getByRole('button', { name: /variables/i })).toBeInTheDocument();
    });
  });

  describe('tabs', () => {
    it('should render audit log content', () => {
      render(<HistoryViewLayout {...defaultProps} />);

      expect(screen.getByTestId('audit-log-table')).toBeInTheDocument();
      expect(screen.getByText(/Audit Log: 2 activities/)).toBeInTheDocument();
    });

    it('should render variables content', () => {
      render(<HistoryViewLayout {...defaultProps} />);

      // Variables tab needs to be selected first for content to render
      const variablesTab = screen.getByRole('button', { name: /variables/i });
      fireEvent.click(variablesTab);

      expect(screen.getByTestId('variables-table')).toBeInTheDocument();
      expect(screen.getByText(/Variables: 2 variables/)).toBeInTheDocument();
    });

    it('should allow switching between tabs', () => {
      render(<HistoryViewLayout {...defaultProps} />);

      const variablesTab = screen.getByRole('button', { name: /variables/i });
      fireEvent.click(variablesTab);

      // Variables table should still be in DOM (react-tabs doesn't unmount)
      expect(screen.getByTestId('variables-table')).toBeInTheDocument();
    });
  });

  describe('resizable panes', () => {
    it('should render multiple allotment panes', () => {
      render(<HistoryViewLayout {...defaultProps} />);

      const panes = screen.getAllByTestId('allotment-pane');
      expect(panes.length).toBeGreaterThan(0);
    });

    it('should save settings when pane sizes change', () => {
      const { saveSettings } = require('../../utils/misc');
      render(<HistoryViewLayout {...defaultProps} />);

      // Mock allotment calls onChange automatically
      expect(saveSettings).toHaveBeenCalled();
    });
  });

  describe('data passing', () => {
    it('should pass activities to audit log table', () => {
      const manyActivities = [
        { id: 'a1', endTime: null },
        { id: 'a2', endTime: null },
        { id: 'a3', endTime: '2024-01-15T10:05:00.000+0000' },
      ];

      render(<HistoryViewLayout {...defaultProps} activities={manyActivities} />);

      expect(screen.getByText(/Audit Log: 3 activities/)).toBeInTheDocument();
    });

    it('should pass variables to variables table', () => {
      const manyVariables = [
        { name: 'v1', value: 'a' },
        { name: 'v2', value: 'b' },
        { name: 'v3', value: 'c' },
        { name: 'v4', value: 'd' },
      ];

      render(<HistoryViewLayout {...defaultProps} variables={manyVariables} />);

      // Variables tab needs to be selected first for content to render
      const variablesTab = screen.getByRole('button', { name: /variables/i });
      fireEvent.click(variablesTab);

      expect(screen.getByText(/Variables: 4 variables/)).toBeInTheDocument();
    });
  });
});
