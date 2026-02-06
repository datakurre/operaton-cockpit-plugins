/**
 * Tests for filter expression parsers.
 * @module
 */

import {
  parseActivityInstanceExpressions,
  parseProcessInstanceExpressions,
  parseAuthorizationExpressions,
  activityInstanceQueryToRecord,
  getDefaultActivityInstanceQuery,
  validateFilterConflicts,
  ACTIVITY_FILTER_CONFLICTS,
  PROCESS_FILTER_CONFLICTS,
} from '../filterExpressionParsers';
import type { LegacyExpression } from '../filterSchema';

describe('parseActivityInstanceExpressions', () => {
  const DEFAULT_MAX_RESULTS = 1000;

  it('should return default query for empty expressions', () => {
    const result = parseActivityInstanceExpressions([], DEFAULT_MAX_RESULTS);

    expect(result).toEqual({
      sortBy: 'endTime',
      sortOrder: 'desc',
      maxResults: '1000',
    });
  });

  it('should parse started after expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'started', operator: 'after', value: '2024-01-15' }];

    const result = parseActivityInstanceExpressions(expressions, DEFAULT_MAX_RESULTS);

    expect(result.startedAfter).toBe('2024-01-15T00:00:00.000+0000');
  });

  it('should parse finished before expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'finished', operator: 'before', value: '2024-01-20' }];

    const result = parseActivityInstanceExpressions(expressions, DEFAULT_MAX_RESULTS);

    expect(result.finishedBefore).toBe('2024-01-20T00:00:00.000+0000');
  });

  it('should parse maxResults expression with is operator', () => {
    const expressions: LegacyExpression[] = [{ category: 'maxResults', operator: 'is', value: '500' }];

    const result = parseActivityInstanceExpressions(expressions, DEFAULT_MAX_RESULTS);

    expect(result.maxResults).toBe('500');
  });

  it('should parse maxResults expression with == operator', () => {
    const expressions: LegacyExpression[] = [{ category: 'maxResults', operator: '==', value: '250' }];

    const result = parseActivityInstanceExpressions(expressions, DEFAULT_MAX_RESULTS);

    expect(result.maxResults).toBe('250');
  });

  it('should parse version expression with is operator', () => {
    const expressions: LegacyExpression[] = [{ category: 'version', operator: 'is', value: '3' }];

    const result = parseActivityInstanceExpressions(expressions, DEFAULT_MAX_RESULTS);

    expect(result.processDefinitionVersion).toBe('3');
  });

  it('should parse version expression with == operator', () => {
    const expressions: LegacyExpression[] = [{ category: 'version', operator: '==', value: '5' }];

    const result = parseActivityInstanceExpressions(expressions, DEFAULT_MAX_RESULTS);

    expect(result.processDefinitionVersion).toBe('5');
  });

  it('should ignore invalid version', () => {
    const expressions: LegacyExpression[] = [{ category: 'version', operator: '==', value: 'invalid' }];

    const result = parseActivityInstanceExpressions(expressions, DEFAULT_MAX_RESULTS);

    expect(result.processDefinitionVersion).toBeUndefined();
  });

  it('should ignore invalid maxResults', () => {
    const expressions: LegacyExpression[] = [{ category: 'maxResults', operator: 'is', value: 'invalid' }];

    const result = parseActivityInstanceExpressions(expressions, DEFAULT_MAX_RESULTS);

    expect(result.maxResults).toBe('1000');
  });

  it('should ignore invalid dates', () => {
    const expressions: LegacyExpression[] = [{ category: 'started', operator: 'after', value: 'not-a-date' }];

    const result = parseActivityInstanceExpressions(expressions, DEFAULT_MAX_RESULTS);

    expect(result.startedAfter).toBeUndefined();
  });

  it('should parse activityId expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'activityId', operator: '==', value: 'Task_1' }];

    const result = parseActivityInstanceExpressions(expressions, DEFAULT_MAX_RESULTS);

    expect(result.activityId).toBe('Task_1');
  });

  it('should parse activityName with equals operator', () => {
    const expressions: LegacyExpression[] = [{ category: 'activityName', operator: '==', value: 'Review Application' }];

    const result = parseActivityInstanceExpressions(expressions, DEFAULT_MAX_RESULTS);

    expect(result.activityName).toBe('Review Application');
  });

  it('should parse activityName with like operator', () => {
    const expressions: LegacyExpression[] = [{ category: 'activityName', operator: 'like', value: 'Review' }];

    const result = parseActivityInstanceExpressions(expressions, DEFAULT_MAX_RESULTS);

    expect(result.activityNameLike).toBe('%Review%');
  });

  it('should parse activityType expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'activityType', operator: '==', value: 'userTask' }];

    const result = parseActivityInstanceExpressions(expressions, DEFAULT_MAX_RESULTS);

    expect(result.activityType).toBe('userTask');
  });

  it('should parse taskAssignee with equals operator', () => {
    const expressions: LegacyExpression[] = [{ category: 'taskAssignee', operator: '==', value: 'john.doe' }];

    const result = parseActivityInstanceExpressions(expressions, DEFAULT_MAX_RESULTS);

    expect(result.taskAssignee).toBe('john.doe');
  });

  it('should parse taskAssignee with like operator', () => {
    const expressions: LegacyExpression[] = [{ category: 'taskAssignee', operator: 'like', value: 'john' }];

    const result = parseActivityInstanceExpressions(expressions, DEFAULT_MAX_RESULTS);

    expect(result.taskAssigneeLike).toBe('%john%');
  });

  it('should parse finished boolean expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'finishedOnly', operator: '==', value: 'true' }];

    const result = parseActivityInstanceExpressions(expressions, DEFAULT_MAX_RESULTS);

    expect(result.finished).toBe(true);
  });

  it('should parse unfinished boolean expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'unfinishedOnly', operator: '==', value: 'true' }];

    const result = parseActivityInstanceExpressions(expressions, DEFAULT_MAX_RESULTS);

    expect(result.unfinished).toBe(true);
  });

  it('should parse canceled boolean expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'canceled', operator: '==', value: 'true' }];

    const result = parseActivityInstanceExpressions(expressions, DEFAULT_MAX_RESULTS);

    expect(result.canceled).toBe(true);
  });

  it('should parse tenantIdIn expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'tenantIdIn', operator: '==', value: 'tenant1' }];

    const result = parseActivityInstanceExpressions(expressions, DEFAULT_MAX_RESULTS);

    expect(result.tenantIdIn).toBe('tenant1');
  });

  it('should parse activityInstanceId expression', () => {
    const expressions: LegacyExpression[] = [
      { category: 'activityInstanceId', operator: '==', value: 'Task_1:abc123' },
    ];

    const result = parseActivityInstanceExpressions(expressions, DEFAULT_MAX_RESULTS);

    expect(result.activityInstanceId).toBe('Task_1:abc123');
  });

  it('should parse processInstanceId expression', () => {
    const expressions: LegacyExpression[] = [
      { category: 'processInstanceId', operator: '==', value: 'instance-xyz-789' },
    ];

    const result = parseActivityInstanceExpressions(expressions, DEFAULT_MAX_RESULTS);

    expect(result.processInstanceId).toBe('instance-xyz-789');
  });

  it('should parse executionId expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'executionId', operator: '==', value: 'exec-123' }];

    const result = parseActivityInstanceExpressions(expressions, DEFAULT_MAX_RESULTS);

    expect(result.executionId).toBe('exec-123');
  });

  it('should parse started before date expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'started', operator: 'before', value: '2024-02-15' }];

    const result = parseActivityInstanceExpressions(expressions, DEFAULT_MAX_RESULTS);

    expect(result.startedBefore).toBe('2024-02-15T00:00:00.000+0000');
  });

  it('should parse finished after date expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'finished', operator: 'after', value: '2024-02-20' }];

    const result = parseActivityInstanceExpressions(expressions, DEFAULT_MAX_RESULTS);

    expect(result.finishedAfter).toBe('2024-02-20T00:00:00.000+0000');
  });

  it('should parse completeScope boolean expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'completeScope', operator: '==', value: 'true' }];

    const result = parseActivityInstanceExpressions(expressions, DEFAULT_MAX_RESULTS);

    expect(result.completeScope).toBe(true);
  });

  it('should parse withoutTenantId boolean expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'withoutTenantId', operator: '==', value: 'true' }];

    const result = parseActivityInstanceExpressions(expressions, DEFAULT_MAX_RESULTS);

    expect(result.withoutTenantId).toBe(true);
  });

  it('should parse processDefinitionId expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'processDefinitionId', operator: '==', value: 'process-def-123' }];

    const result = parseActivityInstanceExpressions(expressions, DEFAULT_MAX_RESULTS);

    expect(result.processDefinitionId).toBe('process-def-123');
  });

  it('should parse multiple expressions together', () => {
    const expressions: LegacyExpression[] = [
      { category: 'started', operator: 'after', value: '2024-01-01' },
      { category: 'finished', operator: 'before', value: '2024-01-31' },
      { category: 'activityType', operator: '==', value: 'serviceTask' },
      { category: 'maxResults', operator: 'is', value: '100' },
    ];

    const result = parseActivityInstanceExpressions(expressions, DEFAULT_MAX_RESULTS);

    expect(result).toEqual({
      sortBy: 'endTime',
      sortOrder: 'desc',
      startedAfter: '2024-01-01T00:00:00.000+0000',
      finishedBefore: '2024-01-31T00:00:00.000+0000',
      activityType: 'serviceTask',
      maxResults: '100',
    });
  });
});

describe('parseProcessInstanceExpressions', () => {
  it('should return empty query for empty expressions', () => {
    const result = parseProcessInstanceExpressions([]);

    expect(result).toEqual({});
  });

  it('should parse started after expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'started', operator: 'after', value: '2024-03-01' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.startedAfter).toBe('2024-03-01T00:00:00.000+0000');
  });

  it('should parse finished before expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'finished', operator: 'before', value: '2024-03-15' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.finishedBefore).toBe('2024-03-15T00:00:00.000+0000');
  });

  it('should parse key with equals operator', () => {
    const expressions: LegacyExpression[] = [{ category: 'key', operator: '==', value: 'ORDER-12345' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.processInstanceBusinessKey).toBe('ORDER-12345');
  });

  it('should parse key with like operator', () => {
    const expressions: LegacyExpression[] = [{ category: 'key', operator: 'like', value: 'ORDER%' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.processInstanceBusinessKeyLike).toBe('ORDER%');
  });

  it('should parse variable filter', () => {
    const expressions: LegacyExpression[] = [{ category: 'variable', operator: '==', value: 'orderId:12345' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.variables).toEqual([{ name: 'orderId', operator: 'eq', value: '12345' }]);
  });

  it('should parse variable with like operator', () => {
    const expressions: LegacyExpression[] = [{ category: 'variable', operator: 'like', value: 'customerName:John' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.variables).toEqual([{ name: 'customerName', operator: 'like', value: 'John' }]);
  });

  it('should parse variable with ilike operator and set case insensitive flags', () => {
    const expressions: LegacyExpression[] = [{ category: 'variable', operator: 'ilike', value: 'status:pending' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.variables).toEqual([{ name: 'status', operator: 'like', value: 'pending' }]);
    expect(result.variableNamesIgnoreCase).toBe(true);
    expect(result.variableValuesIgnoreCase).toBe(true);
  });

  it('should ignore invalid variable format without colon', () => {
    const expressions: LegacyExpression[] = [{ category: 'variable', operator: '==', value: 'invalidformat' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.variables).toBeUndefined();
  });

  it('should parse version any operator', () => {
    const expressions: LegacyExpression[] = [{ category: 'version', operator: 'any', value: '' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.useAllVersions).toBe(true);
    expect(result.versionFilter).toBeUndefined();
  });

  it('should parse version equals operator', () => {
    const expressions: LegacyExpression[] = [{ category: 'version', operator: '==', value: '3' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.useAllVersions).toBe(true);
    expect(result.versionFilter).toEqual({ operator: 'eq', value: 3 });
  });

  it('should parse version less than operator', () => {
    const expressions: LegacyExpression[] = [{ category: 'version', operator: '<', value: '5' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.versionFilter).toEqual({ operator: 'lt', value: 5 });
  });

  it('should parse version greater than operator', () => {
    const expressions: LegacyExpression[] = [{ category: 'version', operator: '>', value: '2' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.versionFilter).toEqual({ operator: 'gt', value: 2 });
  });

  it('should parse version less than or equal operator', () => {
    const expressions: LegacyExpression[] = [{ category: 'version', operator: '<=', value: '4' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.versionFilter).toEqual({ operator: 'lte', value: 4 });
  });

  it('should parse version greater than or equal operator', () => {
    const expressions: LegacyExpression[] = [{ category: 'version', operator: '>=', value: '1' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.versionFilter).toEqual({ operator: 'gte', value: 1 });
  });

  it('should parse processInstanceId expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'processInstanceId', operator: '==', value: 'abc-123-def' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.processInstanceId).toBe('abc-123-def');
  });

  it('should parse finished boolean expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'finishedOnly', operator: '==', value: 'true' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.finished).toBe(true);
  });

  it('should parse unfinished boolean expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'unfinishedOnly', operator: '==', value: 'true' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.unfinished).toBe(true);
  });

  it('should parse withIncidents boolean expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'withIncidents', operator: '==', value: 'true' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.withIncidents).toBe(true);
  });

  it('should parse incidentType expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'incidentType', operator: '==', value: 'failedJob' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.incidentType).toBe('failedJob');
  });

  it('should parse incidentStatus expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'incidentStatus', operator: '==', value: 'open' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.incidentStatus).toBe('open');
  });

  it('should parse startedBy expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'startedBy', operator: '==', value: 'admin' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.startedBy).toBe('admin');
  });

  it('should parse tenantIdIn expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'tenantIdIn', operator: '==', value: 'tenant-a' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.tenantIdIn).toBe('tenant-a');
  });

  it('should parse state expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'state', operator: '==', value: 'ACTIVE' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.state).toBe('ACTIVE');
  });

  it('should parse executedActivityIdIn expression', () => {
    const expressions: LegacyExpression[] = [
      { category: 'executedActivityIdIn', operator: '==', value: 'Task_1,Task_2' },
    ];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.executedActivityIdIn).toBe('Task_1,Task_2');
  });

  it('should parse activeActivityIdIn expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'activeActivityIdIn', operator: '==', value: 'Task_3' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.activeActivityIdIn).toBe('Task_3');
  });

  // New filter field tests
  it('should parse started before date expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'started', operator: 'before', value: '2024-02-15' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.startedBefore).toBe('2024-02-15T00:00:00.000+0000');
  });

  it('should parse finished after date expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'finished', operator: 'after', value: '2024-02-20' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.finishedAfter).toBe('2024-02-20T00:00:00.000+0000');
  });

  it('should parse executedActivity after date expression', () => {
    const expressions: LegacyExpression[] = [
      { category: 'executedActivity', operator: 'after', value: '2024-03-01' },
    ];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.executedActivityAfter).toBe('2024-03-01T00:00:00.000+0000');
  });

  it('should parse executedActivity before date expression', () => {
    const expressions: LegacyExpression[] = [
      { category: 'executedActivity', operator: 'before', value: '2024-03-15' },
    ];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.executedActivityBefore).toBe('2024-03-15T00:00:00.000+0000');
  });

  it('should parse executedJob after date expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'executedJob', operator: 'after', value: '2024-04-01' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.executedJobAfter).toBe('2024-04-01T00:00:00.000+0000');
  });

  it('should parse executedJob before date expression', () => {
    const expressions: LegacyExpression[] = [
      { category: 'executedJob', operator: 'before', value: '2024-04-15' },
    ];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.executedJobBefore).toBe('2024-04-15T00:00:00.000+0000');
  });

  it('should parse processInstanceIds expression', () => {
    const expressions: LegacyExpression[] = [
      { category: 'processInstanceIds', operator: '==', value: 'id1,id2,id3' },
    ];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.processInstanceIds).toBe('id1,id2,id3');
  });

  it('should parse processInstanceBusinessKeyIn expression', () => {
    const expressions: LegacyExpression[] = [
      { category: 'processInstanceBusinessKeyIn', operator: '==', value: 'KEY1,KEY2' },
    ];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.processInstanceBusinessKeyIn).toBe('KEY1,KEY2');
  });

  it('should parse processDefinitionKey with equals operator', () => {
    const expressions: LegacyExpression[] = [
      { category: 'processDefinitionKey', operator: '==', value: 'invoice-process' },
    ];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.processDefinitionKey).toBe('invoice-process');
  });

  it('should parse processDefinitionKey with like operator', () => {
    const expressions: LegacyExpression[] = [
      { category: 'processDefinitionKey', operator: 'like', value: 'invoice' },
    ];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.processDefinitionKeyLike).toBe('%invoice%');
  });

  it('should parse processDefinitionKeyIn expression', () => {
    const expressions: LegacyExpression[] = [
      { category: 'processDefinitionKeyIn', operator: '==', value: 'key1,key2,key3' },
    ];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.processDefinitionKeyIn).toBe('key1,key2,key3');
  });

  it('should parse processDefinitionId expression', () => {
    const expressions: LegacyExpression[] = [
      { category: 'processDefinitionId', operator: '==', value: 'invoice-process:1:def-123' },
    ];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.processDefinitionId).toBe('invoice-process:1:def-123');
  });

  it('should treat unknown field as freeform variable (e.g., activityIdIn)', () => {
    // activityIdIn is not a valid historic process instance field,
    // so it should be treated as a variable name
    const expressions: LegacyExpression[] = [
      { category: 'activityIdIn', operator: '==', value: 'activity1,activity2' },
    ];

    const result = parseProcessInstanceExpressions(expressions);

    // Should be treated as a variable, not a known field
    expect(result.activityIdIn).toBeUndefined();
    expect(result.variables).toEqual([
      { name: 'activityIdIn', operator: 'eq', value: 'activity1,activity2' },
    ]);
  });

  it('should parse withJobsRetrying boolean expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'withJobsRetrying', operator: '==', value: 'true' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.withJobsRetrying).toBe(true);
  });

  it('should parse incidentIdIn expression', () => {
    const expressions: LegacyExpression[] = [
      { category: 'incidentIdIn', operator: '==', value: 'incident-1,incident-2' },
    ];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.incidentIdIn).toBe('incident-1,incident-2');
  });

  it('should parse rootProcessInstances boolean expression', () => {
    const expressions: LegacyExpression[] = [
      { category: 'processDefinitionName', operator: '==', value: 'My Process' },
    ];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.processDefinitionName).toBe('My Process');
  });

  it('should parse processDefinitionName with like operator', () => {
    const expressions: LegacyExpression[] = [
      { category: 'processDefinitionName', operator: 'like', value: 'Invoice' },
    ];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.processDefinitionNameLike).toBe('%Invoice%');
  });

  it('should parse rootProcessInstances boolean expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'rootProcessInstances', operator: '==', value: 'true' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.rootProcessInstances).toBe(true);
  });

  it('should parse superProcessInstanceId expression', () => {
    const expressions: LegacyExpression[] = [
      { category: 'superProcessInstanceId', operator: '==', value: 'parent-123' },
    ];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.superProcessInstanceId).toBe('parent-123');
  });

  it('should parse subProcessInstanceId expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'subProcessInstanceId', operator: '==', value: 'sub-456' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.subProcessInstanceId).toBe('sub-456');
  });

  it('should parse active boolean expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'active', operator: '==', value: 'true' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.active).toBe(true);
  });

  it('should parse suspended boolean expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'suspended', operator: '==', value: 'true' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.suspended).toBe(true);
  });

  it('should parse completed boolean expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'completed', operator: '==', value: 'true' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.completed).toBe(true);
  });

  it('should parse withRootIncidents boolean expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'withRootIncidents', operator: '==', value: 'true' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.withRootIncidents).toBe(true);
  });

  it('should parse incidentMessage with equals operator', () => {
    const expressions: LegacyExpression[] = [
      { category: 'incidentMessage', operator: '==', value: 'Connection timeout' },
    ];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.incidentMessage).toBe('Connection timeout');
  });

  it('should parse incidentMessage with like operator', () => {
    const expressions: LegacyExpression[] = [{ category: 'incidentMessage', operator: 'like', value: 'timeout' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.incidentMessageLike).toBe('%timeout%');
  });

  it('should parse withoutTenantId boolean expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'withoutTenantId', operator: '==', value: 'true' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.withoutTenantId).toBe(true);
  });

  it('should parse multiple expressions together', () => {
    const expressions: LegacyExpression[] = [
      { category: 'started', operator: 'after', value: '2024-01-01' },
      { category: 'key', operator: 'like', value: 'INVOICE%' },
      { category: 'state', operator: '==', value: 'COMPLETED' },
      { category: 'variable', operator: '==', value: 'amount:1000' },
    ];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result).toEqual({
      startedAfter: '2024-01-01T00:00:00.000+0000',
      processInstanceBusinessKeyLike: 'INVOICE%',
      state: 'COMPLETED',
      variables: [{ name: 'amount', operator: 'eq', value: '1000' }],
    });
  });

  it('should handle multiple variable expressions', () => {
    const expressions: LegacyExpression[] = [
      { category: 'variable', operator: '==', value: 'var1:value1' },
      { category: 'variable', operator: 'like', value: 'var2:value2' },
    ];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.variables).toEqual([
      { name: 'var1', operator: 'eq', value: 'value1' },
      { name: 'var2', operator: 'like', value: 'value2' },
    ]);
  });

  // Freeform variable field tests
  it('should parse freeform variable field with equals operator', () => {
    const expressions: LegacyExpression[] = [{ category: 'orderId', operator: '==', value: '12345' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.variables).toEqual([{ name: 'orderId', operator: 'eq', value: '12345' }]);
  });

  it('should parse freeform variable field with like operator', () => {
    const expressions: LegacyExpression[] = [{ category: 'customerName', operator: 'like', value: 'John' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.variables).toEqual([{ name: 'customerName', operator: 'like', value: 'John' }]);
  });

  it('should parse freeform variable field with ilike operator and set case insensitive flags', () => {
    const expressions: LegacyExpression[] = [{ category: 'status', operator: 'ilike', value: 'pending' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.variables).toEqual([{ name: 'status', operator: 'like', value: 'pending' }]);
    expect(result.variableNamesIgnoreCase).toBe(true);
    expect(result.variableValuesIgnoreCase).toBe(true);
  });

  it('should parse multiple freeform variable fields', () => {
    const expressions: LegacyExpression[] = [
      { category: 'orderId', operator: '==', value: '12345' },
      { category: 'customerId', operator: '==', value: '67890' },
      { category: 'status', operator: 'like', value: 'active' },
    ];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.variables).toEqual([
      { name: 'orderId', operator: 'eq', value: '12345' },
      { name: 'customerId', operator: 'eq', value: '67890' },
      { name: 'status', operator: 'like', value: 'active' },
    ]);
  });

  it('should parse mix of legacy variable syntax and freeform fields', () => {
    const expressions: LegacyExpression[] = [
      { category: 'variable', operator: '==', value: 'oldStyle:value1' },
      { category: 'newStyleVar', operator: '==', value: 'value2' },
    ];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.variables).toEqual([
      { name: 'oldStyle', operator: 'eq', value: 'value1' },
      { name: 'newStyleVar', operator: 'eq', value: 'value2' },
    ]);
  });

  it('should not treat known fields as freeform variables', () => {
    const expressions: LegacyExpression[] = [
      { category: 'processInstanceId', operator: '==', value: 'abc-123' },
      { category: 'customVar', operator: '==', value: 'value' },
    ];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.processInstanceId).toBe('abc-123');
    expect(result.variables).toEqual([{ name: 'customVar', operator: 'eq', value: 'value' }]);
  });

  it('should parse freeform variable with underscore in name', () => {
    const expressions: LegacyExpression[] = [{ category: '_my_var_name', operator: '==', value: 'test' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.variables).toEqual([{ name: '_my_var_name', operator: 'eq', value: 'test' }]);
  });
});

describe('parseAuthorizationExpressions', () => {
  it('should return empty params for empty expressions', () => {
    const result = parseAuthorizationExpressions([]);

    expect(result).toEqual({});
  });

  it('should parse id expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'id', operator: '==', value: 'auth-123' }];

    const result = parseAuthorizationExpressions(expressions);

    expect(result.id).toBe('auth-123');
  });

  it('should parse userIdIn expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'userIdIn', operator: '==', value: 'john,jane' }];

    const result = parseAuthorizationExpressions(expressions);

    expect(result.userIdIn).toBe('john,jane');
  });

  it('should parse groupIdIn expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'groupIdIn', operator: '==', value: 'admins,developers' }];

    const result = parseAuthorizationExpressions(expressions);

    expect(result.groupIdIn).toBe('admins,developers');
  });

  it('should parse resourceId expression', () => {
    const expressions: LegacyExpression[] = [
      { category: 'resourceId', operator: '==', value: 'process-definition-123' },
    ];

    const result = parseAuthorizationExpressions(expressions);

    expect(result.resourceId).toBe('process-definition-123');
  });

  it('should parse resourceType expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'resourceType', operator: '==', value: '6' }];

    const result = parseAuthorizationExpressions(expressions);

    expect(result.resourceType).toBe('6');
  });

  it('should parse type expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'type', operator: '==', value: '1' }];

    const result = parseAuthorizationExpressions(expressions);

    expect(result.type).toBe('1');
  });

  it('should ignore invalid category', () => {
    const expressions: LegacyExpression[] = [{ category: 'invalidCategory', operator: '==', value: 'value' }];

    const result = parseAuthorizationExpressions(expressions);

    expect(result).toEqual({});
  });

  it('should ignore empty value', () => {
    const expressions: LegacyExpression[] = [{ category: 'id', operator: '==', value: '' }];

    const result = parseAuthorizationExpressions(expressions);

    expect(result).toEqual({});
  });

  it('should parse multiple expressions together', () => {
    const expressions: LegacyExpression[] = [
      { category: 'userIdIn', operator: '==', value: 'admin' },
      { category: 'type', operator: '==', value: '1' },
      { category: 'resourceId', operator: '==', value: '*' },
    ];

    const result = parseAuthorizationExpressions(expressions);

    expect(result).toEqual({
      userIdIn: 'admin',
      type: '1',
      resourceId: '*',
    });
  });
});

describe('parseProcessInstanceExpressions - Phase 7 fields', () => {
  it('should parse externallyTerminated boolean expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'externallyTerminated', operator: '==', value: 'true' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.externallyTerminated).toBe(true);
  });

  it('should parse internallyTerminated boolean expression', () => {
    const expressions: LegacyExpression[] = [{ category: 'internallyTerminated', operator: '==', value: 'true' }];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.internallyTerminated).toBe(true);
  });

  it('should parse rootProcessInstanceId expression', () => {
    const expressions: LegacyExpression[] = [
      { category: 'rootProcessInstanceId', operator: '==', value: 'root-123-abc' },
    ];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.rootProcessInstanceId).toBe('root-123-abc');
  });

  it('should parse processInstanceIdNotIn expression', () => {
    const expressions: LegacyExpression[] = [
      { category: 'processInstanceIdNotIn', operator: '==', value: 'exclude-1,exclude-2,exclude-3' },
    ];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.processInstanceIdNotIn).toBe('exclude-1,exclude-2,exclude-3');
  });

  it('should parse processDefinitionKeyNotIn expression', () => {
    const expressions: LegacyExpression[] = [
      { category: 'processDefinitionKeyNotIn', operator: '==', value: 'old-process,deprecated-process' },
    ];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.processDefinitionKeyNotIn).toBe('old-process,deprecated-process');
  });

  it('should handle all Phase 7 fields together', () => {
    const expressions: LegacyExpression[] = [
      { category: 'rootProcessInstanceId', operator: '==', value: 'root-123' },
      { category: 'externallyTerminated', operator: '==', value: 'true' },
      { category: 'internallyTerminated', operator: '==', value: 'false' },
      { category: 'processInstanceIdNotIn', operator: '==', value: 'exclude-1,exclude-2' },
      { category: 'processDefinitionKeyNotIn', operator: '==', value: 'old-key' },
    ];

    const result = parseProcessInstanceExpressions(expressions);

    expect(result.rootProcessInstanceId).toBe('root-123');
    expect(result.externallyTerminated).toBe(true);
    // Note: false boolean values are not included in query params
    expect(result.processInstanceIdNotIn).toBe('exclude-1,exclude-2');
    expect(result.processDefinitionKeyNotIn).toBe('old-key');
  });
});

describe('activityInstanceQueryToRecord', () => {
  it('should convert params to record', () => {
    const params = {
      sortBy: 'endTime',
      sortOrder: 'desc',
      maxResults: '1000',
      startedAfter: '2024-01-01T00:00:00.000+0000',
    };

    const result = activityInstanceQueryToRecord(params);

    expect(result).toEqual({
      sortBy: 'endTime',
      sortOrder: 'desc',
      maxResults: '1000',
      startedAfter: '2024-01-01T00:00:00.000+0000',
    });
  });

  it('should convert boolean values to strings', () => {
    const params = {
      sortBy: 'endTime',
      sortOrder: 'desc',
      maxResults: '1000',
      finished: true,
      canceled: false,
    };

    const result = activityInstanceQueryToRecord(params);

    expect(result.finished).toBe('true');
    expect(result.canceled).toBe('false');
  });

  it('should filter out undefined values', () => {
    const params = {
      sortBy: 'endTime',
      sortOrder: 'desc',
      maxResults: '1000',
      activityId: undefined,
    };

    const result = activityInstanceQueryToRecord(params);

    expect(result).not.toHaveProperty('activityId');
  });
});

describe('getDefaultActivityInstanceQuery', () => {
  it('should return default query with date range', () => {
    const result = getDefaultActivityInstanceQuery(1000);

    expect(result).toHaveProperty('sortBy', 'endTime');
    expect(result).toHaveProperty('sortOrder', 'desc');
    expect(result).toHaveProperty('maxResults', '1000');
    expect(result).toHaveProperty('startedAfter');
    expect(result).toHaveProperty('finishedBefore');
    expect(result.startedAfter).toMatch(/T00:00:00\.000\+0000$/);
    expect(result.finishedBefore).toMatch(/T00:00:00\.000\+0000$/);
  });

  it('should use provided maxResults', () => {
    const result = getDefaultActivityInstanceQuery(500);

    expect(result.maxResults).toBe('500');
  });
});
describe('validateFilterConflicts', () => {
  describe('activity instance conflicts', () => {
    it('should detect finished/unfinished conflict', () => {
      const expressions: LegacyExpression[] = [
        { category: 'finishedOnly', operator: '==', value: 'true' },
        { category: 'unfinishedOnly', operator: '==', value: 'true' },
      ];

      const conflicts = validateFilterConflicts(expressions, ACTIVITY_FILTER_CONFLICTS);

      expect(conflicts).toHaveLength(1);
      expect(conflicts[0]?.field1).toBe('finishedOnly');
      expect(conflicts[0]?.field2).toBe('unfinishedOnly');
    });

    it('should detect tenantIdIn/withoutTenantId conflict', () => {
      const expressions: LegacyExpression[] = [
        { category: 'tenantIdIn', operator: '==', value: 'tenant1' },
        { category: 'withoutTenantId', operator: '==', value: 'true' },
      ];

      const conflicts = validateFilterConflicts(expressions, ACTIVITY_FILTER_CONFLICTS);

      expect(conflicts).toHaveLength(1);
      expect(conflicts[0]?.field1).toBe('tenantIdIn');
      expect(conflicts[0]?.field2).toBe('withoutTenantId');
    });

    it('should return empty array when no conflicts', () => {
      const expressions: LegacyExpression[] = [
        { category: 'finishedOnly', operator: '==', value: 'true' },
        { category: 'canceled', operator: '==', value: 'true' },
      ];

      const conflicts = validateFilterConflicts(expressions, ACTIVITY_FILTER_CONFLICTS);

      expect(conflicts).toHaveLength(0);
    });
  });

  describe('process instance conflicts', () => {
    it('should detect active/completed conflict', () => {
      const expressions: LegacyExpression[] = [
        { category: 'active', operator: '==', value: 'true' },
        { category: 'completed', operator: '==', value: 'true' },
      ];

      const conflicts = validateFilterConflicts(expressions, PROCESS_FILTER_CONFLICTS);

      expect(conflicts).toHaveLength(1);
      expect(conflicts[0]?.reason).toContain('mutually exclusive');
    });

    it('should detect multiple conflicts at once', () => {
      const expressions: LegacyExpression[] = [
        { category: 'active', operator: '==', value: 'true' },
        { category: 'suspended', operator: '==', value: 'true' },
        { category: 'completed', operator: '==', value: 'true' },
      ];

      const conflicts = validateFilterConflicts(expressions, PROCESS_FILTER_CONFLICTS);

      // active/completed + suspended/active = 2 conflicts
      expect(conflicts.length).toBeGreaterThanOrEqual(2);
    });

    it('should not flag false values as conflicts', () => {
      const expressions: LegacyExpression[] = [
        { category: 'active', operator: '==', value: 'true' },
        { category: 'completed', operator: '==', value: 'false' },
      ];

      const conflicts = validateFilterConflicts(expressions, PROCESS_FILTER_CONFLICTS);

      // completed=false should not count as active since the filter is checking for value='true'
      expect(conflicts).toHaveLength(0);
    });
  });
});