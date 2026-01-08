import ModelingModule from 'bpmn-js/lib/features/modeling';
import BpmnViewer from 'bpmn-js/lib/NavigatedViewer';
import camundaPlatformBehaviors from 'camunda-bpmn-js-behaviors/lib/camunda-platform';
import camundaModdle from 'camunda-bpmn-moddle/resources/camunda.json';
import tooltips from 'diagram-js/lib/features/tooltips';
import React, { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';

import RobotModule from '../RobotModule';
import { clearSequenceFlow, renderSequenceFlow } from '../utils/bpmn';
import ResetZoomButton from './ResetZoomButton';
import { ToggleHistoryViewButton } from './ToggleHistoryViewButton';
import { ToggleSequenceFlowButton } from './ToggleSequenceFlowButton';
import ZoomInButton from './ZoomInButton';
import ZoomOutButton from './ZoomOutButton';

export const BPMNViewer = async (diagram: string) => {
  const model = new BpmnViewer({
    additionalModules: [camundaPlatformBehaviors, RobotModule, tooltips, ModelingModule],
    moddleExtensions: {
      camunda: camundaModdle,
    },
  });
  try {
    await model.importXML(diagram);
  } catch (e) {
    // nothing we can do
  }
  return model;
};

interface Props {
  activities?: any[];
  className?: string;
  diagramXML: string;
  style?: Record<string, string | number>;
  showRuntimeToggle: boolean;
}

const renderActivities = (viewer: any, activities: any[]) => {
  const counter: Record<string, number> = {};
  for (const activity of activities) {
    const id = activity.activityId;
    counter[id] = counter[id] ? counter[id] + 1 : 1;
  }

  const seen: Record<string, boolean> = {};
  const overlays = viewer.get('overlays');
  for (const activity of activities) {
    const id = activity.activityId;
    if (seen[id]) {
      continue;
    } else {
      seen[id] = true;
    }

    const overlay = document.createElement('span');
    overlay.innerText = `${counter[id]}`;
    overlay.className = 'badge';
    overlay.style.cssText = `
   background: lightgray;
   border: 1px solid #143d52;
   color: #143d52;
 `;
    overlays.add(id.split('#')[0], {
      position: {
        bottom: 17,
        right: 10,
      },
      html: overlay,
    });
  }
};

const BPMN: React.FC<Props> = ({ activities, className, diagramXML, style, showRuntimeToggle }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const executeViewerSetup = async () => {
      if (ref.current && ref.current.clientHeight && ref.current.clientHeight > 0) {
        const viewer: any = await BPMNViewer(diagramXML);
        ref.current.innerHTML = '';
        viewer.attachTo(ref.current);

        const canvas = viewer.get('canvas');
        setTimeout(() => {
          canvas.zoom('fit-viewport', 'auto');
          canvas.scroll({ dx: 0, dy: 0 });
        });

        renderActivities(viewer, activities ?? []);

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
        const sequenceFlow: any[] = [];
        createRoot(buttons!).render(
          <React.StrictMode>
            <ToggleSequenceFlowButton
              onToggleSequenceFlow={(value: boolean) => {
                if (value) {
                  if (sequenceFlow.length === 0) {
                    sequenceFlow.splice(0, sequenceFlow.length, ...renderSequenceFlow(viewer, activities ?? []));
                  }
                } else {
                  if (sequenceFlow.length > 0) {
                    clearSequenceFlow(sequenceFlow);
                    sequenceFlow.length = 0;
                  }
                }
              }}
            />
            {showRuntimeToggle ? (
              <ToggleHistoryViewButton
                onToggleHistoryView={(value: boolean) => {
                  if (!value) {
                    window.location.href =
                      window.location.href.split('#')[0] +
                      window.location.hash.split('?')[0].replace(/^#\/history\/process-instance/, '#/process-instance');
                  }
                }}
                initial={true}
              />
            ) : null}
            <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column' }}>
              <ResetZoomButton
                onResetZoom={() => {
                  canvas.zoom('fit-viewport', 'auto');
                  canvas.scroll({ dx: 0, dy: 0 });
                }}
              />
              <ZoomInButton onZoomIn={() => canvas.zoom(canvas.zoom() + 0.1)} />
              <ZoomOutButton onZoomOut={() => canvas.zoom(canvas.zoom() - 0.1)} />
            </div>
          </React.StrictMode>
        );
      }
    };

    const observer = new ResizeObserver(() => {
      if (ref.current?.clientHeight || 0 > 0) {
        setTimeout(executeViewerSetup);
        if (ref.current) {
          observer.unobserve(ref.current);
        }
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }
  }, [diagramXML]);

  return <div className={className} ref={ref} style={style} />;
};

export default BPMN;
