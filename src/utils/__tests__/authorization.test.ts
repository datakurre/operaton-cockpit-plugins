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
});
