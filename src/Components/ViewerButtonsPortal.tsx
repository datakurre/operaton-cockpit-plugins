/**
 * ViewerButtonsPortal component.
 *
 * Provides a testable abstraction for injecting buttons into the BPMN viewer container.
 * Uses React portals to render content into DOM nodes, making testing easier.
 *
 * @module Components/ViewerButtonsPortal
 */
import React, { useEffect, useState, ReactNode, useMemo } from 'react';
import ReactDOM from 'react-dom';

/**
 * Props for ViewerButtonsPortal component
 */
interface ViewerButtonsPortalProps {
  /** The BPMN viewer instance */
  viewer: BpmnViewer | null;
  /** Position configuration for the button container */
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  /** Children to render in the portal */
  children: ReactNode;
  /** Optional class name for the container */
  className?: string;
}

/**
 * Interface for BPMN viewer to improve testability
 */
export interface BpmnViewer {
  _container: HTMLElement;
  get: (name: string) => unknown;
}

/** Position configuration type for button containers */
interface PositionConfig {
  top?: string | undefined;
  bottom?: string | undefined;
  left?: string | undefined;
  right?: string | undefined;
}

/**
 * Creates a container element for viewer buttons
 * @param position - Position configuration
 * @returns The created container element
 */
function createButtonContainer(position: PositionConfig): HTMLDivElement {
  const container = document.createElement('div');
  container.style.position = 'absolute';
  if (position.top !== undefined) {
    container.style.top = position.top;
  }
  if (position.bottom !== undefined) {
    container.style.bottom = position.bottom;
  }
  if (position.left !== undefined) {
    container.style.left = position.left;
  }
  if (position.right !== undefined) {
    container.style.right = position.right;
  }
  return container;
}

/**
 * ViewerButtonsPortal component.
 *
 * Renders children into a portal attached to the BPMN viewer container.
 * This provides a clean abstraction that is easier to test than direct DOM manipulation.
 *
 * @param props - Component props
 * @param props.viewer - The BPMN viewer instance
 * @param props.position - Position configuration for the container
 * @param props.children - Children to render in the portal
 * @param props.className - Optional CSS class name
 * @returns Portal with rendered children, or null if viewer is not available
 *
 * @example
 * ```tsx
 * <ViewerButtonsPortal
 *   viewer={viewer}
 *   position={{ right: '15px', top: '15px' }}
 * >
 *   <ToggleSequenceFlowButton onToggle={handleToggle} />
 * </ViewerButtonsPortal>
 * ```
 */
export const ViewerButtonsPortal: React.FC<ViewerButtonsPortalProps> = ({ viewer, position, children, className }) => {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  // Memoize position values to prevent infinite re-renders
  const stablePosition = useMemo(
    () => ({ top: position.top, bottom: position.bottom, left: position.left, right: position.right }),
    [position.top, position.bottom, position.left, position.right]
  );

  useEffect(() => {
    if (!viewer) {
      return;
    }

    const buttonContainer = createButtonContainer(stablePosition);
    if (className) {
      buttonContainer.className = className;
    }

    viewer._container.appendChild(buttonContainer);
    setContainer(buttonContainer);

    return () => {
      if (buttonContainer.parentElement) {
        buttonContainer.parentElement.removeChild(buttonContainer);
      }
    };
  }, [viewer, stablePosition, className]);

  if (!container) {
    return null;
  }

  return ReactDOM.createPortal(children, container);
};

/**
 * Hook to manage viewer button container
 * @param viewer - The BPMN viewer instance
 * @param position - Position configuration
 * @returns The container element for rendering buttons
 */
export function useViewerButtonContainer(
  viewer: BpmnViewer | null,
  position: ViewerButtonsPortalProps['position']
): HTMLDivElement | null {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  // Memoize position to prevent infinite re-renders from object comparison
  const stablePosition = useMemo(
    () => ({ top: position.top, bottom: position.bottom, left: position.left, right: position.right }),
    [position.top, position.bottom, position.left, position.right]
  );

  useEffect(() => {
    if (!viewer) {
      setContainer(null);
      return;
    }

    const buttonContainer = createButtonContainer(stablePosition);
    viewer._container.appendChild(buttonContainer);
    setContainer(buttonContainer);

    return () => {
      if (buttonContainer.parentElement) {
        buttonContainer.parentElement.removeChild(buttonContainer);
      }
    };
  }, [viewer, stablePosition]);

  return container;
}

export default ViewerButtonsPortal;
