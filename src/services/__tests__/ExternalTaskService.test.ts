/**
 * Tests for the ExternalTaskService abstraction.
 *
 * @module
 */
import {
  ExternalTaskService,
  createExternalTaskService,
  IExternalTaskService,
  FetchAndLockRequest,
} from '../ExternalTaskService';
import { setFetchFunction, resetFetchFunction } from '../../utils/api';
import { mockApi } from '../../__mocks__/api';

describe('ExternalTaskService', () => {
  let service: IExternalTaskService;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
    setFetchFunction(mockFetch as unknown as typeof fetch);
    service = new ExternalTaskService(mockApi);
  });

  afterEach(() => {
    resetFetchFunction();
    jest.clearAllMocks();
  });

  describe('getTasks', () => {
    it('should fetch external tasks without params', async () => {
      const mockTasks = [
        { id: 'task-1', topicName: 'payment', workerId: 'worker-1' },
        { id: 'task-2', topicName: 'notification', workerId: 'worker-2' },
      ];
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => mockTasks,
      });

      const result = await service.getTasks();

      expect(mockFetch).toHaveBeenCalled();
      expect(result).toEqual(mockTasks);
    });

    it('should pass query parameters', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => [],
      });

      await service.getTasks({
        processInstanceId: 'instance-123',
        locked: true,
        topicName: 'payment',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('processInstanceId=instance-123'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('locked=true'), expect.any(Object));
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('topicName=payment'), expect.any(Object));
    });

    it('should pass pagination parameters', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => [],
      });

      await service.getTasks({ maxResults: 25, firstResult: 50 });

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('maxResults=25'), expect.any(Object));
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('firstResult=50'), expect.any(Object));
    });

    it('should return empty array when response is not an array', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => null,
      });

      const result = await service.getTasks();

      expect(result).toEqual([]);
    });
  });

  describe('getCount', () => {
    it('should fetch external task count', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => ({ count: 15 }),
      });

      const result = await service.getCount();

      expect(result).toBe(15);
    });

    it('should pass filter parameters', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => ({ count: 5 }),
      });

      await service.getCount({ processInstanceId: 'instance-123', noRetriesLeft: true });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('processInstanceId=instance-123'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('noRetriesLeft=true'), expect.any(Object));
    });

    it('should return 0 when response is invalid', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => null,
      });

      const result = await service.getCount();

      expect(result).toBe(0);
    });
  });

  describe('unlock', () => {
    it('should unlock an external task', async () => {
      mockFetch.mockResolvedValue({
        status: 204,
        ok: true,
        headers: new Headers(),
        text: async () => '',
      });

      await service.unlock('task-123');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/external-task/task-123/unlock'),
        expect.objectContaining({
          method: 'post',
        })
      );
    });
  });

  describe('setRetries', () => {
    it('should set retries for an external task', async () => {
      mockFetch.mockResolvedValue({
        status: 204,
        ok: true,
        headers: new Headers(),
        text: async () => '',
      });

      await service.setRetries('task-123', 3);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/external-task/task-123/retries'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ retries: 3 }),
        })
      );
    });
  });

  describe('reportFailure', () => {
    it('should report failure with minimal parameters', async () => {
      mockFetch.mockResolvedValue({
        status: 204,
        ok: true,
        headers: new Headers(),
        text: async () => '',
      });

      await service.reportFailure('task-123', 'Connection timeout');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/external-task/task-123/failure'),
        expect.objectContaining({
          method: 'post',
          body: JSON.stringify({ errorMessage: 'Connection timeout' }),
        })
      );
    });

    it('should report failure with all parameters', async () => {
      mockFetch.mockResolvedValue({
        status: 204,
        ok: true,
        headers: new Headers(),
        text: async () => '',
      });

      await service.reportFailure('task-123', 'Connection timeout', 'Stack trace...', 2, 60000);

      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse(callArgs[1].body as string);

      expect(body.errorMessage).toBe('Connection timeout');
      expect(body.errorDetails).toBe('Stack trace...');
      expect(body.retries).toBe(2);
      expect(body.retryTimeout).toBe(60000);
    });
  });

  describe('reportBpmnError', () => {
    it('should report BPMN error with error code only', async () => {
      mockFetch.mockResolvedValue({
        status: 204,
        ok: true,
        headers: new Headers(),
        text: async () => '',
      });

      await service.reportBpmnError('task-123', 'PAYMENT_FAILED');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/external-task/task-123/bpmnError'),
        expect.objectContaining({
          method: 'post',
          body: JSON.stringify({ errorCode: 'PAYMENT_FAILED' }),
        })
      );
    });

    it('should report BPMN error with message', async () => {
      mockFetch.mockResolvedValue({
        status: 204,
        ok: true,
        headers: new Headers(),
        text: async () => '',
      });

      await service.reportBpmnError('task-123', 'PAYMENT_FAILED', 'Insufficient funds');

      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse(callArgs[1].body as string);

      expect(body.errorCode).toBe('PAYMENT_FAILED');
      expect(body.errorMessage).toBe('Insufficient funds');
    });
  });

  describe('fetchAndLock', () => {
    it('should fetch and lock external tasks', async () => {
      const mockLockedTasks = [{ id: 'task-1', topicName: 'payment', workerId: 'worker-1' }];
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => mockLockedTasks,
      });

      const request: FetchAndLockRequest = {
        workerId: 'worker-1',
        maxTasks: 10,
        topics: [{ topicName: 'payment', lockDuration: 300000 }],
      };

      const result = await service.fetchAndLock(request);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/external-task/fetchAndLock'),
        expect.objectContaining({
          method: 'post',
          body: expect.stringContaining('"workerId":"worker-1"'),
        })
      );
      expect(result).toEqual(mockLockedTasks);
    });

    it('should return empty array when response is not an array', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => null,
      });

      const request: FetchAndLockRequest = {
        workerId: 'worker-1',
        maxTasks: 10,
        topics: [{ topicName: 'test', lockDuration: 300000 }],
      };

      const result = await service.fetchAndLock(request);

      expect(result).toEqual([]);
    });
  });
});

describe('createExternalTaskService', () => {
  it('should create a new ExternalTaskService instance', () => {
    const service = createExternalTaskService(mockApi);

    expect(service).toBeInstanceOf(ExternalTaskService);
  });
});
