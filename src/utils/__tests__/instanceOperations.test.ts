/**
 * Tests for the single-instance request builders. These back both the preview and the
 * real request of the instance modify, message and restart forms.
 *
 * @module
 */
import {
  buildInstanceMessageRequest,
  buildInstanceModificationRequest,
  buildRestartRequest,
  RESTART_AT_DEFAULT_START,
  type InstanceMessageInput,
  type InstanceModificationInput,
} from '../instanceOperations';

/**
 * Build modification form state with the given overrides.
 */
function modifyData(overrides: Partial<InstanceModificationInput> = {}): InstanceModificationInput {
  return {
    instructions: [{ type: 'startBeforeActivity', activityId: 'Task_1' }],
    annotation: '',
    skipCustomListeners: false,
    skipIoMappings: false,
    ...overrides,
  };
}

/**
 * Build message form state with the given overrides.
 */
function messageData(overrides: Partial<InstanceMessageInput> = {}): InstanceMessageInput {
  return {
    messageName: 'OrderReceived',
    isStartEvent: false,
    businessKey: '',
    correlationKeys: [],
    localCorrelationKeys: [],
    processVariables: [],
    processVariablesLocal: [],
    ...overrides,
  };
}

describe('buildInstanceModificationRequest', () => {
  it('posts the complete instructions to the instance', () => {
    const request = buildInstanceModificationRequest(
      modifyData({
        instructions: [
          { type: 'startBeforeActivity', activityId: 'Task_1', ancestorActivityInstanceId: '' },
          { type: 'startTransition', transitionId: '' },
          { type: 'cancel', activityInstanceId: 'ai-1', activityId: '' },
        ],
      }),
      'pi-1'
    );
    expect(request).toEqual({
      method: 'POST',
      path: '/process-instance/pi-1/modification',
      payload: {
        skipCustomListeners: false,
        skipIoMappings: false,
        instructions: [
          { type: 'startBeforeActivity', activityId: 'Task_1' },
          { type: 'cancel', activityInstanceId: 'ai-1' },
        ],
        annotation: 'Modified via Cockpit plugin',
      },
    });
  });

  it('sends typed variables with a start instruction', () => {
    const request = buildInstanceModificationRequest(
      modifyData({
        instructions: [
          {
            type: 'startBeforeActivity',
            activityId: 'Task_1',
            variables: [{ name: 'amount', value: '10', type: 'Integer' }],
          },
        ],
      }),
      'pi-1'
    );
    const [instruction] = request?.payload['instructions'] as { variables?: unknown }[];
    expect(instruction?.variables).toEqual({ amount: { value: 10, type: 'Integer' } });
  });

  it('cancels a transition instance for an async continuation', () => {
    const request = buildInstanceModificationRequest(
      modifyData({
        instructions: [{ type: 'cancel', transitionInstanceId: 'ti-1' }],
      }),
      'pi-1'
    );

    expect(request?.payload['instructions']).toEqual([{ type: 'cancel', transitionInstanceId: 'ti-1' }]);
  });

  it('only serializes cancellation targets on cancel instructions', () => {
    const request = buildInstanceModificationRequest(
      modifyData({
        instructions: [
          { type: 'startBeforeActivity', activityId: 'Task_1', transitionInstanceId: 'stale-ti' },
          {
            type: 'cancel',
            activityId: 'Task_1',
            activityInstanceId: 'stale-ai',
            transitionInstanceId: 'ti-1',
          },
        ],
      }),
      'pi-1'
    );

    expect(request?.payload['instructions']).toEqual([
      { type: 'startBeforeActivity', activityId: 'Task_1' },
      { type: 'cancel', transitionInstanceId: 'ti-1' },
    ]);
  });

  it('returns null when no instruction is complete', () => {
    expect(
      buildInstanceModificationRequest(modifyData({ instructions: [{ type: 'startBeforeActivity' }] }), 'pi-1')
    ).toBeNull();
  });
});

describe('buildInstanceMessageRequest', () => {
  it('correlates to exactly the open instance', () => {
    const request = buildInstanceMessageRequest(messageData(), 'pi-1');
    expect(request?.path).toBe('/message');
    expect(request?.payload).toMatchObject({ messageName: 'OrderReceived', processInstanceId: 'pi-1', all: false });
  });

  it('starts a new instance without an instance target for a start message', () => {
    const request = buildInstanceMessageRequest(messageData({ isStartEvent: true, businessKey: 'bk-1' }), 'pi-1');
    expect(request?.payload).toEqual({ messageName: 'OrderReceived', businessKey: 'bk-1', processVariables: {} });
  });

  it('returns null without a message', () => {
    expect(buildInstanceMessageRequest(messageData({ messageName: '' }), 'pi-1')).toBeNull();
  });
});

describe('buildRestartRequest', () => {
  const options = { skipCustomListeners: false, skipIoMappings: true };

  it('restarts before the chosen activity and spells out the engine defaults', () => {
    expect(buildRestartRequest({ startActivityId: 'Task_1', ...options }, 'def-1', 'pi-1')).toEqual({
      method: 'POST',
      path: '/process-definition/def-1/restart',
      payload: {
        processInstanceIds: ['pi-1'],
        initialVariables: false,
        withoutBusinessKey: false,
        skipCustomListeners: false,
        skipIoMappings: true,
        instructions: [{ type: 'startBeforeActivity', activityId: 'Task_1' }],
      },
    });
  });

  it('omits instructions to start at the default start event', () => {
    const request = buildRestartRequest({ startActivityId: RESTART_AT_DEFAULT_START, ...options }, 'def-1', 'pi-1');
    expect(request?.payload['instructions']).toBeUndefined();
  });

  it('returns null until a starting point is chosen', () => {
    expect(buildRestartRequest({ startActivityId: '', ...options }, 'def-1', 'pi-1')).toBeNull();
  });
});
