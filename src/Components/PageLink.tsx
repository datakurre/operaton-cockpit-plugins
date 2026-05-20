import React, { memo, useCallback } from 'react';

interface Props {
  label: string;
  page: number;
  isActive: boolean;
  isDisabled: boolean;
  onPage: (page: number) => void;
}

/**
 * Single page link component for pagination controls.
 * Memoized to prevent unnecessary re-renders when pagination state changes.
 *
 * @param props - Component props
 * @returns Pagination link element
 */
const PageLink: React.FC<Props> = memo(({ label, page, isDisabled, isActive, onPage }) => {
  const pageClicked = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>): void => {
      e.preventDefault();
      if (!isDisabled) {
        onPage(page);
      }
    },
    [isDisabled, onPage, page]
  );

  return (
    <li role="menuitem" className={`page-item ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`} key={label}>
      <button
        type="button"
        className={`page-link ${isDisabled ? 'disabled' : ''}`}
        onClick={pageClicked}
        disabled={isDisabled}
        style={{ border: 'none', padding: '4px 8px', cursor: isDisabled ? 'default' : 'pointer' }}
      >
        {label}
      </button>
    </li>
  );
});

PageLink.displayName = 'PageLink';

export default PageLink;
