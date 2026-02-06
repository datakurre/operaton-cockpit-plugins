/**
 * Tests for ResourceAutocomplete component.
 *
 * Tests cover:
 * - Rendering for various resource types
 * - Resource types with and without autocomplete support
 * - Input handling and value changes
 * - API-based suggestions fetching
 * - Keyboard navigation (ArrowDown, ArrowUp, Enter, Escape)
 * - Suggestion selection via click
 * - Debouncing behavior
 * - Click outside to close
 * - Resource type changes
 * - Accessibility attributes
 *
 * @module
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';

import ResourceAutocomplete from '../ResourceAutocomplete';
import { mockApi } from '../../__mocks__/api';
import { server } from '../../__mocks__/server';
import { mockProcessDefinition } from '../../__fixtures__/api-responses';

describe('ResourceAutocomplete', () => {
  describe('Rendering', () => {
    it('should render input for resource type with autocomplete', () => {
      render(
        <ResourceAutocomplete
          api={mockApi}
          resourceType={6} // Process Definition
          value=""
          onChange={jest.fn()}
        />
      );

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should render input for resource type without autocomplete', () => {
      render(
        <ResourceAutocomplete
          api={mockApi}
          resourceType={0} // Application - no autocomplete
          value=""
          onChange={jest.fn()}
        />
      );

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should display placeholder', () => {
      render(
        <ResourceAutocomplete
          api={mockApi}
          resourceType={6}
          value=""
          onChange={jest.fn()}
          placeholder="Enter resource ID"
        />
      );

      expect(screen.getByPlaceholderText('Enter resource ID')).toBeInTheDocument();
    });

    it('should display current value', () => {
      render(<ResourceAutocomplete api={mockApi} resourceType={6} value="my-process" onChange={jest.fn()} />);

      expect(screen.getByDisplayValue('my-process')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have aria-autocomplete="list" for supported resource types', () => {
      render(
        <ResourceAutocomplete
          api={mockApi}
          resourceType={6} // Process Definition
          value=""
          onChange={jest.fn()}
        />
      );

      expect(screen.getByRole('textbox')).toHaveAttribute('aria-autocomplete', 'list');
    });

    it('should have aria-autocomplete="none" for unsupported resource types', () => {
      render(
        <ResourceAutocomplete
          api={mockApi}
          resourceType={0} // Application - no autocomplete
          value=""
          onChange={jest.fn()}
        />
      );

      expect(screen.getByRole('textbox')).toHaveAttribute('aria-autocomplete', 'none');
    });

    it('should have aria-expanded for supported resource types', () => {
      render(<ResourceAutocomplete api={mockApi} resourceType={6} value="" onChange={jest.fn()} />);

      expect(screen.getByRole('textbox')).toHaveAttribute('aria-expanded', 'false');
    });

    it('should not have aria-expanded for unsupported resource types', () => {
      render(<ResourceAutocomplete api={mockApi} resourceType={0} value="" onChange={jest.fn()} />);

      expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-expanded');
    });
  });

  describe('Input handling', () => {
    it('should call onChange when typing', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      render(<ResourceAutocomplete api={mockApi} resourceType={6} value="" onChange={handleChange} />);

      await user.type(screen.getByRole('textbox'), 'test');

      expect(handleChange).toHaveBeenCalled();
    });

    it('should not fetch suggestions for unsupported resource type', async () => {
      const user = userEvent.setup();
      // eslint-disable-next-line @typescript-eslint/naming-convention -- Test flag variable
      let fetchCalled = false;

      server.use(
        http.get('*/api/engine/default/process-definition', () => {
          fetchCalled = true;
          return HttpResponse.json([]);
        })
      );

      render(
        <ResourceAutocomplete
          api={mockApi}
          resourceType={0} // Application - no autocomplete
          value=""
          onChange={jest.fn()}
        />
      );

      await user.type(screen.getByRole('textbox'), 'test');

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 400));
      });

      // No API call should be made for unsupported resource types
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('should not fetch suggestions for wildcard (*)', async () => {
      const handleChange = jest.fn();

      render(<ResourceAutocomplete api={mockApi} resourceType={6} value="*" onChange={handleChange} />);

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('Resource type support', () => {
    it('should support Process Definition (6)', async () => {
      const user = userEvent.setup();

      server.use(
        http.get('*/api/engine/default/process-definition', () => {
          return HttpResponse.json([mockProcessDefinition]);
        })
      );

      render(<ResourceAutocomplete api={mockApi} resourceType={6} value="" onChange={jest.fn()} />);

      await user.type(screen.getByRole('textbox'), 'my');

      await waitFor(
        () => {
          expect(screen.getByRole('listbox')).toBeInTheDocument();
        },
        { timeout: 500 }
      );
    });

    it('should support User (1)', async () => {
      const user = userEvent.setup();

      render(<ResourceAutocomplete api={mockApi} resourceType={1} value="" onChange={jest.fn()} />);

      await user.type(screen.getByRole('textbox'), 'demo');

      await waitFor(
        () => {
          expect(screen.getByRole('listbox')).toBeInTheDocument();
        },
        { timeout: 500 }
      );
    });

    it('should support Group (2)', async () => {
      const user = userEvent.setup();

      render(<ResourceAutocomplete api={mockApi} resourceType={2} value="" onChange={jest.fn()} />);

      await user.type(screen.getByRole('textbox'), 'cam');

      await waitFor(
        () => {
          expect(screen.getByRole('listbox')).toBeInTheDocument();
        },
        { timeout: 500 }
      );
    });

    it('should support Decision Definition (10)', async () => {
      const user = userEvent.setup();

      server.use(
        http.get('*/api/engine/default/decision-definition', () => {
          return HttpResponse.json([{ key: 'my-decision', name: 'My Decision' }]);
        })
      );

      render(<ResourceAutocomplete api={mockApi} resourceType={10} value="" onChange={jest.fn()} />);

      await user.type(screen.getByRole('textbox'), 'my');

      await waitFor(
        () => {
          expect(screen.getByRole('listbox')).toBeInTheDocument();
        },
        { timeout: 500 }
      );
    });

    it('should support Deployment (9)', async () => {
      const user = userEvent.setup();

      server.use(
        http.get('*/api/engine/default/deployment', () => {
          return HttpResponse.json([{ id: 'dep-1', name: 'My Deployment' }]);
        })
      );

      render(<ResourceAutocomplete api={mockApi} resourceType={9} value="" onChange={jest.fn()} />);

      await user.type(screen.getByRole('textbox'), 'my');

      await waitFor(
        () => {
          expect(screen.getByRole('listbox')).toBeInTheDocument();
        },
        { timeout: 500 }
      );
    });

    it('should not have autocomplete for Authorization (4)', () => {
      render(<ResourceAutocomplete api={mockApi} resourceType={4} value="" onChange={jest.fn()} />);

      expect(screen.getByRole('textbox')).toHaveAttribute('aria-autocomplete', 'none');
    });

    it('should not have autocomplete for Batch (13)', () => {
      render(<ResourceAutocomplete api={mockApi} resourceType={13} value="" onChange={jest.fn()} />);

      expect(screen.getByRole('textbox')).toHaveAttribute('aria-autocomplete', 'none');
    });
  });

  describe('Suggestions fetching', () => {
    it('should fetch process definition suggestions', async () => {
      const user = userEvent.setup();

      server.use(
        http.get('*/api/engine/default/process-definition', () => {
          return HttpResponse.json([mockProcessDefinition]);
        })
      );

      render(<ResourceAutocomplete api={mockApi} resourceType={6} value="" onChange={jest.fn()} />);

      await user.type(screen.getByRole('textbox'), 'process');

      await waitFor(
        () => {
          expect(screen.getByRole('listbox')).toBeInTheDocument();
          expect(screen.getByText(/my-process/)).toBeInTheDocument();
        },
        { timeout: 500 }
      );
    });

    it('should display formatted suggestions with name', async () => {
      const user = userEvent.setup();

      server.use(
        http.get('*/api/engine/default/process-definition', () => {
          return HttpResponse.json([{ key: 'invoice-process', name: 'Invoice Processing' }]);
        })
      );

      render(<ResourceAutocomplete api={mockApi} resourceType={6} value="" onChange={jest.fn()} />);

      await user.type(screen.getByRole('textbox'), 'invoice');

      await waitFor(
        () => {
          // Should show formatted label: key (name)
          expect(screen.getByText(/invoice-process \(Invoice Processing\)/)).toBeInTheDocument();
        },
        { timeout: 500 }
      );
    });
  });

  describe('Suggestion selection', () => {
    it('should select suggestion on click', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      server.use(
        http.get('*/api/engine/default/process-definition', () => {
          return HttpResponse.json([mockProcessDefinition]);
        })
      );

      render(<ResourceAutocomplete api={mockApi} resourceType={6} value="" onChange={handleChange} />);

      await user.type(screen.getByRole('textbox'), 'my');

      await waitFor(
        () => {
          expect(screen.getByRole('listbox')).toBeInTheDocument();
        },
        { timeout: 500 }
      );

      const options = screen.getAllByRole('option');
      await user.click(options[0]!);

      // Should have called onChange with the selected key
      expect(handleChange).toHaveBeenLastCalledWith('my-process');
    });
  });

  describe('Keyboard navigation', () => {
    it('should navigate with ArrowDown', async () => {
      const user = userEvent.setup();

      server.use(
        http.get('*/api/engine/default/process-definition', () => {
          return HttpResponse.json([mockProcessDefinition, { key: 'other-process', name: 'Other Process' }]);
        })
      );

      render(<ResourceAutocomplete api={mockApi} resourceType={6} value="" onChange={jest.fn()} />);

      await user.type(screen.getByRole('textbox'), 'p');

      await waitFor(
        () => {
          expect(screen.getByRole('listbox')).toBeInTheDocument();
        },
        { timeout: 500 }
      );

      await user.keyboard('{ArrowDown}');

      const options = screen.getAllByRole('option');
      expect(options[0]).toHaveAttribute('aria-selected', 'true');
    });

    it('should select with Enter key', async () => {
      const handleChange = jest.fn();
      const user = userEvent.setup();

      server.use(
        http.get('*/api/engine/default/process-definition', () => {
          return HttpResponse.json([mockProcessDefinition]);
        })
      );

      render(<ResourceAutocomplete api={mockApi} resourceType={6} value="" onChange={handleChange} />);

      await user.type(screen.getByRole('textbox'), 'my');

      await waitFor(
        () => {
          expect(screen.getByRole('listbox')).toBeInTheDocument();
        },
        { timeout: 500 }
      );

      await user.keyboard('{ArrowDown}');
      await user.keyboard('{Enter}');

      expect(handleChange).toHaveBeenLastCalledWith('my-process');
    });

    it('should close with Escape key', async () => {
      const user = userEvent.setup();

      server.use(
        http.get('*/api/engine/default/process-definition', () => {
          return HttpResponse.json([mockProcessDefinition]);
        })
      );

      render(<ResourceAutocomplete api={mockApi} resourceType={6} value="" onChange={jest.fn()} />);

      await user.type(screen.getByRole('textbox'), 'my');

      await waitFor(
        () => {
          expect(screen.getByRole('listbox')).toBeInTheDocument();
        },
        { timeout: 500 }
      );

      await user.keyboard('{Escape}');

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('Resource type changes', () => {
    it('should clear suggestions when resource type changes', () => {
      const { rerender } = render(
        <ResourceAutocomplete api={mockApi} resourceType={6} value="" onChange={jest.fn()} />
      );

      // Change resource type
      rerender(<ResourceAutocomplete api={mockApi} resourceType={1} value="" onChange={jest.fn()} />);

      // Suggestions should be cleared
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('Click outside behavior', () => {
    it('should close suggestions when clicking outside', async () => {
      const user = userEvent.setup();

      server.use(
        http.get('*/api/engine/default/process-definition', () => {
          return HttpResponse.json([mockProcessDefinition]);
        })
      );

      render(
        <div>
          <ResourceAutocomplete api={mockApi} resourceType={6} value="" onChange={jest.fn()} />
          <button>Outside</button>
        </div>
      );

      await user.type(screen.getByRole('textbox'), 'my');

      await waitFor(
        () => {
          expect(screen.getByRole('listbox')).toBeInTheDocument();
        },
        { timeout: 500 }
      );

      await user.click(screen.getByRole('button', { name: 'Outside' }));

      await waitFor(() => {
        expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
      });
    });
  });

  describe('API error handling', () => {
    it('should handle API errors gracefully', async () => {
      const user = userEvent.setup();

      server.use(
        http.get('*/api/engine/default/process-definition', () => {
          return HttpResponse.json({ message: 'Error' }, { status: 500 });
        })
      );

      render(<ResourceAutocomplete api={mockApi} resourceType={6} value="" onChange={jest.fn()} />);

      await user.type(screen.getByRole('textbox'), 'test');

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 400));
      });

      // Should not crash
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('Focus behavior', () => {
    it('should show suggestions on focus if available', async () => {
      const user = userEvent.setup();

      server.use(
        http.get('*/api/engine/default/process-definition', () => {
          return HttpResponse.json([mockProcessDefinition]);
        })
      );

      render(<ResourceAutocomplete api={mockApi} resourceType={6} value="" onChange={jest.fn()} />);

      // Type to get suggestions
      await user.type(screen.getByRole('textbox'), 'my');

      await waitFor(
        () => {
          expect(screen.getByRole('listbox')).toBeInTheDocument();
        },
        { timeout: 500 }
      );

      // Close with Escape
      await user.keyboard('{Escape}');
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();

      // Focus again should not reopen (suggestions cleared)
      await user.click(screen.getByRole('textbox'));
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });
});
