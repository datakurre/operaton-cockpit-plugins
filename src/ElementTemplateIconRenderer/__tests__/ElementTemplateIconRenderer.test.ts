/**
 * Tests for src/ElementTemplateIconRenderer/ElementTemplateIconRenderer.ts
 *
 * @module
 */
import { attr as svgAttr, create as svgCreate } from 'tiny-svg';

import factory from '../ElementTemplateIconRenderer';

interface FakeBusinessObject {
  $instanceOf: (type: string) => boolean;
  get: (name: string) => unknown;
}

interface FakeElement {
  businessObject: FakeBusinessObject;
  width: number;
  height: number;
  labelTarget?: unknown;
}

const makeElement = (types: string[], attrs: Record<string, unknown> = {}): FakeElement => ({
  businessObject: {
    $instanceOf: (type: string) => types.includes(type),
    get: (name: string) => attrs[name],
  },
  width: 100,
  height: 80,
});

const makeEventBus = (): { on: jest.Mock } => ({ on: jest.fn() });

describe('ElementTemplateIconRenderer', () => {
  const makeRenderer = () => factory(makeEventBus() as never, { handlers: {} } as never);

  describe('getIcon', () => {
    it('reads camunda:modelerTemplateIcon', () => {
      const renderer = makeRenderer();
      const element = makeElement(['bpmn:Task'], { 'camunda:modelerTemplateIcon': 'camunda-icon.svg' });

      expect(renderer.getIcon(element as never)).toBe('camunda-icon.svg');
    });

    it('reads operaton:modelerTemplateIcon when camunda is absent', () => {
      const renderer = makeRenderer();
      const element = makeElement(['bpmn:Task'], { 'operaton:modelerTemplateIcon': 'operaton-icon.svg' });

      expect(renderer.getIcon(element as never)).toBe('operaton-icon.svg');
    });

    it('prefers camunda:modelerTemplateIcon over operaton:modelerTemplateIcon', () => {
      const renderer = makeRenderer();
      const element = makeElement(['bpmn:Task'], {
        'camunda:modelerTemplateIcon': 'camunda-icon.svg',
        'operaton:modelerTemplateIcon': 'operaton-icon.svg',
      });

      expect(renderer.getIcon(element as never)).toBe('camunda-icon.svg');
    });

    it('ignores zeebe:modelerTemplateIcon', () => {
      const renderer = makeRenderer();
      const element = makeElement(['bpmn:Task'], { 'zeebe:modelerTemplateIcon': 'zeebe-icon.svg' });

      expect(renderer.getIcon(element as never)).toBeUndefined();
    });
  });

  describe('canRender', () => {
    it('is false without an icon', () => {
      const renderer = makeRenderer();
      const element = makeElement(['bpmn:Task']);

      expect(renderer.canRender(element as never)).toBe(false);
    });

    it('is true for an Activity carrying an icon', () => {
      const renderer = makeRenderer();
      const element = makeElement(['bpmn:Task', 'bpmn:Activity'], {
        'camunda:modelerTemplateIcon': 'camunda-icon.svg',
      });

      expect(renderer.canRender(element as never)).toBe(true);
    });

    it('is true for an Event carrying an icon', () => {
      const renderer = makeRenderer();
      const element = makeElement(['bpmn:StartEvent', 'bpmn:Event'], {
        'operaton:modelerTemplateIcon': 'operaton-icon.svg',
      });

      expect(renderer.canRender(element as never)).toBe(true);
    });

    it('is false for a label even with an icon', () => {
      const renderer = makeRenderer();
      const element = makeElement(['bpmn:Task', 'bpmn:Activity'], {
        'camunda:modelerTemplateIcon': 'camunda-icon.svg',
      });
      (element as FakeElement).labelTarget = element;

      expect(renderer.canRender(element as never)).toBe(false);
    });
  });

  describe('drawShape', () => {
    beforeEach(() => {
      (svgAttr as jest.Mock).mockClear();
      (svgCreate as jest.Mock).mockClear();
    });

    it('draws the underlying bpmn-js shape and overlays the icon for an Activity', () => {
      const taskHandler = jest.fn().mockReturnValue({});
      const renderer = factory(makeEventBus() as never, { handlers: { 'bpmn:Task': taskHandler } } as never);
      const element = makeElement(['bpmn:Task', 'bpmn:Activity'], {
        'camunda:modelerTemplateIcon': 'camunda-icon.svg',
      });
      const parentGfx = document.createElementNS('http://www.w3.org/2000/svg', 'g') as unknown as SVGElement;

      renderer.drawShape(parentGfx, element as never);

      expect(taskHandler).toHaveBeenCalledWith(parentGfx, element, { renderIcon: false });
      expect(svgAttr as jest.Mock).toHaveBeenCalledWith(expect.anything(), {
        href: 'camunda-icon.svg',
        width: 18,
        height: 18,
        x: 5,
        y: 5,
      });
    });

    it('centers the icon on a non-Activity element', () => {
      const startEventHandler = jest.fn().mockReturnValue({});
      const renderer = factory(
        makeEventBus() as never,
        {
          handlers: { 'bpmn:StartEvent': startEventHandler },
        } as never
      );
      const element = makeElement(['bpmn:StartEvent', 'bpmn:Event'], {
        'operaton:modelerTemplateIcon': 'operaton-icon.svg',
      });
      element.width = 36;
      element.height = 36;
      const parentGfx = document.createElementNS('http://www.w3.org/2000/svg', 'g') as unknown as SVGElement;

      renderer.drawShape(parentGfx, element as never);

      expect(svgAttr as jest.Mock).toHaveBeenCalledWith(expect.anything(), {
        href: 'operaton-icon.svg',
        width: 18,
        height: 18,
        x: 9,
        y: 9,
      });
    });
  });
});
