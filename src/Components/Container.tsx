import React from 'react';

const Container: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <div className="ctn-fixed-view" style={{ position: 'absolute', top: '36px', bottom: 0, left: 0, right: 0 }}>
      <div className="ctn-content-container">{children}</div>
    </div>
  );
};

export default Container;
