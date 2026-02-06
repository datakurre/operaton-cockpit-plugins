/**
 * Tests for DmnViewer component.
 */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import DmnViewer from '../DmnViewer';

// Mock dmn-js
jest.mock('dmn-js');

describe('DmnViewer', () => {
  const mockXml = `<?xml version="1.0" encoding="UTF-8"?>
    <definitions xmlns="https://www.omg.org/spec/DMN/20191111/MODEL/"
      id="definitions" name="Test" namespace="http://camunda.org/schema/1.0/dmn">
      <decision id="decision1" name="Test Decision">
        <decisionTable id="decisionTable1">
          <input id="input1">
            <inputExpression typeRef="string"><text>inputVar</text></inputExpression>
          </input>
          <output id="output1" name="outputVar" typeRef="string" />
        </decisionTable>
      </decision>
    </definitions>`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render container div', () => {
      const onViewReady = jest.fn();
      render(<DmnViewer xml={mockXml} onViewReady={onViewReady} />);

      const container = document.querySelector('.dmn-js-parent');
      expect(container).toBeInTheDocument();
    });

    it('should have full height and width styling', () => {
      const onViewReady = jest.fn();
      render(<DmnViewer xml={mockXml} onViewReady={onViewReady} />);

      const container = document.querySelector('.dmn-js-parent') as HTMLElement;
      expect(container.style.height).toBe('100%');
      expect(container.style.width).toBe('100%');
    });
  });

  describe('viewer initialization', () => {
    it('should call onViewReady after import', async () => {
      const onViewReady = jest.fn();
      render(<DmnViewer xml={mockXml} onViewReady={onViewReady} />);

      await waitFor(() => {
        expect(onViewReady).toHaveBeenCalled();
      });
    });

    it('should pass viewer instance to onViewReady', async () => {
      const onViewReady = jest.fn();
      render(<DmnViewer xml={mockXml} onViewReady={onViewReady} />);

      await waitFor(() => {
        expect(onViewReady).toHaveBeenCalledWith(expect.any(Object), expect.anything());
      });
    });

    it('should pass decision element to onViewReady when decision table found', async () => {
      const onViewReady = jest.fn();
      render(<DmnViewer xml={mockXml} onViewReady={onViewReady} />);

      await waitFor(() => {
        expect(onViewReady).toHaveBeenCalledWith(expect.any(Object), expect.objectContaining({ id: 'decision1' }));
      });
    });
  });

  describe('cleanup', () => {
    it('should not render when xml is empty', () => {
      const onViewReady = jest.fn();
      render(<DmnViewer xml="" onViewReady={onViewReady} />);

      // onViewReady should not be called with empty xml
      expect(onViewReady).not.toHaveBeenCalled();
    });

    it('should cleanup viewer on unmount', async () => {
      const onViewReady = jest.fn();
      const { unmount } = render(<DmnViewer xml={mockXml} onViewReady={onViewReady} />);

      await waitFor(() => {
        expect(onViewReady).toHaveBeenCalled();
      });

      // Should not throw on unmount
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('re-rendering', () => {
    it('should re-import when xml changes', async () => {
      const onViewReady = jest.fn();
      const { rerender } = render(<DmnViewer xml={mockXml} onViewReady={onViewReady} />);

      await waitFor(() => {
        expect(onViewReady).toHaveBeenCalledTimes(1);
      });

      const newXml = mockXml.replace('decision1', 'decision2');
      rerender(<DmnViewer xml={newXml} onViewReady={onViewReady} />);

      await waitFor(() => {
        expect(onViewReady).toHaveBeenCalledTimes(2);
      });
    });
  });
});
