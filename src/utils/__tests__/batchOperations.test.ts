/**
 * Tests for the batch operation targeting and request builders.
 *
 * These builders back both the dry run preview and the real request, so a test here is a
 * test of what the user is shown *and* of what gets posted.
 *
 * @module
 */
import {
  buildInstanceLookupParams,
  buildInstanceQuery,
  buildMessageRequest,
  buildModificationRequest,
  buildSignalRequest,
  getSelectedInstanceIds,
  type InstanceSelection,
} from '../batchOperations';

const DEFINITION_ID = 'invoice:3:dep-1';

/**
 * Build an instance selection with the given overrides.
 */
function selection(overrides: Partial<InstanceSelection> = {}): InstanceSelection {
  return {
    instanceSelectionMode: 'all',
    specificInstanceIds: '',
    queryActivityId: '',
    queryState: 'active',
    ...overrides,
  };
}

describe('getSelectedInstanceIds', () => {
  it('splits and trims a comma separated list', () => {
    expect(
      getSelectedInstanceIds(selection({ instanceSelectionMode: 'specific', specificInstanceIds: ' a , b ,c ' }))
    ).toEqual(['a', 'b', 'c']);
  });

  it('returns null when the mode is not specific', () => {
    expect(getSelectedInstanceIds(selection({ specificInstanceIds: 'a,b' }))).toBeNull();
  });

  it('returns null when the list is empty', () => {
    expect(
      getSelectedInstanceIds(selection({ instanceSelectionMode: 'specific', specificInstanceIds: ' , ' }))
    ).toBeNull();
  });
});

describe('buildInstanceQuery', () => {
  it('targets the whole definition in "all" mode', () => {
    expect(buildInstanceQuery(selection(), DEFINITION_ID)).toEqual({ processDefinitionId: DEFINITION_ID });
  });

  it('adds activity and state filters in "query" mode', () => {
    expect(
      buildInstanceQuery(
        selection({ instanceSelectionMode: 'query', queryActivityId: 'Task_1', queryState: 'suspended' }),
        DEFINITION_ID
      )
    ).toEqual({ processDefinitionId: DEFINITION_ID, activityIdIn: ['Task_1'], suspended: true });
  });

  it('omits the state filter when any state is allowed', () => {
    const query = buildInstanceQuery(selection({ instanceSelectionMode: 'query', queryState: 'any' }), DEFINITION_ID);
    expect(query).toEqual({ processDefinitionId: DEFINITION_ID });
  });

  it('returns null in "specific" mode', () => {
    expect(buildInstanceQuery(selection({ instanceSelectionMode: 'specific' }), DEFINITION_ID)).toBeNull();
  });
});

describe('buildInstanceLookupParams', () => {
  it('flattens a query into string parameters', () => {
    expect(
      buildInstanceLookupParams(
        selection({ instanceSelectionMode: 'query', queryActivityId: 'Task_1', queryState: 'active' }),
        DEFINITION_ID
      )
    ).toEqual({ processDefinitionId: DEFINITION_ID, activityIdIn: 'Task_1', active: 'true' });
  });

  it('lists ids when selecting specific instances', () => {
    expect(
      buildInstanceLookupParams(
        selection({ instanceSelectionMode: 'specific', specificInstanceIds: 'a,b' }),
        DEFINITION_ID
      )
    ).toEqual({ processInstanceIds: 'a,b' });
  });
});

describe('buildModificationRequest', () => {
  /**
   * Build modification form state with the given overrides.
   */
  function modifyData(overrides: Record<string, unknown> = {}) {
    return {
      ...selection(),
      instructions: [{ type: 'startBeforeActivity' as const, activityId: 'Task_1' }],
      annotation: '',
      skipCustomListeners: false,
      skipIoMappings: false,
      ...overrides,
    };
  }

  it('posts to the async modification endpoint with a query target', () => {
    const request = buildModificationRequest(modifyData(), DEFINITION_ID);
    expect(request).not.toBeNull();
    expect(request?.method).toBe('POST');
    expect(request?.path).toBe('/modification/executeAsync');
    expect(request?.payload['processInstanceQuery']).toEqual({ processDefinitionId: DEFINITION_ID });
    expect(request?.payload['processInstanceIds']).toBeUndefined();
    expect(request?.payload['instructions']).toEqual([{ type: 'startBeforeActivity', activityId: 'Task_1' }]);
  });

  it('prefers explicit ids over a query', () => {
    const request = buildModificationRequest(
      modifyData({ instanceSelectionMode: 'specific', specificInstanceIds: 'pi-1,pi-2' }),
      DEFINITION_ID
    );
    expect(request?.payload['processInstanceIds']).toEqual(['pi-1', 'pi-2']);
    expect(request?.payload['processInstanceQuery']).toBeUndefined();
  });

  it('returns null when nothing is selected', () => {
    expect(
      buildModificationRequest(
        modifyData({ instanceSelectionMode: 'specific', specificInstanceIds: '' }),
        DEFINITION_ID
      )
    ).toBeNull();
  });

  it('drops instructions that name no target', () => {
    const request = buildModificationRequest(
      modifyData({
        instructions: [
          { type: 'startBeforeActivity' as const, activityId: '' },
          { type: 'startTransition' as const, transitionId: 'Flow_1' },
          { type: 'startTransition' as const, transitionId: '' },
        ],
      }),
      DEFINITION_ID
    );
    expect(request?.payload['instructions']).toEqual([{ type: 'startTransition', transitionId: 'Flow_1' }]);
  });

  it('defaults the annotation but keeps a provided one', () => {
    expect(buildModificationRequest(modifyData(), DEFINITION_ID)?.payload['annotation']).toBe(
      'Batch modified via Cockpit plugin'
    );
    expect(
      buildModificationRequest(modifyData({ annotation: 'ticket-42' }), DEFINITION_ID)?.payload['annotation']
    ).toBe('ticket-42');
  });
});

describe('buildMessageRequest', () => {
  /**
   * Build message form state with the given overrides.
   */
  function messageData(overrides: Record<string, unknown> = {}) {
    return {
      ...selection(),
      messageName: 'PaymentReceived',
      isStartEvent: false,
      businessKey: '',
      processVariables: [],
      ...overrides,
    };
  }

  it('correlates asynchronously to the selected instances', () => {
    const request = buildMessageRequest(messageData(), DEFINITION_ID);
    expect(request?.path).toBe('/process-instance/message-async');
    expect(request?.payload).toEqual({
      messageName: 'PaymentReceived',
      processInstanceQuery: { processDefinitionId: DEFINITION_ID },
    });
  });

  it('narrows correlation to specific instances', () => {
    const request = buildMessageRequest(
      messageData({ instanceSelectionMode: 'specific', specificInstanceIds: 'pi-1' }),
      DEFINITION_ID
    );
    expect(request?.payload['processInstanceIds']).toEqual(['pi-1']);
    expect(request?.payload['processInstanceQuery']).toBeUndefined();
  });

  it('starts a new instance with a business key for a start message', () => {
    const request = buildMessageRequest(messageData({ isStartEvent: true, businessKey: 'order-7' }), DEFINITION_ID);
    expect(request?.path).toBe('/message');
    expect(request?.payload).toEqual({ messageName: 'PaymentReceived', businessKey: 'order-7' });
    // A start message creates an instance; it must not carry an instance target.
    expect(request?.payload['processInstanceQuery']).toBeUndefined();
    expect(request?.payload['processInstanceIds']).toBeUndefined();
  });

  it('omits an empty business key rather than sending one', () => {
    const request = buildMessageRequest(messageData({ isStartEvent: true, businessKey: '' }), DEFINITION_ID);
    expect(request?.payload).toEqual({ messageName: 'PaymentReceived' });
  });

  it('uses processVariables when starting and variables when correlating', () => {
    const variables = [{ name: 'amount', value: '10', type: 'Integer' }];
    expect(
      buildMessageRequest(messageData({ isStartEvent: true, processVariables: variables }), DEFINITION_ID)?.payload[
        'processVariables'
      ]
    ).toEqual({ amount: { value: 10, type: 'Integer' } });
    expect(
      buildMessageRequest(messageData({ processVariables: variables }), DEFINITION_ID)?.payload['variables']
    ).toEqual({ amount: { value: 10, type: 'Integer' } });
  });

  it('returns null without a message name, or without a correlation target', () => {
    expect(buildMessageRequest(messageData({ messageName: '' }), DEFINITION_ID)).toBeNull();
    expect(
      buildMessageRequest(messageData({ instanceSelectionMode: 'specific', specificInstanceIds: '' }), DEFINITION_ID)
    ).toBeNull();
  });
});

describe('buildSignalRequest', () => {
  it('broadcasts without an execution id', () => {
    const request = buildSignalRequest({ signalName: 'Escalate', processVariables: [] });
    expect(request?.path).toBe('/signal');
    expect(request?.payload).toEqual({ name: 'Escalate' });
    // No executionId: the engine delivers to every matching catch event in every definition.
    expect(request?.payload).not.toHaveProperty('executionId');
  });

  it('returns null without a signal name', () => {
    expect(buildSignalRequest({ signalName: '', processVariables: [] })).toBeNull();
  });
});
