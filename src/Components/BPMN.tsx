import ModelingModule from 'bpmn-js/lib/features/modeling';
import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';
import camundaPlatformBehaviors from 'camunda-bpmn-js-behaviors/lib/camunda-platform';
import camundaModdle from 'camunda-bpmn-moddle/resources/camunda.json';
import tooltips from 'diagram-js/lib/features/tooltips';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import RobotModule from '../RobotModule';
import { Canvas, OverlayManager } from '../services/ViewerService';
import { HistoricActivityInstance } from '../types';
import { clearSequenceFlow, renderSequenceFlow, renderActivities } from '../utils/bpmn';
import { ZOOM_INCREMENT, ZOOM_RESET_DELAY_INITIAL_MS, ZOOM_RESET_DELAY_FINAL_MS } from '../utils/constants';
import ResetZoomButton from './ResetZoomButton';
import { ToggleHistoryViewButton } from './ToggleHistoryViewButton';
import { ToggleSequenceFlowButton } from './ToggleSequenceFlowButton';
import { ViewerButtonsPortal } from './ViewerButtonsPortal';
import ZoomInButton from './ZoomInButton';
import ZoomOutButton from './ZoomOutButton';

/** Type for module declarations used by BpmnViewer */
type ModuleDeclaration = Record<string, unknown>;

/** Interface for BPMN viewer instance */
interface BpmnViewerInstance {
  _container: HTMLElement;
  get: (serviceName: string) => unknown;
  attachTo: (element: HTMLElement) => void;
  importXML: (xml: string) => Promise<{ warnings: string[] }>;
}

/**
 * Creates a BPMN viewer instance with the given diagram XML.
 * Configures the viewer with Camunda platform behaviors, tooltips, and modeling module.
 * @param diagram - The BPMN 2.0 XML string to display
 * @returns Promise resolving to the configured BpmnViewer instance
 */
export const createBPMNViewer = async (diagram: string): Promise<BpmnViewerInstance> => {
  const additionalModules: ModuleDeclaration[] = [
    camundaPlatformBehaviors as ModuleDeclaration,
    RobotModule as ModuleDeclaration,
    tooltips as ModuleDeclaration,
    ModelingModule as ModuleDeclaration,
  ];
  const model = new BpmnViewer({
    additionalModules,
    moddleExtensions: {
      camunda: camundaModdle,
    },
  }) as unknown as BpmnViewerInstance;
  try {
    await model.importXML(diagram);
  } catch {
    // nothing we can do
  }
  return model;
};

/** Props for the BPMNViewer component */
interface Props {
  /** Array of activities to highlight on the diagram */
  activities?: HistoricActivityInstance[];
  /** Additional CSS class name */
  className?: string;
  /** BPMN 2.0 XML diagram content */
  diagramXML: string;
  /** Inline styles for the viewer container */
  style?: Record<string, string | number>;
  /** Whether to show the runtime/history toggle button */
  showRuntimeToggle: boolean;
  /** Whether the activity history was truncated, making the drawn path incomplete */
  activitiesTruncated?: boolean;
}

/**
 * BPMN diagram viewer component.
 * Renders a navigable BPMN diagram with zoom controls, overlays, and sequence flow highlights.
 * Reactively clears and redraws overlays and active sequence flows when activities change.
 */
const BPMNViewer: React.FC<Props> = ({
  activities,
  className,
  diagramXML,
  style,
  showRuntimeToggle,
  activitiesTruncated = false,
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [viewer, setViewer] = useState<BpmnViewerInstance | null>(null);
  const isSequenceFlowActiveRef = useRef(false);
  const sequenceFlowRef = useRef<SVGElement[]>([]);
  const activitiesRef = useRef(activities);
  activitiesRef.current = activities;
  const activitiesTruncatedRef = useRef(activitiesTruncated);
  activitiesTruncatedRef.current = activitiesTruncated;

  useEffect(() => {
    let isCancelled = false;
    const currentElement = ref.current;

    const executeViewerSetup = async (): Promise<void> => {
      if ((ref.current?.clientHeight ?? 0) > 0) {
        const newViewer = await createBPMNViewer(diagramXML);
        if (isCancelled) {
          return;
        }
        if (ref.current) {
          ref.current.innerHTML = '';
          newViewer.attachTo(ref.current);
        }

        const canvas = newViewer.get('canvas') as Canvas;
        // Reset zoom multiple times to handle rendering timing issues:
        // Once immediately, once after microtask, once with requestAnimationFrame,
        // and twice more with delays to ensure proper fit after all rendering completes
        const resetZoom = (): void => {
          canvas.zoom('fit-viewport', { x: 0, y: 0 });
          canvas.scroll({ dx: 0, dy: 0 });
        };
        resetZoom();
        setTimeout(resetZoom, 0);
        requestAnimationFrame(resetZoom);
        setTimeout(resetZoom, ZOOM_RESET_DELAY_INITIAL_MS);
        setTimeout(resetZoom, ZOOM_RESET_DELAY_FINAL_MS);

        setViewer(newViewer);
      }
    };

    const observer = new ResizeObserver(() => {
      if ((ref.current?.clientHeight ?? 0) > 0) {
        void executeViewerSetup();
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      }
    });

    if (currentElement) {
      observer.observe(currentElement);
      if (currentElement.clientHeight > 0) {
        void executeViewerSetup();
        observer.unobserve(currentElement);
      }
    }

    return () => {
      isCancelled = true;
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [diagramXML]);

  // Clean up sequence flow when viewer changes or unmounts
  useEffect(() => {
    return () => {
      clearSequenceFlow(sequenceFlowRef.current);
      sequenceFlowRef.current = [];
    };
  }, [viewer]);

  // Re-render overlays and sequence flows whenever viewer, activities, or activitiesTruncated changes
  useEffect(() => {
    if (!viewer) {
      return;
    }

    const overlays = viewer.get('overlays') as OverlayManager | undefined;
    overlays?.clear();
    renderActivities(viewer, activities ?? []);

    if (isSequenceFlowActiveRef.current) {
      clearSequenceFlow(sequenceFlowRef.current);
      sequenceFlowRef.current = renderSequenceFlow(viewer, activities ?? [], { truncated: activitiesTruncated });
    }
  }, [viewer, activities, activitiesTruncated]);

  const handleToggleSequenceFlow = useCallback(
    (value: boolean): void => {
      isSequenceFlowActiveRef.current = value;
      if (!value) {
        clearSequenceFlow(sequenceFlowRef.current);
        sequenceFlowRef.current = [];
        return;
      }
      if (viewer && sequenceFlowRef.current.length === 0) {
        sequenceFlowRef.current = renderSequenceFlow(viewer, activitiesRef.current ?? [], {
          truncated: activitiesTruncatedRef.current,
        });
      }
    },
    [viewer]
  );

  return (
    <div className={className} ref={ref} style={style}>
      {viewer !== null ? (
        <ViewerButtonsPortal viewer={viewer} position={{ right: '15px', top: '15px', bottom: '45px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%', pointerEvents: 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', pointerEvents: 'auto' }}>
              <ToggleSequenceFlowButton partial={activitiesTruncated} onToggleSequenceFlow={handleToggleSequenceFlow} />
              {showRuntimeToggle ? (
                <ToggleHistoryViewButton
                  onToggleHistoryView={(value: boolean): void => {
                    if (!value) {
                      const hash = window.location.hash;
                      const hashPart = hash !== '' ? hash.split('?')[0] : '';
                      const basePath = window.location.href.split('#')[0] ?? '';
                      const newHash =
                        hashPart !== undefined && hashPart !== ''
                          ? hashPart.replace(/^#\/history\/process-instance/, '#/process-instance')
                          : '';
                      window.location.href = `${basePath}${newHash}`;
                    }
                  }}
                  initial
                />
              ) : null}
            </div>
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', pointerEvents: 'auto' }}>
              <ResetZoomButton
                onResetZoom={(): void => {
                  const canvas = viewer.get('canvas') as Canvas;
                  canvas.zoom('fit-viewport', { x: 0, y: 0 });
                  canvas.scroll({ dx: 0, dy: 0 });
                }}
              />
              <ZoomInButton
                onZoomIn={(): number => {
                  const canvas = viewer.get('canvas') as Canvas;
                  return canvas.zoom(canvas.zoom() + ZOOM_INCREMENT);
                }}
              />
              <ZoomOutButton
                onZoomOut={(): number => {
                  const canvas = viewer.get('canvas') as Canvas;
                  return canvas.zoom(canvas.zoom() - ZOOM_INCREMENT);
                }}
              />
            </div>
          </div>
        </ViewerButtonsPortal>
      ) : null}
    </div>
  );
};

export default BPMNViewer;
export { BPMNViewer as BPMN };
