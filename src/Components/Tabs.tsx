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

  const handleTabClick = (index: number) => {
    setActiveTab(index);
  };

  return (
    <div>
      <ul className="nav nav-tabs">
        {React.Children.map(children, (child, index) => (
          <li className={`nav-item ${index === activeTab ? 'active' : ''}`} key={index}>
            <a
              href="#"
              className="nav-link"
              onClick={e => {
                e.preventDefault();
                handleTabClick(index);
              }}
            >
              {child.props.label}
            </a>
          </li>
        ))}
      </ul>
      <div className="tab-content">
        {React.Children.map(children, (child, index) =>
          index === activeTab ? <div className="tab-pane active">{child}</div> : null
        )}
      </div>
    </div>
  );
};
