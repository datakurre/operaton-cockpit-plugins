/**
 * DMN Viewer component with hit highlighting support.
 * @module Components/DmnViewer
 */

import React, { useEffect, useRef } from 'react';
import DmnJsViewer from 'dmn-js';
import type { DmnElement, ActiveView } from 'dmn-js';

export interface DmnViewerProps {
  xml: string;
  onViewReady: (viewer: DmnJsViewer, decision: DmnElement | null) => void;
}

/**
 * Renders a DMN diagram using dmn-js library.
 * Automatically opens the decision table view when available.
 */
const DmnViewer: React.FC<DmnViewerProps> = ({ xml, onViewReady }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<DmnJsViewer | null>(null);

  useEffect(() => {
    if (!containerRef.current || !xml) {
      return;
    }

    const viewer = new DmnJsViewer({
      container: containerRef.current,
    });

    viewerRef.current = viewer;

    viewer
      .importXML(xml)
      .then(() => {
        // Find the decision table view
        const views = viewer.getViews();
        const decisionTableView = views.find((v: ActiveView) => v.type === 'decisionTable');
        if (decisionTableView) {
          return viewer.open(decisionTableView).then(() => {
            onViewReady(viewer, decisionTableView.element);
          });
        } else {
          onViewReady(viewer, null);
          return;
        }
      })
      .catch((err: unknown) => {
        console.error('Failed to import DMN:', err);
      });

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [xml, onViewReady]);

  return <div ref={containerRef} className="dmn-js-parent" style={{ height: '100%', width: '100%' }} />;
};

export default DmnViewer;
