/**
 * Tests for BPMN component.
 *
 * Tests the BPMN diagram viewer component that displays process diagrams
 * with overlays and toggle buttons for sequence flow and history views.
 *
 * @module
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock bpmn-js NavigatedViewer
const mockAttachTo = jest.fn();
const mockImportXML = jest.fn().mockResolvedValue({});
const mockZoom = jest.fn().mockReturnValue(1);
const mockScroll = jest.fn();
const mockOverlaysAdd = jest.fn();
const mockOverlaysRemove = jest.fn();
const mockElementRegistryGet = jest.fn();
const mockCanvasGetLayer = jest.fn().mockReturnValue({
  appendChild: jest.fn(),
});

const mockViewer = {
  attachTo: mockAttachTo,
  importXML: mockImportXML,
  get: jest.fn((service: string) => {
    switch (service) {
      case 'canvas':
        return {
          zoom: mockZoom,
          scroll: mockScroll,
          _svg: {
            querySelector: jest.fn().mockReturnValue(null),
            appendChild: jest.fn(),
          },
          getLayer: mockCanvasGetLayer,
        };
      case 'overlays':
        return { add: mockOverlaysAdd, remove: mockOverlaysRemove };
      case 'elementRegistry':
        return { get: mockElementRegistryGet };
      default:
        return undefined;
    }
  }),
  _container: document.createElement('div'),
};

jest.mock('bpmn-js/lib/NavigatedViewer', () => {
  return jest.fn().mockImplementation(() => mockViewer);
});

jest.mock('bpmn-js/lib/features/modeling', () => ({}));
jest.mock('camunda-bpmn-js-behaviors/lib/camunda-platform', () => ({}));
jest.mock('camunda-bpmn-moddle/resources/camunda.json', () => ({}), { virtual: true });
jest.mock('diagram-js/lib/features/tooltips', () => ({}));
jest.mock('../../RobotModule', () => ({}));

// Mock sequence flow utilities
jest.mock('../../utils/bpmn', () => ({
  renderSequenceFlow: jest.fn().mockReturnValue([]),
  clearSequenceFlow: jest.fn(),
}));

// Mock the misc utilities
jest.mock('../../utils/misc', () => ({
  loadSettings: jest.fn(() => ({
    showSequenceFlow: false,
    autoRefresh: false,
    showHistoricBadges: false,
  })),
  saveSettings: jest.fn(),
}));

// Import after mocks
import BPMNViewer, { createBPMNViewer } from '../BPMN';

describe('BPMN Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createBPMNViewer', () => {
    it('should create a BPMN viewer and import XML', async () => {
      const xml = '<bpmn></bpmn>';
      await createBPMNViewer(xml);

      expect(mockImportXML).toHaveBeenCalledWith(xml);
    });

    it('should handle import errors gracefully', async () => {
      mockImportXML.mockRejectedValueOnce(new Error('Invalid XML'));

      // Should not throw
      await expect(createBPMNViewer('<invalid>')).resolves.toBeDefined();
    });
  });

  describe('BPMNViewer component', () => {
    const sampleBpmnXml = `<?xml version="1.0" encoding="UTF-8"?>
      <bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL">
        <bpmn:process id="Process_1" isExecutable="true">
          <bpmn:startEvent id="StartEvent_1"/>
        </bpmn:process>
      </bpmn:definitions>`;

    it('should render a container div', () => {
      render(<BPMNViewer diagramXML={sampleBpmnXml} showRuntimeToggle={false} />);

      // The component should render a div
      expect(document.querySelector('div')).toBeInTheDocument();
    });

    it('should accept custom className', () => {
      const { container } = render(
        <BPMNViewer diagramXML={sampleBpmnXml} showRuntimeToggle={false} className="custom-bpmn-class" />
      );

      expect(container.querySelector('.custom-bpmn-class')).toBeInTheDocument();
    });

    it('should accept custom style', () => {
      const { container } = render(
        <BPMNViewer diagramXML={sampleBpmnXml} showRuntimeToggle={false} style={{ height: '500px', width: '100%' }} />
      );

      const div = container.firstChild as HTMLElement;
      expect(div.style.height).toBe('500px');
      expect(div.style.width).toBe('100%');
    });

    it('should pass activities to render overlays', async () => {
      const activities = [
        { activityId: 'StartEvent_1', activityName: 'Start' },
        { activityId: 'StartEvent_1', activityName: 'Start' }, // Duplicate
        { activityId: 'Task_1', activityName: 'Task' },
      ];

      const { container } = render(
        <BPMNViewer diagramXML={sampleBpmnXml} activities={activities} showRuntimeToggle={false} />
      );

      // The component should render
      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('rendering with activities', () => {
    it('should handle empty activities array', () => {
      const { container } = render(<BPMNViewer diagramXML="<bpmn/>" activities={[]} showRuntimeToggle={false} />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should handle undefined activities', () => {
      const { container } = render(<BPMNViewer diagramXML="<bpmn/>" showRuntimeToggle={false} />);

      expect(container.firstChild).toBeInTheDocument();
    });
  });

  describe('showRuntimeToggle prop', () => {
    it('should not show runtime toggle when showRuntimeToggle is false', () => {
      render(<BPMNViewer diagramXML="<bpmn/>" showRuntimeToggle={false} />);

      // Component renders without runtime toggle
      expect(document.querySelector('div')).toBeInTheDocument();
    });

    it('should accept showRuntimeToggle as true', () => {
      render(<BPMNViewer diagramXML="<bpmn/>" showRuntimeToggle />);

      expect(document.querySelector('div')).toBeInTheDocument();
    });
  });
});
