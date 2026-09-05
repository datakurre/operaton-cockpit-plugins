/**
 * Tests for src/utils/api.ts
 *
 * @module
 */
import { headers, get, post, setFetchFunction, resetFetchFunction, getFetchFunction, ApiError } from '../api';
import { createMockApi } from '../../__mocks__/api';

describe('utils/api', () => {
  const mockApi = createMockApi();

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    // Reset to global fetch for tests that use it
    resetFetchFunction();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    resetFetchFunction();
  });

  describe('headers', () => {
    it('should include X-XSRF-TOKEN from api config', () => {
      const api = createMockApi({ CSRFToken: 'test-token-123' });
      const result = headers(api);
      expect(result['X-XSRF-TOKEN']).toBe('test-token-123');
    });

    it('should set Content-Type to application/json', () => {
      const result = headers(mockApi);
      expect(result['Content-Type']).toBe('application/json');
    });

    it('should set Accept to application/json', () => {
      const result = headers(mockApi);
      expect(result.Accept).toBe('application/json');
    });

    it('should include all three headers', () => {
      const result = headers(mockApi);
      expect(Object.keys(result)).toHaveLength(3);
      expect(result).toHaveProperty('Accept');
      expect(result).toHaveProperty('Content-Type');
      expect(result).toHaveProperty('X-XSRF-TOKEN');
    });
  });

  describe('get', () => {
    /**
     * Creates a mock Response object.
     */
    function mockResponse(body: unknown, options: { status?: number; contentType?: string } = {}): Response {
      const { status = 200, contentType = 'application/json' } = options;
      return {
        status,
        ok: status >= 200 && status < 300,
        headers: {
          get: (name: string) => (name === 'Content-Type' ? contentType : null),
        },
        json: () => Promise.resolve(body),
        text: () => Promise.resolve(typeof body === 'string' ? body : JSON.stringify(body)),
      } as unknown as Response;
    }

    it('should fetch data from the correct URL', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse({ id: '123' }));

      await get(mockApi, '/test-endpoint');

      expect(global.fetch).toHaveBeenCalledWith(
        '/api/engine/default/test-endpoint',
        expect.objectContaining({ method: 'get' })
      );
    });

    it('should serialize query parameters correctly', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse([]));

      await get(mockApi, '/endpoint', { foo: 'bar', baz: 'qux' });

      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('foo=bar'), expect.any(Object));
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('baz=qux'), expect.any(Object));
    });

    it('should add maxResults=1000 for history/activity-instance', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse([]));

      await get(mockApi, '/history/activity-instance', {});

      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('maxResults=1000'), expect.any(Object));
    });

    it('should add maxResults=1000 for history/variable-instance', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse([]));

      await get(mockApi, '/history/variable-instance', {});

      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('maxResults=1000'), expect.any(Object));
    });

    it('should add maxResults=1000 for history/decision-instance', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse([]));

      await get(mockApi, '/history/decision-instance', {});

      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('maxResults=1000'), expect.any(Object));
    });

    it('should not override explicit maxResults', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse([]));

      await get(mockApi, '/history/activity-instance', { maxResults: '50' });

      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('maxResults=50'), expect.any(Object));
      expect(global.fetch).not.toHaveBeenCalledWith(expect.stringContaining('maxResults=1000'), expect.any(Object));
    });

    it('should fix malformed engine API with /#/', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse({}));

      const brokenApi = createMockApi({
        engine: 'http://localhost/#/default',
        engineApi: 'http://localhost/#/default/engine',
        baseApi: '/api',
      });

      await get(brokenApi, '/test');

      // The API should be fixed - the regex extracts the part after the last /
      // from the split result (http://localhost), so it gets 'localhost'
      // Then engineApi is rebuilt using baseApi
      expect(brokenApi.engine).toBe('localhost');
      expect(brokenApi.engineApi).toBe('/api/engine/localhost');
    });

    it('should throw ApiError for non-2xx responses', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse({ error: 'Not found' }, { status: 404 }));

      await expect(get(mockApi, '/not-found')).rejects.toMatchObject({
        name: 'ApiError',
        status: 404,
        path: '/not-found',
      });
    });

    it('should parse JSON response for 200 status', async () => {
      const responseData = { id: '123', name: 'test' };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse(responseData));

      const result = await get(mockApi, '/endpoint');

      expect(result).toEqual(responseData);
    });

    it('should return text for non-JSON 200 response', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(
        mockResponse('Plain text', { status: 200, contentType: 'text/plain' })
      );

      const result = await get(mockApi, '/endpoint');

      expect(result).toBe('Plain text');
    });

    it('should include CSRF token in headers', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse({}));

      await get(mockApi, '/test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-XSRF-TOKEN': 'test-csrf-token',
          }),
        })
      );
    });

    it('should handle undefined params', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse({}));

      await get(mockApi, '/test');

      expect(global.fetch).toHaveBeenCalledWith('/api/engine/default/test', expect.any(Object));
    });
  });

  describe('post', () => {
    /**
     * Creates a mock Response object.
     */
    function mockResponse(body: unknown, options: { status?: number; contentType?: string } = {}): Response {
      const { contentType = 'application/json' } = options;
      const status = options.status ?? 200;
      return {
        status,
        ok: status >= 200 && status < 300,
        headers: {
          get: (name: string) => (name === 'Content-Type' ? contentType : null),
        },
        json: () => Promise.resolve(body),
        text: () => Promise.resolve(typeof body === 'string' ? body : JSON.stringify(body)),
      } as unknown as Response;
    }

    it('should send POST request with JSON body', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse({ success: true }));

      const payload = JSON.stringify({ name: 'test' });
      await post(mockApi, '/endpoint', {}, payload);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'post',
          body: payload,
        })
      );
    });

    it('should include query parameters in URL', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse({}));

      await post(mockApi, '/endpoint', { maxResults: '100' }, '{}');

      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('maxResults=100'), expect.any(Object));
    });

    it('should return text for non-JSON responses', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse('Success', { contentType: 'text/plain' }));

      const result = await post(mockApi, '/endpoint');

      expect(result).toBe('Success');
    });

    it('should return JSON for JSON responses', async () => {
      const responseData = { id: '123', created: true };
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse(responseData));

      const result = await post(mockApi, '/endpoint', {}, '{}');

      expect(result).toEqual(responseData);
    });

    it('should add maxResults=1000 for history endpoints', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse([]));

      await post(mockApi, '/history/activity-instance', {}, '{}');

      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('maxResults=1000'), expect.any(Object));
    });

    it('should not override explicit maxResults for history endpoints', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse([]));

      await post(mockApi, '/history/activity-instance', { maxResults: '25' }, '{}');

      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('maxResults=25'), expect.any(Object));
    });

    it('should include CSRF token in headers', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse({}));

      await post(mockApi, '/test', {}, '{}');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-XSRF-TOKEN': 'test-csrf-token',
          }),
        })
      );
    });

    it('should handle null body when no payload provided', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse({}));

      await post(mockApi, '/test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: null,
        })
      );
    });

    it('should call correct URL without query params', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse({}));

      await post(mockApi, '/create', {}, '{"data": "test"}');

      expect(global.fetch).toHaveBeenCalledWith('/api/engine/default/create', expect.any(Object));
    });
  });

  describe('fetch injection', () => {
    /**
     * Creates a mock Response object for injection tests.
     */
    function mockResponse(body: unknown, options: { status?: number; contentType?: string } = {}): Response {
      const { status = 200, contentType = 'application/json' } = options;
      return {
        status,
        ok: status >= 200 && status < 300,
        headers: {
          get: (name: string) => (name === 'Content-Type' ? contentType : null),
        },
        json: () => Promise.resolve(body),
        text: () => Promise.resolve(typeof body === 'string' ? body : JSON.stringify(body)),
      } as unknown as Response;
    }

    it('should use the injected fetch function', async () => {
      const customFetch = jest.fn().mockResolvedValue(mockResponse({ custom: true }));
      setFetchFunction(customFetch as unknown as typeof fetch);

      const result = await get(mockApi, '/test-endpoint');

      expect(customFetch).toHaveBeenCalled();
      expect(global.fetch).not.toHaveBeenCalled();
      expect(result).toEqual({ custom: true });
    });

    it('should reset to global fetch', async () => {
      const customFetch = jest.fn().mockResolvedValue(mockResponse({}));
      setFetchFunction(customFetch as unknown as typeof fetch);

      resetFetchFunction();

      (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse({ reset: true }));
      const result = await get(mockApi, '/test-endpoint');

      expect(global.fetch).toHaveBeenCalled();
      expect(customFetch).not.toHaveBeenCalled();
      expect(result).toEqual({ reset: true });
    });

    it('should return the current fetch function', () => {
      const customFetch = jest.fn();
      setFetchFunction(customFetch as unknown as typeof fetch);

      expect(getFetchFunction()).toBe(customFetch);
    });

    it('should use injected fetch for POST requests', async () => {
      const customFetch = jest.fn().mockResolvedValue(mockResponse({ posted: true }));
      setFetchFunction(customFetch as unknown as typeof fetch);

      const result = await post(mockApi, '/create', {}, '{"test": 1}');

      expect(customFetch).toHaveBeenCalledWith(
        expect.stringContaining('/create'),
        expect.objectContaining({ method: 'post' })
      );
      expect(result).toEqual({ posted: true });
    });
  });
});

describe('ApiError prototype', () => {
  it('is recognised by instanceof', () => {
    // The build targets ES5, whose downlevel of `class extends Error` drops the prototype
    // link unless the constructor restores it. Without that, every `err instanceof
    // ApiError` in the plugins is false and the status checks behind them never run.
    const error = new ApiError('Forbidden', 403, { message: 'Forbidden' }, '/group');
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toBeInstanceOf(Error);
    expect(error.status).toBe(403);
    expect(error.name).toBe('ApiError');
  });

  it('is recognised after being thrown and caught', () => {
    let caught: unknown;
    try {
      throw new ApiError('Not found', 404, null, '/process-definition/x');
    } catch (err) {
      caught = err;
    }
    expect(caught instanceof ApiError).toBe(true);
    expect((caught as ApiError).status).toBe(404);
  });
});
