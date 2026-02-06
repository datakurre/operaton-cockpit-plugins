/**
 * Tests for useFilterState hook.
 *
 * Tests filter state management and query parameter building.
 *
 * @module
 */
import { renderHook, act } from '@testing-library/react';
import { useFilterState, buildQueryParams } from '../useFilterState';
import type { LegacyExpression } from '../../utils/filterSchema';

describe('useFilterState', () => {
  describe('initial state', () => {
    it('should initialize with empty expressions', () => {
      const { result } = renderHook(() => useFilterState());

      expect(result.current.state.expressions).toEqual([]);
      expect(result.current.state.hasActiveFilters).toBe(false);
      expect(result.current.state.filterCount).toBe(0);
    });

    it('should initialize with initial expressions', () => {
      const initialExpressions: LegacyExpression[] = [{ category: 'activityId', operator: '==', value: 'Task_1' }];

      const { result } = renderHook(() => useFilterState({ initialExpressions }));

      expect(result.current.state.expressions).toEqual(initialExpressions);
      expect(result.current.state.hasActiveFilters).toBe(true);
      expect(result.current.state.filterCount).toBe(1);
    });
  });

  describe('setExpressions action', () => {
    it('should update expressions', () => {
      const { result } = renderHook(() => useFilterState());

      act(() => {
        result.current.actions.setExpressions([{ category: 'activityId', operator: '==', value: 'Task_1' }]);
      });

      expect(result.current.state.expressions).toHaveLength(1);
      expect(result.current.state.hasActiveFilters).toBe(true);
    });

    it('should call onFilterChange callback', () => {
      const onFilterChange = jest.fn();
      const { result } = renderHook(() => useFilterState({ onFilterChange }));

      const newExpressions: LegacyExpression[] = [{ category: 'activityId', operator: '==', value: 'Task_1' }];

      act(() => {
        result.current.actions.setExpressions(newExpressions);
      });

      expect(onFilterChange).toHaveBeenCalledWith(newExpressions);
    });
  });

  describe('clearFilters action', () => {
    it('should clear all filters', () => {
      const initialExpressions: LegacyExpression[] = [
        { category: 'activityId', operator: '==', value: 'Task_1' },
        { category: 'activityType', operator: '==', value: 'userTask' },
      ];

      const { result } = renderHook(() => useFilterState({ initialExpressions }));

      expect(result.current.state.filterCount).toBe(2);

      act(() => {
        result.current.actions.clearFilters();
      });

      expect(result.current.state.expressions).toEqual([]);
      expect(result.current.state.filterCount).toBe(0);
    });
  });

  describe('addFilter action', () => {
    it('should add a new filter', () => {
      const { result } = renderHook(() => useFilterState());

      act(() => {
        result.current.actions.addFilter('activityId', '==', 'Task_1');
      });

      expect(result.current.state.expressions).toHaveLength(1);
      expect(result.current.state.expressions[0]).toEqual({
        category: 'activityId',
        operator: '==',
        value: 'Task_1',
      });
    });

    it('should append to existing filters', () => {
      const initialExpressions: LegacyExpression[] = [{ category: 'activityId', operator: '==', value: 'Task_1' }];

      const { result } = renderHook(() => useFilterState({ initialExpressions }));

      act(() => {
        result.current.actions.addFilter('activityType', '==', 'userTask');
      });

      expect(result.current.state.expressions).toHaveLength(2);
    });
  });

  describe('removeFiltersByCategory action', () => {
    it('should remove filters by category', () => {
      const initialExpressions: LegacyExpression[] = [
        { category: 'activityId', operator: '==', value: 'Task_1' },
        { category: 'activityType', operator: '==', value: 'userTask' },
        { category: 'activityId', operator: '==', value: 'Task_2' },
      ];

      const { result } = renderHook(() => useFilterState({ initialExpressions }));

      act(() => {
        result.current.actions.removeFiltersByCategory('activityId');
      });

      expect(result.current.state.expressions).toHaveLength(1);
      expect(result.current.state.expressions[0]?.category).toBe('activityType');
    });
  });
});

describe('buildQueryParams', () => {
  describe('date filters', () => {
    it('should build startedAfter from started after expression', () => {
      const expressions: LegacyExpression[] = [{ category: 'started', operator: 'after', value: '2024-01-15' }];

      const params = buildQueryParams(expressions);

      expect(params.startedAfter).toBeDefined();
    });

    it('should build finishedBefore from finished before expression', () => {
      const expressions: LegacyExpression[] = [{ category: 'finished', operator: 'before', value: '2024-12-31' }];

      const params = buildQueryParams(expressions);

      expect(params.finishedBefore).toBeDefined();
    });
  });

  describe('boolean filters', () => {
    it('should build finished flag', () => {
      const expressions: LegacyExpression[] = [{ category: 'finishedOnly', operator: '==', value: 'true' }];

      const params = buildQueryParams(expressions);

      expect(params.finished).toBe(true);
    });

    it('should build unfinished flag', () => {
      const expressions: LegacyExpression[] = [{ category: 'unfinishedOnly', operator: '==', value: 'true' }];

      const params = buildQueryParams(expressions);

      expect(params.unfinished).toBe(true);
    });

    it('should build canceled flag', () => {
      const expressions: LegacyExpression[] = [{ category: 'canceled', operator: '==', value: 'true' }];

      const params = buildQueryParams(expressions);

      expect(params.canceled).toBe(true);
    });

    it('should build withIncidents flag', () => {
      const expressions: LegacyExpression[] = [{ category: 'withIncidents', operator: '==', value: 'true' }];

      const params = buildQueryParams(expressions);

      expect(params.withIncidents).toBe(true);
    });
  });

  describe('string filters', () => {
    it('should build activityId', () => {
      const expressions: LegacyExpression[] = [{ category: 'activityId', operator: '==', value: 'Task_1' }];

      const params = buildQueryParams(expressions);

      expect(params.activityId).toBe('Task_1');
    });

    it('should build activityName for exact match', () => {
      const expressions: LegacyExpression[] = [{ category: 'activityName', operator: '==', value: 'My Task' }];

      const params = buildQueryParams(expressions);

      expect(params.activityName).toBe('My Task');
    });

    it('should build activityNameLike for like operator', () => {
      const expressions: LegacyExpression[] = [{ category: 'activityName', operator: 'like', value: 'Task' }];

      const params = buildQueryParams(expressions);

      expect(params.activityNameLike).toBe('%Task%');
    });

    it('should build activityType', () => {
      const expressions: LegacyExpression[] = [{ category: 'activityType', operator: '==', value: 'userTask' }];

      const params = buildQueryParams(expressions);

      expect(params.activityType).toBe('userTask');
    });

    it('should build processInstanceId', () => {
      const expressions: LegacyExpression[] = [{ category: 'processInstanceId', operator: '==', value: '12345' }];

      const params = buildQueryParams(expressions);

      expect(params.processInstanceId).toBe('12345');
    });

    it('should build processInstanceBusinessKey', () => {
      const expressions: LegacyExpression[] = [{ category: 'key', operator: '==', value: 'ORDER-123' }];

      const params = buildQueryParams(expressions);

      expect(params.processInstanceBusinessKey).toBe('ORDER-123');
    });

    it('should build processInstanceBusinessKeyLike', () => {
      const expressions: LegacyExpression[] = [{ category: 'key', operator: 'like', value: 'ORDER' }];

      const params = buildQueryParams(expressions);

      expect(params.processInstanceBusinessKeyLike).toBe('%ORDER%');
    });

    it('should build state', () => {
      const expressions: LegacyExpression[] = [{ category: 'state', operator: '==', value: 'ACTIVE' }];

      const params = buildQueryParams(expressions);

      expect(params.state).toBe('ACTIVE');
    });

    it('should build incidentType', () => {
      const expressions: LegacyExpression[] = [{ category: 'incidentType', operator: '==', value: 'failedJob' }];

      const params = buildQueryParams(expressions);

      expect(params.incidentType).toBe('failedJob');
    });

    it('should build startedBy', () => {
      const expressions: LegacyExpression[] = [{ category: 'startedBy', operator: '==', value: 'admin' }];

      const params = buildQueryParams(expressions);

      expect(params.startedBy).toBe('admin');
    });
  });

  describe('number filters', () => {
    it('should build maxResults', () => {
      const expressions: LegacyExpression[] = [{ category: 'maxResults', operator: '==', value: '100' }];

      const params = buildQueryParams(expressions);

      expect(params.maxResults).toBe(100);
    });
  });

  describe('array filters', () => {
    it('should build tenantIdIn as array', () => {
      const expressions: LegacyExpression[] = [
        { category: 'tenantIdIn', operator: '==', value: 'tenant1' },
        { category: 'tenantIdIn', operator: '==', value: 'tenant2' },
      ];

      const params = buildQueryParams(expressions);

      expect(params.tenantIdIn).toEqual(['tenant1', 'tenant2']);
    });

    it('should build executedActivityIdIn as array', () => {
      const expressions: LegacyExpression[] = [
        { category: 'executedActivityIdIn', operator: '==', value: 'Task_1' },
        { category: 'executedActivityIdIn', operator: '==', value: 'Task_2' },
      ];

      const params = buildQueryParams(expressions);

      expect(params.executedActivityIdIn).toEqual(['Task_1', 'Task_2']);
    });

    it('should build activeActivityIdIn as array', () => {
      const expressions: LegacyExpression[] = [{ category: 'activeActivityIdIn', operator: '==', value: 'Task_1' }];

      const params = buildQueryParams(expressions);

      expect(params.activeActivityIdIn).toEqual(['Task_1']);
    });
  });

  describe('variable filters', () => {
    it('should parse variable expression with colon separator', () => {
      const expressions: LegacyExpression[] = [{ category: 'variable', operator: '==', value: 'myVar:myValue' }];

      const params = buildQueryParams(expressions);

      expect(params.variables).toEqual([{ name: 'myVar', value: 'myValue', operator: '==' }]);
    });

    it('should handle multiple variable filters', () => {
      const expressions: LegacyExpression[] = [
        { category: 'variable', operator: '==', value: 'var1:value1' },
        { category: 'variable', operator: 'like', value: 'var2:value2' },
      ];

      const params = buildQueryParams(expressions);

      expect(params.variables).toHaveLength(2);
    });
  });

  describe('combined filters', () => {
    it('should build params from multiple expressions', () => {
      const expressions: LegacyExpression[] = [
        { category: 'started', operator: 'after', value: '2024-01-01' },
        { category: 'activityType', operator: '==', value: 'userTask' },
        { category: 'maxResults', operator: '==', value: '50' },
      ];

      const params = buildQueryParams(expressions);

      expect(params.startedAfter).toBeDefined();
      expect(params.activityType).toBe('userTask');
      expect(params.maxResults).toBe(50);
    });

    it('should return empty object for empty expressions', () => {
      const params = buildQueryParams([]);

      expect(params).toEqual({});
    });

    it('should skip unknown categories', () => {
      const expressions: LegacyExpression[] = [{ category: 'unknownCategory', operator: '==', value: 'value' }];

      const params = buildQueryParams(expressions);

      expect(Object.keys(params)).toHaveLength(0);
    });
  });
});
