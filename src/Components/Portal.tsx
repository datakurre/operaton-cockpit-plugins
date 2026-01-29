import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';

/**
 * Props for Portal component
 */
interface PortalProps {
  /** Content to render in the portal */
  children: ReactNode;
  /** DOM node to render the portal into */
  node: Element;
}

/**
 * React portal wrapper component for rendering content into a DOM node.
 * Used to render React components into Cockpit's existing DOM structure.
 *
 * @param props - Component props
 * @param props.children - Content to render in the portal
 * @param props.node - DOM node to render the portal into
 * @returns React portal rendering children into the specified node
 */
const Portal: React.FC<PortalProps> = ({ children, node }) => {
  return ReactDOM.createPortal(children, node);
};

export default Portal;
