import type BpmnRenderer from 'bpmn-js/lib/draw/BpmnRenderer';
import type { Shape } from 'bpmn-js/lib/model/Types';
import { getBusinessObject, is, isAny } from 'bpmn-js/lib/util/ModelUtil';
import { isLabel } from 'bpmn-js/lib/util/LabelUtil';
import type EventBus from 'diagram-js/lib/core/EventBus';
import BaseRenderer from 'diagram-js/lib/draw/BaseRenderer';
import inherits from 'inherits-browser';
import { append as svgAppend, attr as svgAttr, create as svgCreate } from 'tiny-svg';

const HIGH_PRIORITY = 1250;
const ICON_SIZE = 18;
const ACTIVITY_ICON_PADDING = 5;

/**
 * Attributes camunda (Camunda 7) and operaton (Operaton) modelers write element-template icons
 * to, checked in this order. zeebe:modelerTemplateIcon (Camunda 8) is intentionally not
 * supported here.
 */
const ICON_PROPERTIES = ['camunda:modelerTemplateIcon', 'operaton:modelerTemplateIcon'];

const ICON_SHAPE_TYPES = [
  'bpmn:BoundaryEvent',
  'bpmn:CallActivity',
  'bpmn:EndEvent',
  'bpmn:IntermediateCatchEvent',
  'bpmn:IntermediateThrowEvent',
  'bpmn:StartEvent',
  'bpmn:Task',

  // specialized subprocess types must be matched before the general bpmn:SubProcess
  'bpmn:AdHocSubProcess',
  'bpmn:Transaction',
  'bpmn:SubProcess',
];

type ShapeHandlers = BpmnRenderer['handlers'];

/** The subset of bpmn-moddle's dynamic element API this renderer needs. */
interface ModdleElement {
  get: (name: string) => unknown;
}

/**
 * bpmn-js renderer drawing element-template icons from camunda:modelerTemplateIcon or
 * operaton:modelerTemplateIcon, falling back to the underlying bpmn-js shape otherwise.
 */
class ElementTemplateIconRenderer {
  $inject: string[];
  private readonly bpmnRenderer: BpmnRenderer;

  constructor(eventBus: EventBus, bpmnRenderer: BpmnRenderer) {
    this.$inject = [];
    this.bpmnRenderer = bpmnRenderer;
    /* @ts-expect-error BaseRenderer is a constructor-like function that requires this binding */
    BaseRenderer.call(this, eventBus, HIGH_PRIORITY);
  }

  canRender(element: Shape): boolean {
    if (isLabel(element)) {
      return false;
    }
    return isAny(element, ['bpmn:Activity', 'bpmn:Event']) && !!this.getIcon(element);
  }

  getIcon(element: Shape): string | undefined {
    const businessObject = getBusinessObject(element) as ModdleElement;
    return ICON_PROPERTIES.map(property => businessObject.get(property) as string | undefined).find(Boolean);
  }

  drawShape(parentGfx: SVGElement, element: Shape, attrs: Record<string, unknown> = {}): SVGElement {
    const type = ICON_SHAPE_TYPES.find(shapeType => is(element, shapeType));
    const handler = type ? this.bpmnRenderer.handlers[type as keyof ShapeHandlers] : undefined;
    const gfx = handler?.(parentGfx, element, { ...attrs, renderIcon: false }) as SVGElement;

    const icon = this.getIcon(element);
    const padding = is(element, 'bpmn:Activity')
      ? { x: ACTIVITY_ICON_PADDING, y: ACTIVITY_ICON_PADDING }
      : { x: (element.width - ICON_SIZE) / 2, y: (element.height - ICON_SIZE) / 2 };

    const img = svgCreate('image');
    svgAttr(img, { href: icon, width: ICON_SIZE, height: ICON_SIZE, ...padding });
    svgAppend(parentGfx, img);

    return gfx;
  }
}

/**
 * Factory function to create ElementTemplateIconRenderer instances.
 * @param eventBus - The diagram event bus
 * @param bpmnRenderer - The BPMN renderer instance, used to draw the underlying shape
 * @returns A configured ElementTemplateIconRenderer instance
 */
function factory(eventBus: EventBus, bpmnRenderer: BpmnRenderer): ElementTemplateIconRenderer {
  const instance = new ElementTemplateIconRenderer(eventBus, bpmnRenderer);
  inherits(instance, BaseRenderer);
  instance.$inject = ['eventBus', 'bpmnRenderer'];
  return instance;
}

export default factory;
