import { is } from 'bpmn-js/lib/util/ModelUtil';
import BPMNModdle from 'bpmn-moddle';
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import inherits from 'inherits-browser';
import { append as svgAppend, create as svgCreate } from 'tiny-svg';

import { RENDER_DELAY_MS } from '../utils/constants';

import Robot from './robot-framework.svg';

/** Event bus interface for BPMN-JS diagram events */
interface EventBus {
  on: (event: string, callback: (...args: unknown[]) => void) => void;
  off: (event: string, callback: (...args: unknown[]) => void) => void;
}

/** BPMN renderer interface with shape handlers */
interface BpmnRenderer {
  handlers: Record<string, (parent: Element, element: BPMNModdle.BaseElement) => SVGElement>;
}

class RobotTaskRenderer {
  $inject: string[];
  private bpmnRenderer: BpmnRenderer;

  constructor(eventBus: EventBus, bpmnRenderer: BpmnRenderer) {
    this.$inject = [];
    this.bpmnRenderer = bpmnRenderer;
    /* @ts-expect-error BaseRenderer is a constructor-like function that requires this binding */
    BaseRenderer.call(this, eventBus, RENDER_DELAY_MS);
  }

  canRender(element: BPMNModdle.BaseElement): boolean {
    return is(element, 'bpmn:ServiceTask') && /robot/i.exec(element.id) !== null;
  }

  drawShape(parent: Element, element: BPMNModdle.BaseElement): SVGElement {
    this.bpmnRenderer.handlers['bpmn:Task']?.(parent, element);
    const gfx = svgCreate('image', {
      x: -1,
      y: -1,
      width: 32, // element.width,
      height: 32, //  element.height,
      href: Robot,
    }) as SVGElement;
    svgAppend(parent, gfx);
    return gfx;
  }
}

/**
 * Factory function to create RobotTaskRenderer instances.
 * @param eventBus - The diagram event bus
 * @param bpmnRenderer - The BPMN renderer instance
 * @returns A configured RobotTaskRenderer instance
 */
function factory(eventBus: EventBus, bpmnRenderer: BpmnRenderer): RobotTaskRenderer {
  const instance = new RobotTaskRenderer(eventBus, bpmnRenderer);
  inherits(instance, BaseRenderer);
  instance.$inject = ['eventBus', 'bpmnRenderer'];
  return instance;
}

export default factory;
