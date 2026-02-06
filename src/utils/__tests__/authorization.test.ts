/**
 * Tests for authorization utilities.
 *
 * Tests for authorization types, resource types, permissions, and helper functions.
 *
 * @module
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  AUTH_TYPES,
  RESOURCE_TYPES,
  PERMISSIONS_BY_RESOURCE,
  DEFAULT_PERMISSIONS,
  getPermissionsForResource,
  getResourceTypeName,
  getAuthTypeLabel,
  renderIdentityDisplay,
  getResourceUrl,
  renderResourceIdDisplay,
  getResourceValidationEndpoint,
  deriveCockpitAppUrl,
  deriveTasklistAppUrl,
  isProcessDefinitionKey,
  containsUUID,
} from '../authorization';

describe('authorization', () => {
  describe('AUTH_TYPES', () => {
    it('should define three authorization types', () => {
      expect(AUTH_TYPES).toHaveLength(3);
    });

    it('should include Global type with id 0', () => {
      const global = AUTH_TYPES.find(t => t.id === 0);
      expect(global).toBeDefined();
      expect(global?.name).toBe('Global');
      expect(global?.label).toBe('GLOBAL');
    });

    it('should include Grant type with id 1', () => {
      const grant = AUTH_TYPES.find(t => t.id === 1);
      expect(grant).toBeDefined();
      expect(grant?.name).toBe('Grant');
      expect(grant?.label).toBe('ALLOW');
    });

    it('should include Revoke type with id 2', () => {
      const revoke = AUTH_TYPES.find(t => t.id === 2);
      expect(revoke).toBeDefined();
      expect(revoke?.name).toBe('Revoke');
      expect(revoke?.label).toBe('DENY');
    });
  });

  describe('RESOURCE_TYPES', () => {
    it('should define all resource types', () => {
      expect(RESOURCE_TYPES.length).toBeGreaterThan(15);
    });

    it('should include Application with id 0', () => {
      const app = RESOURCE_TYPES.find(rt => rt.id === 0);
      expect(app?.name).toBe('Application');
    });

    it('should include User with id 1', () => {
      const user = RESOURCE_TYPES.find(rt => rt.id === 1);
      expect(user?.name).toBe('User');
    });

    it('should include Process Definition with id 6', () => {
      const processDef = RESOURCE_TYPES.find(rt => rt.id === 6);
      expect(processDef?.name).toBe('Process Definition');
    });

    it('should include Task with id 7', () => {
      const task = RESOURCE_TYPES.find(rt => rt.id === 7);
      expect(task?.name).toBe('Task');
    });

    it('should include Batch with id 13', () => {
      const batch = RESOURCE_TYPES.find(rt => rt.id === 13);
      expect(batch?.name).toBe('Batch');
    });
  });

  describe('PERMISSIONS_BY_RESOURCE', () => {
    it('should define permissions for Application (0)', () => {
      expect(PERMISSIONS_BY_RESOURCE[0]).toEqual(['ALL', 'ACCESS']);
    });

    it('should define permissions for User (1)', () => {
      expect(PERMISSIONS_BY_RESOURCE[1]).toEqual(['ALL', 'READ', 'UPDATE', 'CREATE', 'DELETE']);
    });

    it('should define many permissions for Process Definition (6)', () => {
      const perms = PERMISSIONS_BY_RESOURCE[6];
      expect(perms?.length).toBeGreaterThan(10);
      expect(perms).toContain('ALL');
      expect(perms).toContain('READ');
      expect(perms).toContain('CREATE_INSTANCE');
      expect(perms).toContain('SUSPEND');
      expect(perms).toContain('READ_HISTORY');
    });

    it('should define permissions for Task (7)', () => {
      const perms = PERMISSIONS_BY_RESOURCE[7];
      expect(perms).toContain('ALL');
      expect(perms).toContain('TASK_ASSIGN');
      expect(perms).toContain('TASK_WORK');
    });

    it('should define many permissions for Batch (13)', () => {
      const perms = PERMISSIONS_BY_RESOURCE[13];
      expect(perms?.length).toBeGreaterThan(10);
      expect(perms).toContain('CREATE_BATCH_MIGRATE_PROCESS_INSTANCES');
    });
  });

  describe('DEFAULT_PERMISSIONS', () => {
    it('should include standard CRUD permissions', () => {
      expect(DEFAULT_PERMISSIONS).toEqual(['ALL', 'READ', 'UPDATE', 'CREATE', 'DELETE']);
    });
  });

  describe('getPermissionsForResource', () => {
    it('should return permissions for known resource type', () => {
      const perms = getPermissionsForResource(0);
      expect(perms).toEqual(['ALL', 'ACCESS']);
    });

    it('should return default permissions for unknown resource type', () => {
      const perms = getPermissionsForResource(999);
      expect(perms).toEqual(DEFAULT_PERMISSIONS);
    });

    it('should return default permissions for null resource type', () => {
      const perms = getPermissionsForResource(null);
      expect(perms).toEqual(DEFAULT_PERMISSIONS);
    });

    it('should return Process Definition permissions for type 6', () => {
      const perms = getPermissionsForResource(6);
      expect(perms).toContain('CREATE_INSTANCE');
      expect(perms).toContain('READ_HISTORY');
    });
  });

  describe('getResourceTypeName', () => {
    it('should return name for known resource type', () => {
      expect(getResourceTypeName(0)).toBe('Application');
      expect(getResourceTypeName(1)).toBe('User');
      expect(getResourceTypeName(6)).toBe('Process Definition');
    });

    it('should return fallback for unknown resource type', () => {
      expect(getResourceTypeName(999)).toBe('Type 999');
    });

    it('should return dash for null resource type', () => {
      expect(getResourceTypeName(null)).toBe('-');
    });
  });

  describe('getAuthTypeLabel', () => {
    it('should return label for known auth type', () => {
      expect(getAuthTypeLabel(0)).toBe('GLOBAL');
      expect(getAuthTypeLabel(1)).toBe('ALLOW');
      expect(getAuthTypeLabel(2)).toBe('DENY');
    });

    it('should return fallback for unknown auth type', () => {
      expect(getAuthTypeLabel(999)).toBe('Type 999');
    });

    it('should return dash for null auth type', () => {
      expect(getAuthTypeLabel(null)).toBe('-');
    });
  });

  describe('renderIdentityDisplay', () => {
    it('should render user identity with icon', () => {
      const element = renderIdentityDisplay('admin', null);
      const { container } = render(element);

      expect(container.textContent).toContain('admin');
      expect(container.querySelector('.glyphicon-user')).toBeTruthy();
    });

    it('should render group identity with icon', () => {
      const element = renderIdentityDisplay(null, 'managers');
      const { container } = render(element);

      expect(container.textContent).toContain('managers');
      expect(container.querySelector('.glyphicon-th')).toBeTruthy();
    });

    it('should prefer user over group when both provided', () => {
      const element = renderIdentityDisplay('admin', 'managers');
      const { container } = render(element);

      expect(container.textContent).toContain('admin');
      expect(container.textContent).not.toContain('managers');
    });

    it('should render dash when neither user nor group', () => {
      const element = renderIdentityDisplay(null, null);
      const { container } = render(element);

      expect(container.textContent).toBe('-');
    });
  });

  describe('getResourceUrl', () => {
    it('should return null for wildcard resource ID', () => {
      expect(getResourceUrl(6, '*')).toBeNull();
    });

    it('should return null for empty resource ID', () => {
      expect(getResourceUrl(6, '')).toBeNull();
      expect(getResourceUrl(6, null)).toBeNull();
    });

    it('should return null for null resource type', () => {
      expect(getResourceUrl(null, 'some-id')).toBeNull();
    });

    it('should return correct URL for User (1)', () => {
      expect(getResourceUrl(1, 'admin')).toBe('#/users/admin');
    });

    it('should return correct URL for Group (2)', () => {
      expect(getResourceUrl(2, 'managers')).toBe('#/groups/managers');
    });

    it('should return correct URL for Authorization (4)', () => {
      expect(getResourceUrl(4, 'auth-123')).toBe('#/authorization/?resource=4&authorizationId=auth-123');
    });

    it('should return correct URL for Process Definition (6) with full ID', () => {
      expect(getResourceUrl(6, 'process:1:abc123')).toBe('#/process-definition/process%3A1%3Aabc123');
    });

    it('should return processes dashboard URL for Process Definition key', () => {
      const url = getResourceUrl(6, 'my-process-key');
      expect(url).toContain('#/processes?pdSearchQuery=');
      expect(url).toContain('my-process-key');
      // Decode to verify structure
      const match = url?.match(/pdSearchQuery=([^&]+)/);
      expect(match).toBeTruthy();
      const decoded = decodeURIComponent(match![1]);
      const query = JSON.parse(decoded);
      expect(query).toEqual([{ type: 'key', operator: 'eq', value: 'my-process-key' }]);
    });

    it('should return correct URL for Process Instance (8)', () => {
      expect(getResourceUrl(8, 'instance-123')).toBe('#/process-instance/instance-123');
    });

    it('should return correct URL for Deployment (9)', () => {
      expect(getResourceUrl(9, 'deploy-123')).toBe('#/repository?page=1&deploymentsQuery=%5B%5D&deployment=deploy-123');
    });

    it('should return correct URL for Decision Definition (10)', () => {
      expect(getResourceUrl(10, 'decision:1:xyz')).toBe('#/decision-definition/decision%3A1%3Axyz');
    });

    it('should return correct URL for Tenant (11)', () => {
      expect(getResourceUrl(11, 'tenant-a')).toBe('#/tenants/tenant-a');
    });

    it('should return correct URL for Batch (13)', () => {
      expect(getResourceUrl(13, 'batch-456')).toBe('#/batch/batch-456');
    });

    it('should return correct URL for Decision Requirements Definition (14)', () => {
      expect(getResourceUrl(14, 'drd:1:abc')).toBe('#/decision-definition/drd%3A1%3Aabc');
    });

    it('should return correct URL for Historic Process Instance (20)', () => {
      expect(getResourceUrl(20, 'hist-instance-789')).toBe('#/history/process-instance/hist-instance-789');
    });

    it('should return null for resource types without specific links', () => {
      expect(getResourceUrl(0, 'app-id')).toBeNull(); // Application
      expect(getResourceUrl(3, 'membership-id')).toBeNull(); // Group Membership
      expect(getResourceUrl(5, 'filter-id')).toBeNull(); // Filter
      expect(getResourceUrl(7, 'task-id')).toBeNull(); // Task
      expect(getResourceUrl(12, 'tenant-membership-id')).toBeNull(); // Tenant Membership
      expect(getResourceUrl(17, 'log-id')).toBeNull(); // Operation Log
      expect(getResourceUrl(19, 'hist-task-id')).toBeNull(); // Historic Task Instance
      expect(getResourceUrl(21, 'system-id')).toBeNull(); // System
    });

    it('should properly encode special characters in resource IDs', () => {
      expect(getResourceUrl(1, 'user@example.com')).toBe('#/users/user%40example.com');
      expect(getResourceUrl(6, 'process:1:abc/123')).toBe('#/process-definition/process%3A1%3Aabc%2F123');
    });
  });

  describe('renderResourceIdDisplay', () => {
    it('should render link for User resource', () => {
      const element = renderResourceIdDisplay(1, 'admin');
      const { container } = render(element);

      const link = container.querySelector('a');
      expect(link).toBeTruthy();
      expect(link?.getAttribute('href')).toBe('#/users/admin');
      expect(link?.textContent).toBe('admin');
    });

    it('should render link for Process Definition resource', () => {
      const element = renderResourceIdDisplay(6, 'process:1:abc');
      const { container } = render(element);

      const link = container.querySelector('a');
      expect(link).toBeTruthy();
      expect(link?.getAttribute('href')).toBe('#/process-definition/process%3A1%3Aabc');
      expect(link?.textContent).toBe('process:1:abc');
    });

    it('should render plain text for wildcard resource', () => {
      const element = renderResourceIdDisplay(6, '*');
      const { container } = render(element);

      expect(container.querySelector('a')).toBeNull();
      expect(container.textContent).toBe('*');
    });

    it('should render plain text for resource type without link', () => {
      const element = renderResourceIdDisplay(0, 'app-id'); // Application
      const { container } = render(element);

      expect(container.querySelector('a')).toBeNull();
      expect(container.textContent).toBe('app-id');
    });

    it('should render dash for null resource ID', () => {
      const element = renderResourceIdDisplay(6, null);
      const { container } = render(element);

      expect(container.textContent).toBe('-');
      expect(container.querySelector('a')).toBeNull();
    });

    it('should render dash for null resource type', () => {
      const element = renderResourceIdDisplay(null, 'some-id');
      const { container } = render(element);

      expect(container.textContent).toBe('some-id');
      expect(container.querySelector('a')).toBeNull();
    });

    it('should render with red color for invalid validation status', () => {
      const element = renderResourceIdDisplay(6, 'missing-process', 'invalid');
      const { container } = render(element);

      const link = container.querySelector('a');
      expect(link).toBeTruthy();
      expect(link?.style.color).toBe('rgb(217, 83, 79)'); // #d9534f
      expect(link?.style.fontWeight).toBe('bold');
      expect(link?.title).toBe('Resource not found');
    });

    it('should render with title for valid validation status', () => {
      const element = renderResourceIdDisplay(6, 'existing-process', 'valid');
      const { container } = render(element);

      const link = container.querySelector('a');
      expect(link).toBeTruthy();
      expect(link?.title).toBe('Resource exists');
      expect(link?.style.color).toBe('');
    });

    it('should render without special styling for unknown validation status', () => {
      const element = renderResourceIdDisplay(6, 'unknown-process', 'unknown');
      const { container } = render(element);

      const link = container.querySelector('a');
      expect(link).toBeTruthy();
      expect(link?.title).toBe('');
      expect(link?.style.color).toBe('');
    });
  });

  describe('getResourceValidationEndpoint', () => {
    it('should return null for wildcard resource ID', () => {
      expect(getResourceValidationEndpoint(6, '*')).toBeNull();
    });

    it('should return null for null resource ID', () => {
      expect(getResourceValidationEndpoint(6, null)).toBeNull();
    });

    it('should return null for null resource type', () => {
      expect(getResourceValidationEndpoint(null, 'some-id')).toBeNull();
    });

    it('should return user profile endpoint for User resource', () => {
      expect(getResourceValidationEndpoint(1, 'admin')).toBe('/user/admin/profile');
    });

    it('should return group endpoint for Group resource', () => {
      expect(getResourceValidationEndpoint(2, 'managers')).toBe('/group/managers');
    });

    it('should return authorization endpoint for Authorization resource', () => {
      expect(getResourceValidationEndpoint(4, 'auth-123')).toBe('/authorization/auth-123');
    });

    it('should return filter endpoint for Filter resource', () => {
      expect(getResourceValidationEndpoint(5, 'filter-123')).toBe('/filter/filter-123');
    });

    it('should return process definition endpoint for Process Definition resource', () => {
      expect(getResourceValidationEndpoint(6, 'process:1:abc')).toBe('/process-definition/process%3A1%3Aabc');
    });

    it('should return process instance endpoint for Process Instance resource', () => {
      expect(getResourceValidationEndpoint(8, 'instance-123')).toBe('/process-instance/instance-123');
    });

    it('should return deployment endpoint for Deployment resource', () => {
      expect(getResourceValidationEndpoint(9, 'deploy-123')).toBe('/deployment/deploy-123');
    });

    it('should return decision definition endpoint for Decision Definition resource', () => {
      expect(getResourceValidationEndpoint(10, 'decision-123')).toBe('/decision-definition/decision-123');
    });

    it('should return tenant endpoint for Tenant resource', () => {
      expect(getResourceValidationEndpoint(11, 'tenant-123')).toBe('/tenant/tenant-123');
    });

    it('should return batch endpoint for Batch resource', () => {
      expect(getResourceValidationEndpoint(13, 'batch-123')).toBe('/batch/batch-123');
    });

    it('should return decision requirements definition endpoint', () => {
      expect(getResourceValidationEndpoint(14, 'drd-123')).toBe('/decision-requirements-definition/drd-123');
    });

    it('should return historic process instance endpoint', () => {
      expect(getResourceValidationEndpoint(20, 'hist-inst-123')).toBe('/history/process-instance/hist-inst-123');
    });

    it('should return null for Application resource (not validatable)', () => {
      expect(getResourceValidationEndpoint(0, 'app-id')).toBeNull();
    });

    it('should return null for Group Membership resource (not validatable)', () => {
      expect(getResourceValidationEndpoint(3, 'membership-id')).toBeNull();
    });

    it('should return null for Task resource (not validatable)', () => {
      expect(getResourceValidationEndpoint(7, 'task-id')).toBeNull();
    });

    it('should return null for Tenant Membership resource (not validatable)', () => {
      expect(getResourceValidationEndpoint(12, 'membership-id')).toBeNull();
    });

    it('should return null for Operation Log resource (not validatable)', () => {
      expect(getResourceValidationEndpoint(17, 'log-id')).toBeNull();
    });

    it('should return null for Historic Task Instance resource (not validatable)', () => {
      expect(getResourceValidationEndpoint(19, 'hist-task-id')).toBeNull();
    });

    it('should return null for System resource (not validatable)', () => {
      expect(getResourceValidationEndpoint(21, 'system-id')).toBeNull();
    });

    it('should properly encode special characters in resource IDs', () => {
      expect(getResourceValidationEndpoint(1, 'user@example.com')).toBe('/user/user%40example.com/profile');
      expect(getResourceValidationEndpoint(6, 'process:1:abc/123')).toBe('/process-definition/process%3A1%3Aabc%2F123');
    });
  });

  describe('deriveCockpitAppUrl', () => {
    it('should convert API admin URL to app cockpit URL', () => {
      expect(deriveCockpitAppUrl('/operaton/api/admin', 'default')).toBe('/operaton/app/cockpit/default/');
    });

    it('should handle URL without trailing slash', () => {
      expect(deriveCockpitAppUrl('/operaton/api/admin', 'default')).toBe('/operaton/app/cockpit/default/');
    });

    it('should handle URL with hash', () => {
      expect(deriveCockpitAppUrl('/operaton/api/admin#/authorization', 'default')).toBe(
        '/operaton/app/cockpit/default/'
      );
    });

    it('should handle different engine names', () => {
      expect(deriveCockpitAppUrl('/operaton/api/admin', 'myengine')).toBe('/operaton/app/cockpit/myengine/');
    });

    it('should handle null admin URL', () => {
      expect(deriveCockpitAppUrl(null, 'default')).toBeNull();
    });

    it('should handle undefined admin URL', () => {
      expect(deriveCockpitAppUrl(undefined, 'default')).toBeNull();
    });

    it('should handle null engine name', () => {
      expect(deriveCockpitAppUrl('/operaton/api/admin', null)).toBeNull();
    });

    it('should handle undefined engine name', () => {
      expect(deriveCockpitAppUrl('/operaton/api/admin', undefined)).toBeNull();
    });

    it('should handle malformed URL', () => {
      expect(deriveCockpitAppUrl('invalid', 'default')).toBeNull();
    });
  });

  describe('deriveTasklistAppUrl', () => {
    it('should convert API admin URL to app tasklist URL', () => {
      expect(deriveTasklistAppUrl('/operaton/api/admin', 'default')).toBe('/operaton/app/tasklist/default/');
    });

    it('should handle different engine names', () => {
      expect(deriveTasklistAppUrl('/operaton/api/admin', 'myengine')).toBe('/operaton/app/tasklist/myengine/');
    });

    it('should handle null admin URL', () => {
      expect(deriveTasklistAppUrl(null, 'default')).toBeNull();
    });

    it('should handle null engine name', () => {
      expect(deriveTasklistAppUrl('/operaton/api/admin', null)).toBeNull();
    });
  });

  describe('containsUUID', () => {
    it('should return true for strings with UUID v4', () => {
      expect(containsUUID('7e8a5c52-0297-11f1-8b4a-9a89236531ce')).toBe(true);
      expect(containsUUID('process:1:7e8a5c52-0297-11f1-8b4a-9a89236531ce')).toBe(true);
      expect(containsUUID('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    });

    it('should return true for strings with UUID v1', () => {
      expect(containsUUID('c56a4180-65aa-11ed-9022-0242ac120002')).toBe(true);
    });

    it('should return false for keys without UUIDs', () => {
      expect(containsUUID('my-process')).toBe(false);
      expect(containsUUID('invoice-process')).toBe(false);
      expect(containsUUID('simple')).toBe(false);
      expect(containsUUID('test_123')).toBe(false);
    });

    it('should return false for wildcards', () => {
      expect(containsUUID('*')).toBe(false);
    });

    it('should return false for null', () => {
      expect(containsUUID(null)).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(containsUUID('')).toBe(false);
    });

    it('should be case-insensitive', () => {
      expect(containsUUID('7E8A5C52-0297-11F1-8B4A-9A89236531CE')).toBe(true);
      expect(containsUUID('process:1:7E8A5C52-0297-11F1-8B4A-9A89236531CE')).toBe(true);
    });
  });

  describe('isProcessDefinitionKey', () => {
    it('should return true for keys without version info or UUID', () => {
      expect(isProcessDefinitionKey('my-process')).toBe(true);
      expect(isProcessDefinitionKey('invoice-process')).toBe(true);
      expect(isProcessDefinitionKey('simple')).toBe(true);
    });

    it('should return false for IDs with version info', () => {
      expect(isProcessDefinitionKey('my-process:1:abc123')).toBe(false);
      expect(isProcessDefinitionKey('invoice:2:def456')).toBe(false);
      expect(isProcessDefinitionKey('process:10:xyz789')).toBe(false);
    });

    it('should return false for IDs containing UUIDs', () => {
      expect(isProcessDefinitionKey('process:1:7e8a5c52-0297-11f1-8b4a-9a89236531ce')).toBe(false);
      expect(isProcessDefinitionKey('7e8a5c52-0297-11f1-8b4a-9a89236531ce')).toBe(false);
    });

    it('should return false for wildcards', () => {
      expect(isProcessDefinitionKey('*')).toBe(false);
    });

    it('should return false for null', () => {
      expect(isProcessDefinitionKey(null)).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isProcessDefinitionKey('')).toBe(false);
    });

    it('should handle keys with hyphens and underscores', () => {
      expect(isProcessDefinitionKey('my_process-v2')).toBe(true);
      expect(isProcessDefinitionKey('test_123')).toBe(true);
    });
  });
});
