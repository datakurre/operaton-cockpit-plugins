import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { InstanceDiagramAutoRefresh } from '../InstanceDiagramAutoRefresh';
import { InstanceDiagramHistoricActivities } from '../InstanceDiagramHistoricActivities';
import { InstanceTabAuditLog } from '../InstanceTabAuditLog';
import { TasklistTabAuditLog } from '../TasklistTabAuditLog';
import { setFetchFunction, resetFetchFunction } from '../../utils/api';
import { renderActivities, renderSequenceFlow } from '../../utils/bpmn';
import { MemoryStorage, resetStorage, setStorage } from '../../utils/storage';
import { mockApi } from '../../__mocks__/api';

// Mock bpmn utilities
jest.mock('../../utils/bpmn', () => ({
  renderSequenceFlow: jest.fn().mockReturnValue([]),
  clearSequenceFlow: jest.fn(),
  renderActivities: jest.fn(),
}));

/**
 * Creates a mock fetch that routes based on URL patterns.
 */
function createRoutedMockFetch(routes: Record<string, unknown>) {
  return (url: string) => {
    let data: unknown = [];
    for (const [pattern, responseData] of Object.entries(routes)) {
      if (url.includes(pattern)) {
        data = responseData;
        break;
      }
    }
    return Promise.resolve({
      ok: true,
      status: 200,
      headers: {
        get: (name: string) => (name === 'Content-Type' ? 'application/json' : null),
      },
      json: async () => data,
      text: async () => JSON.stringify(data),
    });
  };
}

describe('InstanceDiagramAutoRefresh', () => {
  let mockViewerContainer: HTMLDivElement;
  let mockViewer: { get: jest.Mock; _container: HTMLDivElement };

  beforeEach(() => {
    mockViewerContainer = document.createElement('div');
    document.body.appendChild(mockViewerContainer);
    mockViewer = {
      get: jest.fn().mockReturnValue({
        add: jest.fn(),
      }),
      _container: mockViewerContainer,
    };
  });

  afterEach(() => {
    document.body.removeChild(mockViewerContainer);
  });

  it('should render ToggleAutoRefreshButton', async () => {
    render(<InstanceDiagramAutoRefresh api={mockApi} processInstanceId="test-id" viewer={mockViewer} />);

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('title', 'Auto refresh view');
    });
  });

  it('should pass api and processInstanceId to inner component', async () => {
    render(<InstanceDiagramAutoRefresh api={mockApi} processInstanceId="custom-instance-id" viewer={mockViewer} />);

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });
});

describe('InstanceDiagramHistoricActivities', () => {
  const mockViewer = {
    get: jest.fn().mockReturnValue({
      add: jest.fn(),
    }),
    _container: document.createElement('div'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetFetchFunction();
  });

  afterEach(() => {
    resetFetchFunction();
  });

  it('should render ToggleSequenceFlowButton after loading activities', async () => {
    const activities = [{ activityId: 'task1', activityName: 'Task 1', endTime: '2024-01-01T10:00:00.000Z' }];
    setFetchFunction(
      createRoutedMockFetch({
        'activity-instance': activities,
      })
    );

    render(<InstanceDiagramHistoricActivities api={mockApi} processInstanceId="test-id" viewer={mockViewer} />);

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    expect(screen.getByTitle('Show sequence flow')).toBeInTheDocument();
  });

  it('should not render anything while loading', () => {
    // Mock fetch that never resolves
    setFetchFunction(() => new Promise(() => {}));

    const { container } = render(
      <InstanceDiagramHistoricActivities api={mockApi} processInstanceId="test-id" viewer={mockViewer} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render badge overlays for the fetched activities', async () => {
    const activities = [
      { activityId: 'task1', activityName: 'Task 1', endTime: '2024-01-01T10:00:00.000Z' },
      { activityId: 'task1', activityName: 'Task 1', endTime: '2024-01-01T11:00:00.000Z' },
      { activityId: 'task2', activityName: 'Task 2', endTime: '2024-01-01T12:00:00.000Z' },
    ];
    setFetchFunction(
      createRoutedMockFetch({
        'activity-instance': activities,
      })
    );

    render(<InstanceDiagramHistoricActivities api={mockApi} processInstanceId="test-id" viewer={mockViewer} />);

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    // Badge counting itself lives in utils/bpmn; here we only own the delegation.
    expect(renderActivities).toHaveBeenCalledWith(mockViewer, activities);
  });

  it('should draw the executed path once when mounted with the toggle already on', async () => {
    // StrictMode runs mount effects twice. The drawn paths must be tracked synchronously,
    // or the second run draws a duplicate set that the toggle can no longer clear.
    const storage = new MemoryStorage();
    storage.set('minimal-history-plugin', JSON.stringify({ showSequenceFlow: true }));
    setStorage(storage);
    const activities = [{ activityId: 'task1', activityName: 'Task 1', endTime: '2024-01-01T10:00:00.000Z' }];
    (renderSequenceFlow as jest.Mock).mockReturnValue([document.createElementNS('http://www.w3.org/2000/svg', 'path')]);
    setFetchFunction(
      createRoutedMockFetch({
        'activity-instance': activities,
      })
    );

    render(
      <React.StrictMode>
        <InstanceDiagramHistoricActivities api={mockApi} processInstanceId="test-id" viewer={mockViewer} />
      </React.StrictMode>
    );

    await waitFor(() => {
      expect(screen.getByTitle('Hide sequence flow')).toBeInTheDocument();
    });

    expect(renderSequenceFlow).toHaveBeenCalledTimes(1);
    resetStorage();
  });
});

describe('InstanceTabAuditLog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetFetchFunction();
  });

  afterEach(() => {
    resetFetchFunction();
  });

  it('should show loading state initially', () => {
    setFetchFunction(() => new Promise(() => {}));

    render(<InstanceTabAuditLog api={mockApi} processInstanceId="test-id" />);

    // LoadingSpinner has text twice: once visible and once in screen reader span
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should render AuditLogTable with fetched data', async () => {
    const activities = [
      { activityId: 'task1', activityInstanceId: 'inst1', activityName: 'Task 1', endTime: '2024-01-01T10:00:00.000Z' },
    ];
    setFetchFunction(
      createRoutedMockFetch({
        'activity-instance': activities,
        'decision-instance': [],
      })
    );

    render(<InstanceTabAuditLog api={mockApi} processInstanceId="test-id" />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    // Should have rendered the table
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should show error message on fetch failure', async () => {
    // Suppress console.error for this error handling test
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    setFetchFunction(jest.fn().mockRejectedValue(new Error('Network error')));

    render(<InstanceTabAuditLog api={mockApi} processInstanceId="test-id" />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load audit log data.')).toBeInTheDocument();
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});

describe('TasklistTabAuditLog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetFetchFunction();
  });

  afterEach(() => {
    resetFetchFunction();
  });

  it('should show message when no task is selected', () => {
    render(<TasklistTabAuditLog api={mockApi} taskId={undefined} />);

    expect(screen.getByText('No task selected.')).toBeInTheDocument();
  });

  it('should show loading state when task is provided', () => {
    setFetchFunction(() => new Promise(() => {}));

    render(<TasklistTabAuditLog api={mockApi} taskId="task-123" />);

    // LoadingSpinner has text twice: once visible and once in screen reader span
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('should fetch task and audit data when taskId is provided', async () => {
    const taskData = { processInstanceId: 'instance-123' };
    const activities = [
      { activityId: 'task1', activityInstanceId: 'inst1', activityName: 'Task 1', endTime: '2024-01-01T10:00:00.000Z' },
    ];
    setFetchFunction(
      createRoutedMockFetch({
        '/task/': taskData,
        'activity-instance': activities,
        'decision-instance': [],
      })
    );

    render(<TasklistTabAuditLog api={mockApi} taskId="task-123" />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should show error message on fetch failure', async () => {
    // Suppress console.error for this error handling test
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    setFetchFunction(jest.fn().mockRejectedValue(new Error('Network error')));

    render(<TasklistTabAuditLog api={mockApi} taskId="task-123" />);

    await waitFor(() => {
      expect(screen.getByText('Failed to load audit log data.')).toBeInTheDocument();
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
