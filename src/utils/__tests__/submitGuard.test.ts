/**
 * Tests for the guarded submit rules: preview matching and request risk.
 *
 * @module
 */
import type { BatchRequest } from '../batchOperations';
import { describeRisk, isCancelOnly, isPreviewCurrent, requestKey, tryBuild } from '../submitGuard';

const MODIFY: BatchRequest = {
  method: 'POST',
  path: '/modification/executeAsync',
  payload: { instructions: [{ type: 'startBeforeActivity', activityId: 'Task_1' }] },
};

describe('isPreviewCurrent', () => {
  it('is true for an identical rebuild of the previewed request', () => {
    expect(isPreviewCurrent(MODIFY, JSON.parse(JSON.stringify(MODIFY)) as BatchRequest)).toBe(true);
  });

  it('is false once the payload differs', () => {
    expect(isPreviewCurrent(MODIFY, { ...MODIFY, payload: { ...MODIFY.payload, skipIoMappings: true } })).toBe(false);
  });

  it('is false without a preview or without a current request', () => {
    expect(isPreviewCurrent(null, MODIFY)).toBe(false);
    expect(isPreviewCurrent(MODIFY, null)).toBe(false);
    expect(requestKey(null)).toBeNull();
  });
});

describe('isCancelOnly', () => {
  it('is true for cancel instructions without a start', () => {
    expect(isCancelOnly([{ type: 'cancel' }])).toBe(true);
  });

  it('is false when a start instruction moves the token', () => {
    expect(isCancelOnly([{ type: 'cancel' }, { type: 'startBeforeActivity' }])).toBe(false);
    expect(isCancelOnly([{ type: 'startTransition' }])).toBe(false);
  });
});

describe('describeRisk', () => {
  it('blocks a batch that only cancels', () => {
    const risk = describeRisk({ ...MODIFY, payload: { instructions: [{ type: 'cancel', activityId: 'Task_1' }] } });
    expect(risk.level).toBe('ends-instances');
    expect(risk.blockedReason).toBeDefined();
  });

  it('asks to acknowledge the instance count of a batch', () => {
    const risk = describeRisk(MODIFY, 12);
    expect(risk.level).toBe('mass');
    expect(risk.blockedReason).toBeUndefined();
    expect(risk.acknowledgement).toContain('12 process instances');
  });

  it('treats a message correlation batch as mass', () => {
    expect(describeRisk({ method: 'POST', path: '/process-instance/message-async', payload: {} }, 1).level).toBe(
      'mass'
    );
  });

  it('marks a signal as engine-wide', () => {
    expect(describeRisk({ method: 'POST', path: '/signal', payload: { name: 's' } }).level).toBe('engine-wide');
  });

  it('distinguishes a start message from a correlation to one instance', () => {
    expect(describeRisk({ method: 'POST', path: '/message', payload: { messageName: 'm' } }).level).toBe(
      'creates-instance'
    );
    expect(
      describeRisk({ method: 'POST', path: '/message', payload: { messageName: 'm', processInstanceId: 'pi-1' } }).level
    ).toBe('single');
  });

  it('marks a restart as creating an instance', () => {
    expect(describeRisk({ method: 'POST', path: '/process-definition/d/restart', payload: {} }).level).toBe(
      'creates-instance'
    );
  });

  it('warns, without blocking, when a single instance modification only cancels', () => {
    const risk = describeRisk({
      method: 'POST',
      path: '/process-instance/pi-1/modification',
      payload: { instructions: [{ type: 'cancel', activityInstanceId: 'ai-1' }] },
    });
    expect(risk.level).toBe('ends-instances');
    expect(risk.blockedReason).toBeUndefined();
  });
});

describe('tryBuild', () => {
  it('turns a throwing builder into null', () => {
    expect(
      tryBuild(() => {
        throw new Error('bad');
      })
    ).toBeNull();
    expect(tryBuild(() => MODIFY)).toBe(MODIFY);
  });
});
