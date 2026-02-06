import React, { useState } from 'react';

interface TabProps {
  label: string;
  children: React.ReactNode;
}

export const Tab: React.FC<TabProps> = ({ children }) => {
  return <>{children}</>;
};

interface TabsProps {
  children: React.ReactElement<TabProps>[];
}

export const Tabs: React.FC<TabsProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (index: number): void => {
    setActiveTab(index);
  };

  return (
    <div>
      <ul className="nav nav-tabs" role="tablist">
        {React.Children.map(children, (child, index) => (
          <li className={`nav-item ${index === activeTab ? 'active' : ''}`} key={child.props.label}>
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
        {React.Children.map(children, (child, index) =>
          index === activeTab ? (
            <div className="tab-pane active" role="tabpanel">
              {child}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};
