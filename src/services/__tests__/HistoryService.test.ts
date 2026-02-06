/**
 * Tests for the HistoryService abstraction.
 *
 * @module
 */
import { HistoryService, createHistoryService, IHistoryService } from '../HistoryService';
import { setFetchFunction, resetFetchFunction } from '../../utils/api';
import { mockApi } from '../../__mocks__/api';

describe('HistoryService', () => {
  let service: IHistoryService;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
    setFetchFunction(mockFetch as unknown as typeof fetch);
    service = new HistoryService(mockApi);
  });

  afterEach(() => {
    resetFetchFunction();
    jest.clearAllMocks();
  });

  describe('getActivities', () => {
    it('should fetch activities for a process instance', async () => {
      const mockActivities = [
        { id: 'act-1', activityId: 'start', activityType: 'startEvent' },
        { id: 'act-2', activityId: 'task1', activityType: 'userTask' },
      ];
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => mockActivities,
      });

      const result = await service.getActivities('instance-123');

      expect(mockFetch).toHaveBeenCalled();
      expect(result).toEqual(mockActivities);
    });

    it('should return empty array when fetch returns empty response', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => [],
      });

      const result = await service.getActivities('instance-123');

      expect(result).toEqual([]);
    });

    it('should pass additional params to the API', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => [],
      });

      await service.getActivities('instance-123', {
        sortBy: 'startTime',
        sortOrder: 'desc',
      });

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('sortBy=startTime'), expect.any(Object));
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('sortOrder=desc'), expect.any(Object));
    });
  });

  describe('getActivitiesByDefinition', () => {
    it('should fetch activities for a process definition', async () => {
      const mockActivities = [
        { id: 'act-1', activityId: 'start', activityType: 'startEvent' },
        { id: 'act-2', activityId: 'task1', activityType: 'userTask' },
      ];
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => mockActivities,
      });

      const result = await service.getActivitiesByDefinition('definition-456');

      expect(mockFetch).toHaveBeenCalled();
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('processDefinitionId=definition-456'),
        expect.any(Object)
      );
      expect(result).toEqual(mockActivities);
    });

    it('should pass FilterBox query parameters to the API', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => [],
      });

      await service.getActivitiesByDefinition('definition-456', {
        sortBy: 'endTime',
        sortOrder: 'desc',
        maxResults: '100',
        finished: true,
      });

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('sortBy=endTime'), expect.any(Object));
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('sortOrder=desc'), expect.any(Object));
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('maxResults=100'), expect.any(Object));
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('finished=true'), expect.any(Object));
    });

    it('should filter out null and undefined values from params', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => [],
      });

      await service.getActivitiesByDefinition('definition-456', {
        sortBy: 'endTime',
        activityId: null,
        activityName: undefined,
      });

      // Should contain sortBy but not activityId or activityName
      const callUrl = mockFetch.mock.calls[0]?.[0] as string;
      expect(callUrl).toContain('sortBy=endTime');
      expect(callUrl).not.toContain('activityId');
      expect(callUrl).not.toContain('activityName');
    });

    it('should return empty array when fetch returns empty response', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => [],
      });

      const result = await service.getActivitiesByDefinition('definition-456');

      expect(result).toEqual([]);
    });
  });

  describe('getVariables', () => {
    it('should fetch variables for a process instance', async () => {
      const mockVariables = [
        { id: 'var-1', name: 'orderNumber', type: 'String', value: '12345' },
        { id: 'var-2', name: 'amount', type: 'Integer', value: 100 },
      ];
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => mockVariables,
      });

      const result = await service.getVariables('instance-123');

      expect(result).toEqual(mockVariables);
    });
  });

  describe('getDecisions', () => {
    it('should fetch decision instances for a process instance', async () => {
      const mockDecisions = [
        {
          id: 'dec-1',
          decisionDefinitionId: 'def-1',
          decisionDefinitionKey: 'approval',
          evaluationTime: '2026-01-01T12:00:00.000Z',
        },
      ];
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => mockDecisions,
      });

      const result = await service.getDecisions('instance-123');

      expect(result).toEqual(mockDecisions);
    });
  });

  describe('getActivityStatistics', () => {
    it('should fetch activity statistics for a process definition', async () => {
      const mockStats = [
        { id: 'task1', instances: 5 },
        { id: 'task2', instances: 3 },
      ];
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => mockStats,
      });

      const result = await service.getActivityStatistics('definition-456');

      expect(result).toEqual(mockStats);
    });
  });

  describe('queryProcessInstances', () => {
    it('should query historic process instances', async () => {
      const mockInstances = [
        { id: 'inst-1', processDefinitionId: 'def-1', state: 'COMPLETED', startTime: '2026-01-01T10:00:00.000Z' },
        { id: 'inst-2', processDefinitionId: 'def-1', state: 'ACTIVE', startTime: '2026-01-01T11:00:00.000Z' },
      ];
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => mockInstances,
      });

      const result = await service.queryProcessInstances({ processDefinitionId: 'def-1' });

      expect(mockFetch).toHaveBeenCalled();
      expect(result).toEqual(mockInstances);
    });

    it('should pass pagination parameters as query params', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => [],
      });

      await service.queryProcessInstances(
        { processDefinitionId: 'def-1', sortBy: 'endTime', sortOrder: 'desc' },
        { maxResults: 10, firstResult: 5 }
      );

      const callUrl = mockFetch.mock.calls[0]?.[0] as string;
      expect(callUrl).toContain('maxResults=10');
      expect(callUrl).toContain('firstResult=5');
    });

    it('should send query body as JSON', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => [],
      });

      await service.queryProcessInstances({
        processDefinitionId: 'def-1',
        finished: true,
        variables: [{ name: 'status', operator: 'eq', value: 'approved' }],
      });

      const callOptions = mockFetch.mock.calls[0]?.[1] as RequestInit;
      expect(callOptions.method?.toUpperCase()).toBe('POST');
      const body = JSON.parse(callOptions.body as string);
      expect(body.processDefinitionId).toBe('def-1');
      expect(body.finished).toBe(true);
      expect(body.variables).toEqual([{ name: 'status', operator: 'eq', value: 'approved' }]);
    });
  });

  describe('countProcessInstances', () => {
    it('should count historic process instances', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => ({ count: 42 }),
      });

      const result = await service.countProcessInstances({ processDefinitionId: 'def-1' });

      expect(mockFetch).toHaveBeenCalled();
      expect(result).toBe(42);
    });

    it('should return 0 when response is invalid', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => ({}),
      });

      const result = await service.countProcessInstances({ processDefinitionId: 'def-1' });

      expect(result).toBe(0);
    });

    it('should send query as JSON body', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => ({ count: 10 }),
      });

      await service.countProcessInstances({
        processDefinitionKey: 'myProcess',
        unfinished: true,
      });

      const callOptions = mockFetch.mock.calls[0]?.[1] as RequestInit;
      expect(callOptions.method?.toUpperCase()).toBe('POST');
      const body = JSON.parse(callOptions.body as string);
      expect(body.processDefinitionKey).toBe('myProcess');
      expect(body.unfinished).toBe(true);
    });
  });

  describe('createHistoryService', () => {
    it('should create a new HistoryService instance', () => {
      const newService = createHistoryService(mockApi);
      expect(newService).toBeInstanceOf(HistoryService);
    });
  });
});
