/**
 * Tests for the AuthorizationService abstraction.
 *
 * @module
 */
import {
  AuthorizationService,
  createAuthorizationService,
  createPayloadFromForm,
  IAuthorizationService,
} from '../AuthorizationService';
import { setFetchFunction, resetFetchFunction } from '../../utils/api';
import { mockApi } from '../../__mocks__/api';
import type { AuthorizationForm } from '../../utils/authorization';

describe('AuthorizationService', () => {
  let service: IAuthorizationService;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    mockFetch = jest.fn();
    setFetchFunction(mockFetch as unknown as typeof fetch);
    service = new AuthorizationService(mockApi);
  });

  afterEach(() => {
    resetFetchFunction();
    jest.clearAllMocks();
  });

  describe('getAuthorizations', () => {
    it('should fetch authorizations without params', async () => {
      const mockAuthorizations = [
        { id: 'auth-1', type: 1, permissions: ['READ'], resourceType: 0, resourceId: '*' },
        { id: 'auth-2', type: 1, permissions: ['ALL'], resourceType: 0, resourceId: '*' },
      ];
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => mockAuthorizations,
      });

      const result = await service.getAuthorizations();

      expect(mockFetch).toHaveBeenCalled();
      expect(result).toEqual(mockAuthorizations);
    });

    it('should pass resourceType parameter', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => [],
      });

      await service.getAuthorizations({ resourceType: 6 });

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('resourceType=6'), expect.any(Object));
    });

    it('should pass pagination parameters', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => [],
      });

      await service.getAuthorizations({ maxResults: 25, firstResult: 50 });

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('maxResults=25'), expect.any(Object));
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('firstResult=50'), expect.any(Object));
    });

    it('should pass filter parameters', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => [],
      });

      await service.getAuthorizations({ userIdIn: 'admin', type: 1 });

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('userIdIn=admin'), expect.any(Object));
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('type=1'), expect.any(Object));
    });

    it('should return empty array when response is not an array', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => null,
      });

      const result = await service.getAuthorizations();

      expect(result).toEqual([]);
    });
  });

  describe('getCount', () => {
    it('should fetch authorization count', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => ({ count: 42 }),
      });

      const result = await service.getCount();

      expect(result).toBe(42);
    });

    it('should pass resourceType parameter', async () => {
      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => ({ count: 10 }),
      });

      await service.getCount({ resourceType: 6 });

      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('resourceType=6'), expect.any(Object));
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

  describe('create', () => {
    it('should create a new authorization', async () => {
      const payload = {
        type: 1,
        permissions: ['READ', 'UPDATE'],
        userId: 'admin',
        groupId: null,
        resourceType: 6,
        resourceId: '*',
      };
      const createdAuth = { id: 'auth-new', ...payload };

      mockFetch.mockResolvedValue({
        status: 200,
        ok: true,
        headers: new Headers({ 'Content-Type': 'application/json' }),
        json: async () => createdAuth,
      });

      const result = await service.create(payload);

      expect(mockFetch).toHaveBeenCalled();
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/authorization/create'),
        expect.objectContaining({
          method: 'post',
          body: JSON.stringify(payload),
        })
      );
      expect(result).toEqual(createdAuth);
    });
  });

  describe('update', () => {
    it('should update an existing authorization', async () => {
      const payload = {
        type: 1,
        permissions: ['READ', 'UPDATE', 'DELETE'],
        userId: 'admin',
        groupId: null,
        resourceType: 6,
        resourceId: 'my-process',
      };

      mockFetch.mockResolvedValue({
        status: 204,
        ok: true,
        headers: new Headers(),
        text: async () => '',
      });

      await service.update('auth-123', payload);

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/authorization/auth-123'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(payload),
        })
      );
    });
  });

  describe('delete', () => {
    it('should delete an authorization', async () => {
      mockFetch.mockResolvedValue({
        status: 204,
        ok: true,
        headers: new Headers(),
        text: async () => '',
      });

      await service.delete('auth-123');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/authorization/auth-123'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });
});

describe('createPayloadFromForm', () => {
  it('should create payload for user authorization', () => {
    const form: AuthorizationForm = {
      type: 1,
      identityType: 'user',
      identityId: 'admin',
      permissions: ['READ', 'UPDATE'],
      resourceId: 'my-process',
    };

    const result = createPayloadFromForm(form, 6);

    expect(result).toEqual({
      type: 1,
      permissions: ['READ', 'UPDATE'],
      userId: 'admin',
      groupId: null,
      resourceType: 6,
      resourceId: 'my-process',
    });
  });

  it('should create payload for group authorization', () => {
    const form: AuthorizationForm = {
      type: 1,
      identityType: 'group',
      identityId: 'managers',
      permissions: ['ALL'],
      resourceId: '*',
    };

    const result = createPayloadFromForm(form, 6);

    expect(result).toEqual({
      type: 1,
      permissions: ['ALL'],
      userId: null,
      groupId: 'managers',
      resourceType: 6,
      resourceId: '*',
    });
  });

  it('should default empty resourceId to *', () => {
    const form: AuthorizationForm = {
      type: 0,
      identityType: 'user',
      identityId: 'admin',
      permissions: ['READ'],
      resourceId: '',
    };

    const result = createPayloadFromForm(form, 0);

    expect(result.resourceId).toBe('*');
  });
});

describe('createAuthorizationService', () => {
  it('should create a new AuthorizationService instance', () => {
    const service = createAuthorizationService(mockApi);

    expect(service).toBeInstanceOf(AuthorizationService);
  });
});
