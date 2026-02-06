/**
 * Custom hook for managing pagination state.
 *
 * Provides state management for page navigation, first result calculation,
 * and page change callbacks.
 *
 * @module
 */
import { useState, useCallback, useMemo } from 'react';

import { DEFAULT_PAGE_SIZE } from '../utils/constants';

/**
 * Pagination state returned by usePagination hook.
 */
export interface PaginationState {
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Index of the first result for the current page */
  firstResult: number;
  /** Number of items per page */
  perPage: number;
  /** Total number of pages based on totalItems */
  pageCount: number;
  /** Whether we're on the first page */
  isFirstPage: boolean;
  /** Whether we're on the last page */
  isLastPage: boolean;
}

/**
 * Pagination actions returned by usePagination hook.
 */
export interface PaginationActions {
  /** Go to a specific page */
  goToPage: (page: number) => void;
  /** Go to the next page */
  nextPage: () => void;
  /** Go to the previous page */
  previousPage: () => void;
  /** Go to the first page */
  firstPage: () => void;
  /** Go to the last page */
  lastPage: () => void;
  /** Reset to first page (useful when filters change) */
  reset: () => void;
  /** Update the total items count */
  setTotalItems: (count: number) => void;
}

/**
 * Options for usePagination hook.
 */
export interface UsePaginationOptions {
  /** Number of items per page (default: DEFAULT_PAGE_SIZE) */
  perPage?: number;
  /** Initial total items count */
  initialTotalItems?: number;
  /** Callback when page changes */
  onPageChange?: (firstResult: number, page: number) => void;
}

/**
 * Custom hook for managing pagination state.
 *
 * @param options - Pagination options
 * @returns Pagination state and actions
 *
 * @example
 * ```tsx
 * const { state, actions } = usePagination({
 *   perPage: 25,
 *   onPageChange: (firstResult, page) => {
 *     fetchData({ firstResult, maxResults: 25 });
 *   },
 * });
 *
 * return (
 *   <>
 *     <DataTable items={items} />
 *     <Pagination
 *       currentPage={state.currentPage}
 *       perPage={state.perPage}
 *       total={totalItems}
 *       onPage={actions.goToPage}
 *     />
 *   </>
 * );
 * ```
 */
export function usePagination(options: UsePaginationOptions = {}): {
  state: PaginationState;
  actions: PaginationActions;
} {
  const { perPage = DEFAULT_PAGE_SIZE, initialTotalItems = 0, onPageChange } = options;

  const [currentPage, setCurrentPage] = useState(1);
  const [firstResult, setFirstResult] = useState(0);
  const [totalItems, setTotalItems] = useState(initialTotalItems);

  const pageCount = useMemo(() => {
    return Math.max(1, Math.ceil(totalItems / perPage));
  }, [totalItems, perPage]);

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage >= pageCount;

  const goToPage = useCallback(
    (page: number) => {
      const validPage = Math.max(1, Math.min(page, pageCount));
      const newFirstResult = (validPage - 1) * perPage;
      setCurrentPage(validPage);
      setFirstResult(newFirstResult);
      onPageChange?.(newFirstResult, validPage);
    },
    [pageCount, perPage, onPageChange]
  );

  const nextPage = useCallback(() => {
    if (!isLastPage) {
      goToPage(currentPage + 1);
    }
  }, [currentPage, isLastPage, goToPage]);

  const previousPage = useCallback(() => {
    if (!isFirstPage) {
      goToPage(currentPage - 1);
    }
  }, [currentPage, isFirstPage, goToPage]);

  const firstPageAction = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  const lastPageAction = useCallback(() => {
    goToPage(pageCount);
  }, [goToPage, pageCount]);

  const reset = useCallback(() => {
    setCurrentPage(1);
    setFirstResult(0);
    onPageChange?.(0, 1);
  }, [onPageChange]);

  const state: PaginationState = {
    currentPage,
    firstResult,
    perPage,
    pageCount,
    isFirstPage,
    isLastPage,
  };

  const actions: PaginationActions = {
    goToPage,
    nextPage,
    previousPage,
    firstPage: firstPageAction,
    lastPage: lastPageAction,
    reset,
    setTotalItems,
  };

  return { state, actions };
}

export default usePagination;
