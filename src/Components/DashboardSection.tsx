import React, { useState } from 'react';
import { TbRefresh } from 'react-icons/tb';
import { GoChevronUp, GoChevronDown } from 'react-icons/go';

interface DashboardSectionProps {
  /** Section title */
  title: string;
  /** Section content */
  children: React.ReactNode;
  /** Optional initial collapsed state (default: false) */
  initialCollapsed?: boolean;
  /** Optional loading state */
  isLoading?: boolean;
  /** Optional empty state message */
  emptyMessage?: string;
  /** Whether the section has data (if false, shows empty state) */
  hasData?: boolean;
  /** Optional refresh callback - displays a refresh icon button when provided */
  onRefresh?: () => void;
  /** Optional header actions to display before the refresh button */
  headerActions?: React.ReactNode;
  /**
   * Optional wrapper mode for dashboard sections (default: true for backwards compatibility).
   * When true, wraps content in <section className="processes-dashboard"> and <div className="inner">.
   * Set to false for cockpit.dashboard location which provides its own wrapper.
   */
  useWrapper?: boolean;
}

/**
 * Dashboard section wrapper component for Cockpit dashboard sections.
 * Provides collapsible section with consistent styling and states (loading, empty, loaded).
 *
 * @example
 * ```tsx
 * // With wrapper (for cockpit.route locations like decisions, favourites)
 * <DashboardSection title="External Tasks" hasData={tasks.length > 0}>
 *   <table className="cam-table">...</table>
 * </DashboardSection>
 *
 * // Without wrapper (for cockpit.dashboard location which provides its own wrapper)
 * <DashboardSection title="External Tasks" hasData={tasks.length > 0} useWrapper={false}>
 *   <table className="cam-table">...</table>
 * </DashboardSection>
 * ```
 */
const DashboardSection: React.FC<DashboardSectionProps> = ({
  title,
  children,
  initialCollapsed = false,
  isLoading = false,
  emptyMessage,
  hasData = true,
  onRefresh,
  headerActions,
  useWrapper = true,
}) => {
  const [activeSection, setActiveSection] = useState<boolean>(!initialCollapsed);

  const toggleSection = (): void => {
    setActiveSection(!activeSection);
  };

  const headerContent = (
    <header>
      <div
        className="row"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: useWrapper ? '0 50px 0 15px' : '0 15px 0 15px',
        }}
      >
        {useWrapper ? (
          <h1 className="section-title" style={{ margin: 0, flex: 1 }}>
            {title}
          </h1>
        ) : (
          <div style={{ margin: 0, flex: title ? 1 : 0, fontSize: '14px', fontWeight: 600 }}>{title}</div>
        )}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flex: title ? 'initial' : 1,
            justifyContent: title ? 'initial' : 'flex-end',
          }}
        >
          {headerActions}
          {onRefresh && (
            <button
              className="btn btn-default btn-sm"
              onClick={onRefresh}
              title="Refresh"
              disabled={isLoading}
              style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <TbRefresh aria-hidden="true" />
              <span>Refresh</span>
            </button>
          )}
          <button className="section-toggle btn btn-link btn-sm" onClick={toggleSection} title="Toggle this section">
            {activeSection ? <GoChevronUp aria-hidden="true" /> : <GoChevronDown aria-hidden="true" />}
          </button>
        </div>
      </div>
    </header>
  );

  const contentSection = (
    <>
      {activeSection && (
        <div>
          <div className="cam-widget-loader loader-wrapper">
            {isLoading && (
              <div className="loader-state loading">
                <div>Loading...</div>
              </div>
            )}

            {!isLoading && !hasData && emptyMessage && (
              <div className="loader-state empty">
                <p>{emptyMessage}</p>
              </div>
            )}

            {!isLoading && hasData && (
              <div className="loader-state loaded">
                <div className="cam-widget-loader deployed-processes">
                  <div className="loader-state loaded">{children}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );

  if (useWrapper) {
    return (
      <section className={`processes-dashboard ${!activeSection ? 'section-collapsed' : ''}`}>
        <div className="inner">
          {headerContent}
          {contentSection}
        </div>
      </section>
    );
  }

  return (
    <>
      {headerContent}
      {contentSection}
    </>
  );
};

export default DashboardSection;
