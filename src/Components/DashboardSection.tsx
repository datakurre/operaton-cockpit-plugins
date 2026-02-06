import React, { useState } from 'react';

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
}

/**
 * Dashboard section wrapper component that matches AngularJS processes-dashboard structure.
 * Provides collapsible section with consistent styling and states (loading, empty, loaded).
 *
 * @example
 * ```tsx
 * <DashboardSection title="External Tasks" hasData={tasks.length > 0}>
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
}) => {
  const [activeSection, setActiveSection] = useState<boolean>(!initialCollapsed);

  const toggleSection = (): void => {
    setActiveSection(!activeSection);
  };

  return (
    <section className={`processes-dashboard ${!activeSection ? 'section-collapsed' : ''}`}>
      <div className="inner">
        <header>
          <div
            className="row"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 50px 0 15px' }}
          >
            <h1 className="section-title" style={{ margin: 0, flex: 1 }}>
              {title}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {headerActions}
              {onRefresh && (
                <button
                  className="btn btn-default btn-sm"
                  onClick={onRefresh}
                  title="Refresh"
                  disabled={isLoading}
                  style={{ padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <span className="glyphicon glyphicon-refresh" />
                  <span>Refresh</span>
                </button>
              )}
              <button
                className="section-toggle btn btn-link btn-sm"
                onClick={toggleSection}
                title="Toggle this section"
              >
                <span className={`glyphicon ${activeSection ? 'glyphicon-menu-up' : 'glyphicon-menu-down'}`} />
              </button>
            </div>
          </div>
        </header>

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
      </div>
    </section>
  );
};

export default DashboardSection;
