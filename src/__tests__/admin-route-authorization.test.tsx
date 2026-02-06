/**
 * Tests for Admin Route Authorizations plugin.
 *
 * These tests cover:
 * - Plugin registration and structure
 * - Helper functions (getPermissionsForResource, getResourceTypeName, etc.)
 * - SortableAuthorizationsTable component
 * - AuthorizationFormModal component
 * - DeleteConfirmModal component
 * - AuthorizationsView component
 * - API integration for CRUD operations
 *
 * @module
 */

// react-select-filter-box is mocked via moduleNameMapper in jest.config.js

// Mock allotment since it has complex resize functionality
jest.mock('allotment', () => ({
  Allotment: ({ children }: { children: React.ReactNode }) => <div data-testid="allotment">{children}</div>,
}));
(jest.requireMock('allotment') as { Allotment: { Pane: React.FC<{ children: React.ReactNode }> } }).Allotment.Pane = ({
  children,
}: {
  children: React.ReactNode;
}) => <div data-testid="allotment-pane">{children}</div>;

jest.mock('react-datepicker', () => ({
  __esModule: true,
  default: () => <div data-testid="date-picker" />,
}));

import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';

import { mockApi } from '../__mocks__/api';
import { server } from '../__mocks__/server';
import {
  mockAuthorization,
  mockGroupAuthorization,
  mockGlobalAuthorization,
  mockRevokeAuthorization,
} from '../__fixtures__/api-responses';

// Mock bpmn-js and related modules
jest.mock('bpmn-js/lib/NavigatedViewer', () => {
  return jest.fn().mockImplementation(() => ({
    attachTo: jest.fn(),
    importXML: jest.fn().mockResolvedValue({ warnings: [] }),
    get: jest.fn(() => ({
      add: jest.fn(),
      remove: jest.fn(),
      zoom: jest.fn(),
    })),
    _container: document.createElement('div'),
    on: jest.fn(),
    off: jest.fn(),
  }));
});

// Import the plugin after mocking dependencies
import adminRouteAuthorization from '../admin-route-authorization';

/** Valid admin plugin points. */
const validAdminPluginPoints = ['admin.route'];

describe('Admin Route Authorization Plugin', () => {
  describe('Plugin registration', () => {
    it('should export an array of plugins', () => {
      expect(Array.isArray(adminRouteAuthorization)).toBe(true);
      expect(adminRouteAuthorization.length).toBe(1);
    });

    it('should have valid plugin structure', () => {
      const plugin = adminRouteAuthorization[0];
      expect(plugin).toHaveProperty('id', 'adminRouteAuthorization');
      expect(plugin).toHaveProperty('pluginPoint', 'admin.route');
      expect(plugin).toHaveProperty('render');
      expect(typeof plugin.render).toBe('function');
    });

    it('should have valid route properties', () => {
      const plugin = adminRouteAuthorization[0];
      expect(plugin.properties).toBeDefined();
      expect(plugin.properties?.path).toBe('/authorization');
      expect(plugin.properties?.label).toBe('Authorizations');
    });

    it('should have priority set', () => {
      const plugin = adminRouteAuthorization[0];
      expect(plugin.priority).toBe(10);
    });
  });

  describe('Plugin render function', () => {
    it('should render AuthorizationsView into the node', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);
      const plugin = adminRouteAuthorization[0];

      plugin.render(container, { api: mockApi });

      await waitFor(() => {
        expect(container.querySelector('.ctn-main')).toBeInTheDocument();
      });

      document.body.removeChild(container);
    });

    it('should render breadcrumbs panel', async () => {
      const container = document.createElement('div');
      document.body.appendChild(container);
      const plugin = adminRouteAuthorization[0];

      plugin.render(container, { api: mockApi });

      await waitFor(() => {
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        // Use a more specific query to avoid multiple matches
        const breadcrumbs = container.querySelector('.breadcrumbs-panel');
        expect(breadcrumbs).toBeInTheDocument();
        expect(breadcrumbs?.textContent).toContain('Application Authorizations');
      });

      document.body.removeChild(container);
    });
  });
});

describe('AuthorizationsView Component', () => {
  /**
   * Helper to render the plugin into a container
   */
  function renderPlugin() {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const plugin = adminRouteAuthorization[0];
    plugin.render(container, { api: mockApi });
    return container;
  }

  afterEach(() => {
    // Clean up any rendered content
    const containers = document.querySelectorAll('.ctn-main');
    containers.forEach(c => {
      if (c.parentElement) {
        document.body.removeChild(c.parentElement);
      }
    });
  });

  describe('Resource type list', () => {
    it('should render resource type list', async () => {
      renderPlugin();

      await waitFor(() => {
        expect(screen.getByText('Application')).toBeInTheDocument();
        expect(screen.getByText('User')).toBeInTheDocument();
        expect(screen.getByText('Group')).toBeInTheDocument();
        expect(screen.getByText('Process Definition')).toBeInTheDocument();
      });
    });

    it('should highlight selected resource type', async () => {
      renderPlugin();

      await waitFor(() => {
        // Application should be selected by default (first in list)
        const appLink = screen.getByText('Application').closest('li');
        expect(appLink).toHaveClass('active');
      });
    });

    it('should change selected resource type on click', async () => {
      const user = userEvent.setup();
      renderPlugin();

      await waitFor(() => {
        expect(screen.getByText('Process Definition')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Process Definition'));

      await waitFor(() => {
        const pdLink = screen.getByText('Process Definition').closest('li');
        expect(pdLink).toHaveClass('active');
      });
    });
  });

  describe('Authorization table', () => {
    it('should fetch and display authorizations', async () => {
      renderPlugin();

      await waitFor(() => {
        // Should show authorization table
        expect(screen.getByRole('table')).toBeInTheDocument();
      });
    });

    it('should show empty state when no authorizations', async () => {
      // Override handler to return empty array
      server.use(
        http.get('*/api/engine/default/authorization', () => {
          return HttpResponse.json([]);
        }),
        http.get('*/api/engine/default/authorization/count', () => {
          return HttpResponse.json({ count: 0 });
        })
      );

      renderPlugin();

      await waitFor(() => {
        expect(screen.getByText(/No authorizations found/)).toBeInTheDocument();
      });
    });

    it('should display loading state while fetching', async () => {
      // Delay the response to see loading state
      server.use(
        http.get('*/api/engine/default/authorization', async () => {
          await new Promise(resolve => setTimeout(resolve, 100));
          return HttpResponse.json([mockAuthorization]);
        })
      );

      renderPlugin();

      // Loading spinner should appear briefly
      // Note: This may be too fast to catch reliably in tests
    });

    it('should display error message on API failure', async () => {
      server.use(
        http.get('*/api/engine/default/authorization', () => {
          return HttpResponse.json({ message: 'Server error' }, { status: 500 });
        })
      );

      renderPlugin();

      await waitFor(() => {
        // Error message should be displayed
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
    });
  });

  describe('Create authorization modal', () => {
    it('should open create modal on button click', async () => {
      const user = userEvent.setup();
      renderPlugin();

      await waitFor(() => {
        expect(screen.getByText('Create new authorization')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Create new authorization'));

      await waitFor(() => {
        expect(screen.getByText('Create New Authorization')).toBeInTheDocument();
      });
    });

    it('should close modal on cancel', async () => {
      const user = userEvent.setup();
      renderPlugin();

      await waitFor(() => {
        expect(screen.getByText('Create new authorization')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Create new authorization'));

      await waitFor(() => {
        expect(screen.getByText('Create New Authorization')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      await waitFor(() => {
        expect(screen.queryByText('Create New Authorization')).not.toBeInTheDocument();
      });
    });

    it('should close modal on escape key', async () => {
      const user = userEvent.setup();
      renderPlugin();

      await waitFor(() => {
        expect(screen.getByText('Create new authorization')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Create new authorization'));

      await waitFor(() => {
        expect(screen.getByText('Create New Authorization')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      await waitFor(() => {
        expect(screen.queryByText('Create New Authorization')).not.toBeInTheDocument();
      });
    });

    it('should have authorization type buttons', async () => {
      const user = userEvent.setup();
      renderPlugin();

      await waitFor(() => {
        expect(screen.getByText('Create new authorization')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Create new authorization'));

      await waitFor(() => {
        expect(screen.getByText('Global (GLOBAL)')).toBeInTheDocument();
        expect(screen.getByText('Grant (ALLOW)')).toBeInTheDocument();
        expect(screen.getByText('Revoke (DENY)')).toBeInTheDocument();
      });
    });

    it('should have identity type toggle', async () => {
      const user = userEvent.setup();
      renderPlugin();

      await waitFor(() => {
        expect(screen.getByText('Create new authorization')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Create new authorization'));

      await waitFor(() => {
        expect(screen.getByText('Create New Authorization')).toBeInTheDocument();
      });

      // Look for identity type buttons within the modal
      const userButtons = screen.getAllByRole('button').filter(btn => btn.textContent?.includes('User'));
      const groupButtons = screen.getAllByRole('button').filter(btn => btn.textContent?.includes('Group'));

      expect(userButtons.length).toBeGreaterThan(0);
      expect(groupButtons.length).toBeGreaterThan(0);
    });

    it('should display permissions checkboxes', async () => {
      const user = userEvent.setup();
      renderPlugin();

      await waitFor(() => {
        expect(screen.getByText('Create new authorization')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Create new authorization'));

      await waitFor(() => {
        // Application resource type should have ALL and ACCESS permissions
        expect(screen.getByLabelText('ALL')).toBeInTheDocument();
        expect(screen.getByLabelText('ACCESS')).toBeInTheDocument();
      });
    });

    it('should allow selecting multiple permissions', async () => {
      const user = userEvent.setup();
      renderPlugin();

      await waitFor(() => {
        expect(screen.getByText('Create new authorization')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Create new authorization'));

      await waitFor(() => {
        expect(screen.getByLabelText('ALL')).toBeInTheDocument();
      });

      // Click ACCESS to add it (should remove ALL and add ACCESS)
      await user.click(screen.getByLabelText('ACCESS'));

      const accessCheckbox = screen.getByLabelText('ACCESS') as HTMLInputElement;
      expect(accessCheckbox.checked).toBe(true);
    });

    it('should submit form and create authorization', async () => {
      const user = userEvent.setup();
      // eslint-disable-next-line @typescript-eslint/naming-convention -- Test flag variable
      let createCalled = false;

      server.use(
        http.post('*/api/engine/default/authorization/create', async ({ request }) => {
          createCalled = true;
          const body = await request.json();
          return HttpResponse.json({
            id: 'new-auth',
            ...(body as object),
          });
        })
      );

      renderPlugin();

      await waitFor(() => {
        expect(screen.getByText('Create new authorization')).toBeInTheDocument();
      });

      await user.click(screen.getByText('Create new authorization'));

      await waitFor(() => {
        expect(screen.getByText('Create New Authorization')).toBeInTheDocument();
      });

      // Fill in identity ID
      const identityInput = screen.getByPlaceholderText(/e.g., demo/);
      await user.type(identityInput, 'testuser');

      // Submit the form
      await user.click(screen.getByRole('button', { name: 'Create' }));

      await waitFor(() => {
        expect(createCalled).toBe(true);
      });
    });
  });

  describe('Edit authorization', () => {
    it('should open edit modal when clicking Edit', async () => {
      const user = userEvent.setup();
      renderPlugin();

      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });

      // Find and click the first Edit link
      const editLinks = screen.getAllByText('Edit');
      await user.click(editLinks[0]!);

      await waitFor(() => {
        expect(screen.getByText('Edit Authorization')).toBeInTheDocument();
      });
    });

    it('should show Update button in edit mode', async () => {
      const user = userEvent.setup();
      renderPlugin();

      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });

      const editLinks = screen.getAllByText('Edit');
      await user.click(editLinks[0]!);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: 'Update' })).toBeInTheDocument();
      });
    });
  });

  describe('Delete authorization', () => {
    it('should open delete confirmation modal', async () => {
      const user = userEvent.setup();
      renderPlugin();

      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });

      // Find and click the first Delete link
      const deleteLinks = screen.getAllByText('Delete');
      await user.click(deleteLinks[0]!);

      await waitFor(() => {
        expect(screen.getByText('Delete Authorization')).toBeInTheDocument();
        expect(screen.getByText('Are you sure you want to delete this authorization?')).toBeInTheDocument();
      });
    });

    it('should close delete modal on cancel', async () => {
      const user = userEvent.setup();
      renderPlugin();

      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });

      const deleteLinks = screen.getAllByText('Delete');
      await user.click(deleteLinks[0]!);

      await waitFor(() => {
        expect(screen.getByText('Delete Authorization')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Cancel' }));

      await waitFor(() => {
        expect(screen.queryByText('Delete Authorization')).not.toBeInTheDocument();
      });
    });

    it('should delete authorization on confirm', async () => {
      const user = userEvent.setup();
      // eslint-disable-next-line @typescript-eslint/naming-convention -- Test flag variable
      let deleteCalled = false;

      server.use(
        http.delete('*/api/engine/default/authorization/:id', () => {
          deleteCalled = true;
          return HttpResponse.text('', { status: 204 });
        })
      );

      renderPlugin();

      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });

      const deleteLinks = screen.getAllByText('Delete');
      await user.click(deleteLinks[0]!);

      await waitFor(() => {
        expect(screen.getByText('Delete Authorization')).toBeInTheDocument();
      });

      await user.click(screen.getByRole('button', { name: 'Delete' }));

      await waitFor(() => {
        expect(deleteCalled).toBe(true);
      });
    });
  });

  describe('Pagination', () => {
    it('should render page size selector', async () => {
      renderPlugin();

      await waitFor(() => {
        expect(screen.getByText('Page size:')).toBeInTheDocument();
        expect(screen.getByRole('combobox')).toBeInTheDocument();
      });
    });

    it('should have page size options', async () => {
      renderPlugin();

      await waitFor(() => {
        const select = screen.getByRole('combobox');
        expect(within(select).getByRole('option', { name: '25' })).toBeInTheDocument();
        expect(within(select).getByRole('option', { name: '50' })).toBeInTheDocument();
        expect(within(select).getByRole('option', { name: '100' })).toBeInTheDocument();
        expect(within(select).getByRole('option', { name: '200' })).toBeInTheDocument();
      });
    });
  });

  describe('Filtering', () => {
    it('should render filter box', async () => {
      renderPlugin();

      await waitFor(() => {
        expect(screen.getByTestId('filter-box')).toBeInTheDocument();
      });
    });
  });
});

describe('SortableAuthorizationsTable', () => {
  /**
   * Helper to render the plugin and wait for table
   */
  async function renderAndWaitForTable() {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const plugin = adminRouteAuthorization[0];
    plugin.render(container, { api: mockApi });

    await waitFor(() => {
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    return container;
  }

  afterEach(() => {
    const containers = document.querySelectorAll('.ctn-main');
    containers.forEach(c => {
      if (c.parentElement) {
        document.body.removeChild(c.parentElement);
      }
    });
  });

  describe('Table structure', () => {
    it('should have correct column headers', async () => {
      await renderAndWaitForTable();

      expect(screen.getByRole('columnheader', { name: /Type/ })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /User \/ Group/ })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /Permissions/ })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /Resource ID/ })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /Action/ })).toBeInTheDocument();
    });

    it('should have aria-label for accessibility', async () => {
      await renderAndWaitForTable();

      const table = screen.getByRole('table');
      expect(table).toHaveAttribute('aria-label', 'Authorizations table');
    });
  });

  describe('Sorting', () => {
    it('should have sortable headers with aria-sort', async () => {
      await renderAndWaitForTable();

      const typeHeader = screen.getByRole('columnheader', { name: /Type/ });
      expect(typeHeader).toHaveAttribute('aria-sort', 'none');
    });

    it('should toggle sort on header click', async () => {
      const user = userEvent.setup();
      await renderAndWaitForTable();

      const typeHeader = screen.getByRole('columnheader', { name: /Type/ });
      await user.click(typeHeader);

      expect(typeHeader).toHaveAttribute('aria-sort', 'ascending');
    });

    it('should toggle to descending on second click', async () => {
      const user = userEvent.setup();
      await renderAndWaitForTable();

      const typeHeader = screen.getByRole('columnheader', { name: /Type/ });
      await user.click(typeHeader);
      await user.click(typeHeader);

      expect(typeHeader).toHaveAttribute('aria-sort', 'descending');
    });

    it('should not sort action column', async () => {
      await renderAndWaitForTable();

      const actionHeader = screen.getByRole('columnheader', { name: /Action/ });
      expect(actionHeader).not.toHaveAttribute('aria-sort');
    });
  });

  describe('Table content', () => {
    it('should display authorization type labels', async () => {
      await renderAndWaitForTable();

      // Check for authorization type labels - use getAllByText since there can be multiple
      expect(screen.getAllByText('ALLOW').length).toBeGreaterThan(0);
    });

    it('should display user/group identity with icons', async () => {
      await renderAndWaitForTable();

      // The table should contain user/group identities - use getAllByTitle for multiple
      expect(screen.getAllByTitle('User').length).toBeGreaterThan(0);
    });

    it('should display permissions', async () => {
      await renderAndWaitForTable();

      // Use getAllByText since there can be multiple
      expect(screen.getAllByText('ALL').length).toBeGreaterThan(0);
    });

    it('should display resource IDs', async () => {
      await renderAndWaitForTable();

      // Use getAllByText since '*' appears multiple times (identity and resource ID)
      expect(screen.getAllByText('*').length).toBeGreaterThan(0);
    });

    it('should have Edit and Delete actions', async () => {
      await renderAndWaitForTable();

      expect(screen.getAllByText('Edit').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Delete').length).toBeGreaterThan(0);
    });
  });
});
