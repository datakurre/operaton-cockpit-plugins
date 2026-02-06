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
}) => {
  const [activeSection, setActiveSection] = useState<boolean>(!initialCollapsed);

  const toggleSection = (): void => {
    setActiveSection(!activeSection);
  };

  return (
    <section className={`processes-dashboard ${!activeSection ? 'section-collapsed' : ''}`}>
      <div className="inner">
        <button className="section-toggle btn btn-link btn-sm" onClick={toggleSection} title="Toggle this section">
          <span className={`glyphicon ${activeSection ? 'glyphicon-menu-up' : 'glyphicon-menu-down'}`} />
        </button>

        <header>
          <div className="row">
            <h1 className="col-xs-6 section-title">{title}</h1>
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
