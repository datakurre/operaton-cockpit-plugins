/**
 * Tests for usePagination hook.
 *
 * Tests pagination state management and actions.
 *
 * @module
 */
import { renderHook, act } from '@testing-library/react';
import { usePagination } from '../usePagination';
import { DEFAULT_PAGE_SIZE } from '../../utils/constants';

describe('usePagination', () => {
  describe('initial state', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => usePagination());

      expect(result.current.state.currentPage).toBe(1);
      expect(result.current.state.firstResult).toBe(0);
      expect(result.current.state.perPage).toBe(DEFAULT_PAGE_SIZE);
      expect(result.current.state.pageCount).toBe(1);
      expect(result.current.state.isFirstPage).toBe(true);
      expect(result.current.state.isLastPage).toBe(true);
    });

    it('should use custom perPage value', () => {
      const { result } = renderHook(() => usePagination({ perPage: 25 }));

      expect(result.current.state.perPage).toBe(25);
    });

    it('should initialize with initial total items', () => {
      const { result } = renderHook(() => usePagination({ perPage: 10, initialTotalItems: 100 }));

      expect(result.current.state.pageCount).toBe(10);
      expect(result.current.state.isLastPage).toBe(false);
    });
  });

  describe('goToPage action', () => {
    it('should go to specific page', () => {
      const { result } = renderHook(() => usePagination({ perPage: 10, initialTotalItems: 100 }));

      act(() => {
        result.current.actions.goToPage(5);
      });

      expect(result.current.state.currentPage).toBe(5);
      expect(result.current.state.firstResult).toBe(40);
    });

    it('should clamp to first page when going below 1', () => {
      const { result } = renderHook(() => usePagination({ perPage: 10, initialTotalItems: 100 }));

      act(() => {
        result.current.actions.goToPage(-5);
      });

      expect(result.current.state.currentPage).toBe(1);
      expect(result.current.state.firstResult).toBe(0);
    });

    it('should clamp to last page when going above page count', () => {
      const { result } = renderHook(() => usePagination({ perPage: 10, initialTotalItems: 100 }));

      act(() => {
        result.current.actions.goToPage(100);
      });

      expect(result.current.state.currentPage).toBe(10);
      expect(result.current.state.firstResult).toBe(90);
    });

    it('should call onPageChange callback', () => {
      const onPageChange = jest.fn();
      const { result } = renderHook(() => usePagination({ perPage: 10, initialTotalItems: 100, onPageChange }));

      act(() => {
        result.current.actions.goToPage(3);
      });

      expect(onPageChange).toHaveBeenCalledWith(20, 3);
    });
  });

  describe('nextPage action', () => {
    it('should go to next page', () => {
      const { result } = renderHook(() => usePagination({ perPage: 10, initialTotalItems: 100 }));

      act(() => {
        result.current.actions.nextPage();
      });

      expect(result.current.state.currentPage).toBe(2);
    });

    it('should not go past last page', () => {
      const { result } = renderHook(() => usePagination({ perPage: 10, initialTotalItems: 100 }));

      act(() => {
        result.current.actions.goToPage(10);
      });

      act(() => {
        result.current.actions.nextPage();
      });

      expect(result.current.state.currentPage).toBe(10);
    });
  });

  describe('previousPage action', () => {
    it('should go to previous page', () => {
      const { result } = renderHook(() => usePagination({ perPage: 10, initialTotalItems: 100 }));

      act(() => {
        result.current.actions.goToPage(5);
      });

      act(() => {
        result.current.actions.previousPage();
      });

      expect(result.current.state.currentPage).toBe(4);
    });

    it('should not go before first page', () => {
      const { result } = renderHook(() => usePagination({ perPage: 10, initialTotalItems: 100 }));

      act(() => {
        result.current.actions.previousPage();
      });

      expect(result.current.state.currentPage).toBe(1);
    });
  });

  describe('firstPage action', () => {
    it('should go to first page', () => {
      const { result } = renderHook(() => usePagination({ perPage: 10, initialTotalItems: 100 }));

      act(() => {
        result.current.actions.goToPage(5);
      });

      act(() => {
        result.current.actions.firstPage();
      });

      expect(result.current.state.currentPage).toBe(1);
      expect(result.current.state.firstResult).toBe(0);
    });
  });

  describe('lastPage action', () => {
    it('should go to last page', () => {
      const { result } = renderHook(() => usePagination({ perPage: 10, initialTotalItems: 100 }));

      act(() => {
        result.current.actions.lastPage();
      });

      expect(result.current.state.currentPage).toBe(10);
      expect(result.current.state.firstResult).toBe(90);
    });
  });

  describe('reset action', () => {
    it('should reset to first page', () => {
      const { result } = renderHook(() => usePagination({ perPage: 10, initialTotalItems: 100 }));

      act(() => {
        result.current.actions.goToPage(5);
      });

      expect(result.current.state.currentPage).toBe(5);

      act(() => {
        result.current.actions.reset();
      });

      expect(result.current.state.currentPage).toBe(1);
      expect(result.current.state.firstResult).toBe(0);
    });

    it('should call onPageChange with reset values', () => {
      const onPageChange = jest.fn();
      const { result } = renderHook(() => usePagination({ perPage: 10, initialTotalItems: 100, onPageChange }));

      act(() => {
        result.current.actions.goToPage(5);
      });

      onPageChange.mockClear();

      act(() => {
        result.current.actions.reset();
      });

      expect(onPageChange).toHaveBeenCalledWith(0, 1);
    });
  });

  describe('setTotalItems action', () => {
    it('should update page count when total items changes', () => {
      const { result } = renderHook(() => usePagination({ perPage: 10, initialTotalItems: 100 }));

      expect(result.current.state.pageCount).toBe(10);

      act(() => {
        result.current.actions.setTotalItems(50);
      });

      expect(result.current.state.pageCount).toBe(5);
    });
  });

  describe('boundary state flags', () => {
    it('should have isFirstPage true when on first page', () => {
      const { result } = renderHook(() => usePagination({ perPage: 10, initialTotalItems: 100 }));

      expect(result.current.state.isFirstPage).toBe(true);

      act(() => {
        result.current.actions.goToPage(2);
      });

      expect(result.current.state.isFirstPage).toBe(false);
    });

    it('should have isLastPage true when on last page', () => {
      const { result } = renderHook(() => usePagination({ perPage: 10, initialTotalItems: 100 }));

      expect(result.current.state.isLastPage).toBe(false);

      act(() => {
        result.current.actions.goToPage(10);
      });

      expect(result.current.state.isLastPage).toBe(true);
    });
  });

  describe('page count calculation', () => {
    it('should calculate page count correctly for exact division', () => {
      const { result } = renderHook(() => usePagination({ perPage: 10, initialTotalItems: 50 }));

      expect(result.current.state.pageCount).toBe(5);
    });

    it('should round up for non-exact division', () => {
      const { result } = renderHook(() => usePagination({ perPage: 10, initialTotalItems: 55 }));

      expect(result.current.state.pageCount).toBe(6);
    });

    it('should have at least 1 page even with 0 items', () => {
      const { result } = renderHook(() => usePagination({ perPage: 10, initialTotalItems: 0 }));

      expect(result.current.state.pageCount).toBe(1);
    });
  });
});
