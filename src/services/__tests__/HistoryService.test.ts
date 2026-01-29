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

  describe('createHistoryService', () => {
    it('should create a new HistoryService instance', () => {
      const newService = createHistoryService(mockApi);
      expect(newService).toBeInstanceOf(HistoryService);
    });
  });
});
