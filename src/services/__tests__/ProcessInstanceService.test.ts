/**
 * Tests for the ProcessInstanceService abstraction.
 *
 * @module
 */
import {
  ProcessInstanceService,
  createProcessInstanceService,
  IProcessInstanceService,
  ProcessModificationRequest,
  MessageCorrelationRequest,
} from '../ProcessInstanceService';
import { setFetchFunction, resetFetchFunction } from '../../utils/api';
import { mockApi } from '../../__mocks__/api';

describe('ProcessInstanceService', () => {
  let service: IProcessInstanceService;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
    setFetchFunction(mockFetch as unknown as typeof fetch);
    service = new ProcessInstanceService(mockApi);
  });

  afterEach(() => {
    resetFetchFunction();
    jest.clearAllMocks();
  });

  describe('getInstance', () => {
    it('should fetch a process instance by ID', async () => {
      const mockInstance = {
        id: 'instance-123',
        processDefinitionId: 'def-456',
        businessKey: 'order-789',
      };
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => mockInstance,
      });

      const result = await service.getInstance('instance-123');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/process-instance/instance-123'),
        expect.any(Object)
      );
      expect(result).toEqual(mockInstance);
    });

    it('should return null when instance not found', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => null,
      });

      const result = await service.getInstance('not-found');

      expect(result).toBeNull();
    });
  });

  describe('getHistoricInstance', () => {
    it('should fetch a historic process instance by ID', async () => {
      const mockInstance = {
        id: 'instance-123',
        processDefinitionId: 'def-456',
        startTime: '2024-01-01T10:00:00.000Z',
        endTime: '2024-01-01T12:00:00.000Z',
        state: 'COMPLETED',
      };
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => mockInstance,
      });

      const result = await service.getHistoricInstance('instance-123');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/history/process-instance/instance-123'),
        expect.any(Object)
      );
      expect(result).toEqual(mockInstance);
    });

    it('should return null when historic instance not found', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => null,
      });

      const result = await service.getHistoricInstance('not-found');

      expect(result).toBeNull();
    });
  });

  describe('getInstances', () => {
    it('should fetch process instances without params', async () => {
      const mockInstances = [
        { id: 'instance-1', processDefinitionId: 'def-1' },
        { id: 'instance-2', processDefinitionId: 'def-1' },
      ];
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => mockInstances,
      });

      const result = await service.getInstances();

      expect(mockFetch).toHaveBeenCalled();
      expect(result).toEqual(mockInstances);
    });

    it('should pass query parameters', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => [],
      });

      await service.getInstances({
        processDefinitionId: 'def-123',
        active: true,
        maxResults: 25,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('processDefinitionId=def-123'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('active=true'), expect.any(Object));
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('maxResults=25'), expect.any(Object));
    });

    it('should return empty array when response is not an array', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => null,
      });

      const result = await service.getInstances();

      expect(result).toEqual([]);
    });
  });

  describe('modifyInstance', () => {
    it('should modify a process instance with start before activity', async () => {
      mockFetch.mockResolvedValue({
        status: 204,
        ok: true,
        headers: new Headers(),
        text: async () => '',
      });

      const request: ProcessModificationRequest = {
        instructions: [{ type: 'startBeforeActivity', activityId: 'task-1' }],
        annotation: 'Test modification',
      };

      await service.modifyInstance('instance-123', request);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/process-instance/instance-123/modification'),
        expect.objectContaining({
          method: 'post',
          body: expect.stringContaining('"startBeforeActivity"'),
        })
      );
    });

    it('should include variables in modification instruction', async () => {
      mockFetch.mockResolvedValue({
        status: 204,
        ok: true,
        headers: new Headers(),
        text: async () => '',
      });

      const request: ProcessModificationRequest = {
        instructions: [
          {
            type: 'startBeforeActivity',
            activityId: 'task-1',
            variables: [{ name: 'approved', type: 'Boolean', value: 'true' }],
          },
        ],
      };

      await service.modifyInstance('instance-123', request);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/process-instance/instance-123/modification'),
        expect.objectContaining({
          body: expect.stringContaining('"approved"'),
        })
      );
    });

    it('should include skip flags when provided', async () => {
      mockFetch.mockResolvedValue({
        status: 204,
        ok: true,
        headers: new Headers(),
        text: async () => '',
      });

      const request: ProcessModificationRequest = {
        instructions: [{ type: 'cancel', activityInstanceId: 'act-1' }],
        skipCustomListeners: true,
        skipIoMappings: true,
      };

      await service.modifyInstance('instance-123', request);

      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse(callArgs[1].body as string);

      expect(body.skipCustomListeners).toBe(true);
      expect(body.skipIoMappings).toBe(true);
    });
  });

  describe('correlateMessage', () => {
    it('should correlate a message', async () => {
      const mockResult = [
        {
          resultType: 'Execution',
          execution: { id: 'exec-1', processInstanceId: 'instance-123' },
        },
      ];
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => mockResult,
      });

      const request: MessageCorrelationRequest = {
        messageName: 'OrderReceived',
        processInstanceId: 'instance-123',
      };

      const result = await service.correlateMessage(request);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/message'),
        expect.objectContaining({
          method: 'post',
          body: expect.stringContaining('"OrderReceived"'),
        })
      );
      expect(result).toEqual(mockResult);
    });

    it('should include correlation keys', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => [],
      });

      const request: MessageCorrelationRequest = {
        messageName: 'OrderReceived',
        correlationKeys: [{ name: 'orderId', value: '12345', type: 'String' }],
      };

      await service.correlateMessage(request);

      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse(callArgs[1].body as string);

      expect(body.correlationKeys).toEqual({
        orderId: { value: '12345', type: 'String' },
      });
    });

    it('should include process variables', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => [],
      });

      const request: MessageCorrelationRequest = {
        messageName: 'PaymentReceived',
        processVariables: [{ name: 'amount', type: 'Integer', value: '100' }],
      };

      await service.correlateMessage(request);

      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse(callArgs[1].body as string);

      expect(body.processVariables).toBeDefined();
      expect(body.processVariables.amount).toBeDefined();
    });

    it('should return empty array when response is not an array', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => null,
      });

      const request: MessageCorrelationRequest = {
        messageName: 'TestMessage',
      };

      const result = await service.correlateMessage(request);

      expect(result).toEqual([]);
    });
  });
});

describe('createProcessInstanceService', () => {
  it('should create a new ProcessInstanceService instance', () => {
    const service = createProcessInstanceService(mockApi);

    expect(service).toBeInstanceOf(ProcessInstanceService);
  });
});
