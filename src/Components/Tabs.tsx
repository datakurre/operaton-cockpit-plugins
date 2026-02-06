import React, { useState } from 'react';

interface TabProps {
  label: string;
  children: React.ReactNode;
}

/**
 * Tab component - just a wrapper to hold label and children.
 * The Tabs component extracts these props for rendering.
 */
export const Tab: React.FC<TabProps> = ({ children }) => {
  return <>{children}</>;
};

interface TabsProps {
  children: React.ReactElement<TabProps>[] | React.ReactElement<TabProps>;
}

/**
 * Tabs component matching Cockpit's native tab structure.
 * Renders nav tabs and content panels.
 */
export const Tabs: React.FC<TabsProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  // Normalize children to always be an array
  const tabChildren = React.Children.toArray(children) as React.ReactElement<TabProps>[];

  const handleTabClick = (index: number): void => {
    setActiveTab(index);
  };

  return (
    <div>
      <ul className="nav nav-tabs" role="tablist">
        {tabChildren.map((child, index) => (
          <li className={`nav-item ${index === activeTab ? 'active' : ''}`} key={child.props.label}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid -- Matches Cockpit UI pattern */}
            <a
              href="#"
              className={`nav-link ${index === activeTab ? 'active' : ''}`}
              role="tab"
              aria-selected={index === activeTab}
              onClick={e => {
                e.preventDefault();
                handleTabClick(index);
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleTabClick(index);
                }
              }}
            >
              {child.props.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="tab-content">
        {tabChildren.map((child, index) =>
          index === activeTab ? (
            <div key={child.props.label} className="tab-pane active ctn-tabbed-content ctn-scroll" role="tabpanel">
              {child.props.children}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};
