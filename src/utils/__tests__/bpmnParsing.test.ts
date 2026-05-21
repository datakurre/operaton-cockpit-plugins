/**
 * Tests for src/utils/bpmnParsing.ts
 *
 * @module
 */
import { getBpmnElements } from '../bpmnParsing';
import { createMockApi } from '../../__mocks__/api';
import { setFetchFunction, resetFetchFunction } from '../api';
import {
  simpleBpmnXml,
  bpmnWithGateway,
  bpmnWithMessages,
  bpmnWithSubprocess,
  bpmnWithStartEventMessage,
} from '../../__fixtures__/bpmn-xml';

describe('utils/bpmnParsing', () => {
  const mockApi = createMockApi();
  let mockFetch: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch = jest.fn();
    setFetchFunction(mockFetch as unknown as typeof fetch);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    resetFetchFunction();
  });

  /**
   * Creates a mock Response object.
   */
  function mockResponse(body: unknown, ok = true): Response {
    return {
      status: ok ? 200 : 500,
      ok,
      headers: {
        get: (name: string) => (name === 'Content-Type' ? 'application/json' : null),
      },
      json: () => Promise.resolve(body),
      text: () => Promise.resolve(JSON.stringify(body)),
    } as unknown as Response;
  }

  describe('getBpmnElements', () => {
    it('should extract activities from simple BPMN XML', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({ bpmn20Xml: simpleBpmnXml }));

      const { activities } = await getBpmnElements('def-123', mockApi);

      expect(activities.length).toBeGreaterThan(0);
      // Should find StartEvent, UserTask, and EndEvent
      expect(activities).toContainEqual(
        expect.objectContaining({
          id: 'StartEvent_1',
          type: 'StartEvent',
        })
      );
      expect(activities).toContainEqual(
        expect.objectContaining({
          id: 'Task_1',
          name: 'Review Document',
          type: 'UserTask',
        })
      );
      expect(activities).toContainEqual(
        expect.objectContaining({
          id: 'EndEvent_1',
          type: 'EndEvent',
        })
      );
    });

    it('should extract sequence flows from simple BPMN XML', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({ bpmn20Xml: simpleBpmnXml }));

      const { sequenceFlows } = await getBpmnElements('def-123', mockApi);

      expect(sequenceFlows).toHaveLength(2);
      expect(sequenceFlows[0]).toMatchObject({
        id: 'Flow_1',
        type: 'SequenceFlow',
        sourceRef: 'StartEvent_1',
        targetRef: 'Task_1',
      });
      expect(sequenceFlows[1]).toMatchObject({
        id: 'Flow_2',
        type: 'SequenceFlow',
        sourceRef: 'Task_1',
        targetRef: 'EndEvent_1',
      });
    });

    it('should extract gateway activities from BPMN with gateways', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({ bpmn20Xml: bpmnWithGateway }));

      const { activities } = await getBpmnElements('def-123', mockApi);

      // Should find ExclusiveGateway elements
      expect(activities).toContainEqual(
        expect.objectContaining({
          id: 'Gateway_1',
          type: 'ExclusiveGateway',
        })
      );
      expect(activities).toContainEqual(
        expect.objectContaining({
          id: 'Gateway_2',
          type: 'ExclusiveGateway',
        })
      );
    });

    it('should extract all sequence flows from gateway BPMN', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({ bpmn20Xml: bpmnWithGateway }));

      const { sequenceFlows } = await getBpmnElements('def-123', mockApi);

      // Should have 6 flows: Start->Gateway, Gateway->Approved, Gateway->Rejected, Approved->Merge, Rejected->Merge, Merge->End
      expect(sequenceFlows).toHaveLength(6);

      // Check named flows
      expect(sequenceFlows).toContainEqual(
        expect.objectContaining({
          id: 'Flow_2',
          name: 'Approved',
          sourceRef: 'Gateway_1',
          targetRef: 'Task_Approved',
        })
      );
      expect(sequenceFlows).toContainEqual(
        expect.objectContaining({
          id: 'Flow_3',
          name: 'Rejected',
          sourceRef: 'Gateway_1',
          targetRef: 'Task_Rejected',
        })
      );
    });

    it('should extract messages from catch events', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({ bpmn20Xml: bpmnWithMessages }));

      const { messages } = await getBpmnElements('def-123', mockApi);

      // Should find messages referenced in events
      expect(messages.length).toBeGreaterThan(0);
      expect(messages).toContainEqual({
        id: 'Message_Order',
        name: 'OrderReceived',
        isStartEvent: false,
        hasCatchUsage: true,
      });
    });

    it('should extract messages from boundary events', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({ bpmn20Xml: bpmnWithMessages }));

      const { messages } = await getBpmnElements('def-123', mockApi);

      // Should find the cancel message from boundary event
      expect(messages).toContainEqual({
        id: 'Message_Cancel',
        name: 'CancelOrder',
        isStartEvent: false,
        hasCatchUsage: true,
      });
    });

    it('should mark messages from start events with isStartEvent: true', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({ bpmn20Xml: bpmnWithStartEventMessage }));

      const { messages } = await getBpmnElements('def-123', mockApi);

      expect(messages).toContainEqual({
        id: 'Message_StartOrder',
        name: 'StartOrder',
        isStartEvent: true,
        hasCatchUsage: false,
      });
    });

    it('should throw error when XML is missing', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({}));

      await expect(getBpmnElements('def-123', mockApi)).rejects.toThrow('Failed to load process definition XML');
    });

    it('should throw error when bpmn20Xml is undefined', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({ bpmn20Xml: undefined }));

      await expect(getBpmnElements('def-123', mockApi)).rejects.toThrow('Failed to load process definition XML');
    });

    it('should extract activities from subprocesses recursively', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({ bpmn20Xml: bpmnWithSubprocess }));

      const { activities } = await getBpmnElements('def-123', mockApi);

      // Top-level elements
      expect(activities).toContainEqual(expect.objectContaining({ id: 'StartEvent_1', type: 'StartEvent' }));
      expect(activities).toContainEqual(
        expect.objectContaining({ id: 'SubProcess_1', name: 'Review Process', type: 'SubProcess' })
      );
      expect(activities).toContainEqual(expect.objectContaining({ id: 'EndEvent_1', type: 'EndEvent' }));

      // Nested subprocess activities
      expect(activities).toContainEqual(
        expect.objectContaining({ id: 'SubStart_1', name: 'Sub Start', type: 'StartEvent' })
      );
      expect(activities).toContainEqual(expect.objectContaining({ id: 'SubTask_1', name: 'Review', type: 'UserTask' }));
      expect(activities).toContainEqual(expect.objectContaining({ id: 'SubEnd_1', name: 'Sub End', type: 'EndEvent' }));
    });

    it('should extract sequence flows from subprocesses recursively', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({ bpmn20Xml: bpmnWithSubprocess }));

      const { sequenceFlows } = await getBpmnElements('def-123', mockApi);

      // Top-level flows
      expect(sequenceFlows).toContainEqual(
        expect.objectContaining({ id: 'Flow_1', sourceRef: 'StartEvent_1', targetRef: 'SubProcess_1' })
      );
      expect(sequenceFlows).toContainEqual(
        expect.objectContaining({ id: 'Flow_4', sourceRef: 'SubProcess_1', targetRef: 'EndEvent_1' })
      );

      // Nested subprocess flows
      expect(sequenceFlows).toContainEqual(
        expect.objectContaining({ id: 'SubFlow_1', sourceRef: 'SubStart_1', targetRef: 'SubTask_1' })
      );
      expect(sequenceFlows).toContainEqual(
        expect.objectContaining({ id: 'SubFlow_2', sourceRef: 'SubTask_1', targetRef: 'SubEnd_1' })
      );
    });

    it('should return empty messages array when no message events exist', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({ bpmn20Xml: simpleBpmnXml }));

      const { messages } = await getBpmnElements('def-123', mockApi);

      expect(messages).toEqual([]);
    });

    it('should handle activity without name', async () => {
      const bpmnNoName = `<?xml version="1.0" encoding="UTF-8"?>
        <bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                          id="Definitions_1"
                          targetNamespace="http://bpmn.io/schema/bpmn">
          <bpmn:process id="Process_1" isExecutable="true">
            <bpmn:startEvent id="StartEvent_1"/>
          </bpmn:process>
        </bpmn:definitions>`;

      mockFetch.mockResolvedValueOnce(mockResponse({ bpmn20Xml: bpmnNoName }));

      const { activities } = await getBpmnElements('def-123', mockApi);

      // Name should fallback to id
      expect(activities).toContainEqual(
        expect.objectContaining({
          id: 'StartEvent_1',
          name: 'StartEvent_1',
          type: 'StartEvent',
        })
      );
    });

    it('should call API with correct process definition ID', async () => {
      mockFetch.mockResolvedValueOnce(mockResponse({ bpmn20Xml: simpleBpmnXml }));

      await getBpmnElements('my-process-def-123', mockApi);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/process-definition/my-process-def-123/xml'),
        expect.any(Object)
      );
    });
  });
});
