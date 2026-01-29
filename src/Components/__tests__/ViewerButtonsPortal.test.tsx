/**
 * Tests for ViewerButtonsPortal component.
 *
 * @module
 */
import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { ViewerButtonsPortal, useViewerButtonContainer, BpmnViewer } from '../ViewerButtonsPortal';
import { renderHook } from '@testing-library/react';

describe('ViewerButtonsPortal', () => {
  let mockViewer: BpmnViewer;
  let viewerContainer: HTMLDivElement;

  beforeEach(() => {
    viewerContainer = document.createElement('div');
    document.body.appendChild(viewerContainer);

    mockViewer = {
      _container: viewerContainer,
      get: jest.fn(),
    };
  });

  afterEach(() => {
    cleanup();
    if (viewerContainer.parentElement) {
      viewerContainer.parentElement.removeChild(viewerContainer);
    }
  });

  describe('ViewerButtonsPortal component', () => {
    it('should render children into a portal attached to viewer container', () => {
      render(
        <ViewerButtonsPortal viewer={mockViewer} position={{ right: '15px', top: '15px' }}>
          <button>Test Button</button>
        </ViewerButtonsPortal>
      );

      expect(screen.getByRole('button', { name: 'Test Button' })).toBeInTheDocument();
      expect(viewerContainer.querySelector('button')).toBeTruthy();
    });

    it('should position container correctly', () => {
      render(
        <ViewerButtonsPortal viewer={mockViewer} position={{ right: '10px', bottom: '20px' }}>
          <span>Content</span>
        </ViewerButtonsPortal>
      );

      const container = viewerContainer.querySelector('div');
      expect(container?.style.position).toBe('absolute');
      expect(container?.style.right).toBe('10px');
      expect(container?.style.bottom).toBe('20px');
    });

    it('should return null when viewer is not provided', () => {
      const { container } = render(
        <ViewerButtonsPortal viewer={null} position={{ right: '15px', top: '15px' }}>
          <button>Test Button</button>
        </ViewerButtonsPortal>
      );

      expect(container.innerHTML).toBe('');
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should apply className to container', () => {
      render(
        <ViewerButtonsPortal viewer={mockViewer} position={{ right: '15px', top: '15px' }} className="custom-class">
          <span>Content</span>
        </ViewerButtonsPortal>
      );

      const container = viewerContainer.querySelector('.custom-class');
      expect(container).toBeTruthy();
    });

    it('should cleanup container on unmount', () => {
      const { unmount } = render(
        <ViewerButtonsPortal viewer={mockViewer} position={{ right: '15px', top: '15px' }}>
          <button>Test Button</button>
        </ViewerButtonsPortal>
      );

      expect(viewerContainer.querySelector('button')).toBeTruthy();

      unmount();

      expect(viewerContainer.querySelector('button')).toBeFalsy();
    });
  });

  describe('useViewerButtonContainer hook', () => {
    it('should create a container in the viewer', () => {
      const { result } = renderHook(() => useViewerButtonContainer(mockViewer, { right: '15px', top: '15px' }));

      expect(result.current).toBeInstanceOf(HTMLDivElement);
      expect(viewerContainer.contains(result.current)).toBe(true);
    });

    it('should return null when viewer is null', () => {
      const { result } = renderHook(() => useViewerButtonContainer(null, { right: '15px', top: '15px' }));

      expect(result.current).toBeNull();
    });

    it('should cleanup container on unmount', () => {
      const { result, unmount } = renderHook(() =>
        useViewerButtonContainer(mockViewer, { right: '15px', top: '15px' })
      );

      const container = result.current;
      expect(container).toBeTruthy();
      expect(viewerContainer.contains(container)).toBe(true);

      unmount();

      expect(viewerContainer.contains(container)).toBe(false);
    });

    it('should position container correctly', () => {
      const { result } = renderHook(() =>
        useViewerButtonContainer(mockViewer, {
          left: '10px',
          bottom: '20px',
        })
      );

      expect(result.current?.style.position).toBe('absolute');
      expect(result.current?.style.left).toBe('10px');
      expect(result.current?.style.bottom).toBe('20px');
    });
  });
});
