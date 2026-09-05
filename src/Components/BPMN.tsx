import ModelingModule from 'bpmn-js/lib/features/modeling';
import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';
import camundaPlatformBehaviors from 'camunda-bpmn-js-behaviors/lib/camunda-platform';
import camundaModdle from 'camunda-bpmn-moddle/resources/camunda.json';
import tooltips from 'diagram-js/lib/features/tooltips';
import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

import RobotModule from '../RobotModule';
import { Canvas } from '../services/ViewerService';
import { HistoricActivityInstance } from '../types';
import { clearSequenceFlow, renderSequenceFlow, renderActivities } from '../utils/bpmn';
import { ZOOM_INCREMENT, ZOOM_RESET_DELAY_INITIAL_MS, ZOOM_RESET_DELAY_FINAL_MS } from '../utils/constants';
import ResetZoomButton from './ResetZoomButton';
import { ToggleHistoryViewButton } from './ToggleHistoryViewButton';
import { ToggleSequenceFlowButton } from './ToggleSequenceFlowButton';
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
 * Renders a navigable BPMN diagram with zoom controls and optional history overlays.
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

  useEffect(() => {
    const executeViewerSetup = async (): Promise<void> => {
      if (ref.current?.clientHeight !== undefined && ref.current.clientHeight > 0) {
        const viewer = await createBPMNViewer(diagramXML);
        ref.current.innerHTML = '';
        viewer.attachTo(ref.current);

        const canvas = viewer.get('canvas') as Canvas;
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

        renderActivities(viewer as unknown as BpmnViewerInstance, activities ?? []);

        const buttons = document.createElement('div');
        buttons.style.cssText = `
            display: flex;
            flex-direction: column;
            position: absolute;
            right: 15px;
            top: 15px;
            bottom: 45px;
          `;
        viewer._container.appendChild(buttons);
        // Mutated synchronously so the toggle sees its own last write, StrictMode's
        // double effect run included.
        const sequenceFlow: SVGElement[] = [];
        const handleToggleSequenceFlow = (value: boolean): void => {
          if (!value) {
            clearSequenceFlow(sequenceFlow);
            sequenceFlow.length = 0;
            return;
          }
          if (sequenceFlow.length === 0) {
            const drawn = renderSequenceFlow(viewer, activities ?? [], { truncated: activitiesTruncated });
            sequenceFlow.splice(0, sequenceFlow.length, ...drawn);
          }
        };
        createRoot(buttons).render(
          <React.StrictMode>
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
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column' }}>
              <ResetZoomButton
                onResetZoom={(): void => {
                  canvas.zoom('fit-viewport', { x: 0, y: 0 });
                  canvas.scroll({ dx: 0, dy: 0 });
                }}
              />
              <ZoomInButton onZoomIn={(): number => canvas.zoom(canvas.zoom() + ZOOM_INCREMENT)} />
              <ZoomOutButton onZoomOut={(): number => canvas.zoom(canvas.zoom() - ZOOM_INCREMENT)} />
            </div>
          </React.StrictMode>
        );
      }
    };

    const observer = new ResizeObserver(() => {
      if ((ref.current?.clientHeight ?? 0) > 0) {
        void (async () => {
          await executeViewerSetup();
        })();
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }
    // Note: activities and showRuntimeToggle are intentionally excluded from deps
    // as we only want to set up the viewer when diagramXML changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diagramXML]);

  return <div className={className} ref={ref} style={style} />;
};

export default BPMNViewer;
export { BPMNViewer as BPMN };
