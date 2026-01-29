/**
 * Tests for the Angular service abstraction.
 *
 * @module
 */
import {
  setAngularProvider,
  resetAngularProvider,
  getAngularProvider,
  reloadAngularRoute,
  defaultAngularProvider,
  Angular,
} from '../angular';

describe('Angular Service Abstraction', () => {
  const mockReload = jest.fn();
  const mockAngularProvider: Angular = {
    element: jest.fn().mockReturnValue({
      injector: jest.fn().mockReturnValue({
        get: jest.fn().mockReturnValue({
          reload: mockReload,
        }),
      }),
    }),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    resetAngularProvider();
  });

  afterEach(() => {
    resetAngularProvider();
  });

  describe('setAngularProvider', () => {
    it('should set a custom angular provider', () => {
      setAngularProvider(mockAngularProvider);
      expect(getAngularProvider()).toBe(mockAngularProvider);
    });
  });

  describe('resetAngularProvider', () => {
    it('should reset to the default angular provider', () => {
      setAngularProvider(mockAngularProvider);
      expect(getAngularProvider()).toBe(mockAngularProvider);

      resetAngularProvider();
      expect(getAngularProvider()).toBe(defaultAngularProvider);
    });
  });

  describe('getAngularProvider', () => {
    it('should return the default provider initially', () => {
      expect(getAngularProvider()).toBe(defaultAngularProvider);
    });

    it('should return the custom provider after setting', () => {
      setAngularProvider(mockAngularProvider);
      expect(getAngularProvider()).toBe(mockAngularProvider);
    });
  });

  describe('reloadAngularRoute', () => {
    it('should call the $route.reload() method via the provider', () => {
      setAngularProvider(mockAngularProvider);
      reloadAngularRoute();

      expect(mockAngularProvider.element).toHaveBeenCalledWith(document.body);
      expect(mockReload).toHaveBeenCalled();
    });

    it('should handle errors gracefully when angular fails', () => {
      const errorProvider: Angular = {
        element: jest.fn().mockImplementation(() => {
          throw new Error('Angular not available');
        }),
      };
      setAngularProvider(errorProvider);

      // Suppress console.error for this test
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      // Should not throw
      expect(() => {
        reloadAngularRoute();
      }).not.toThrow();
      expect(consoleSpy).toHaveBeenCalledWith('Failed to reload Angular route:', expect.any(Error));

      consoleSpy.mockRestore();
    });
  });

  describe('defaultAngularProvider', () => {
    it('should return a valid element wrapper', () => {
      // Ensure angular is not on the window
      const hasAngular = 'angular' in window;
      if (hasAngular) {
        delete (window as any).angular;
      }

      const element = defaultAngularProvider.element(document.body);
      expect(element).toBeDefined();
      expect(element.injector).toBeInstanceOf(Function);

      const injector = element.injector();
      expect(injector).toBeDefined();
      expect(injector.get).toBeInstanceOf(Function);

      const $route = injector.get('$route');
      expect($route).toBeDefined();
      expect($route.reload).toBeInstanceOf(Function);
    });

    it('should warn when angular is not available', () => {
      // Ensure angular is not on the window
      const hasAngular = 'angular' in window;
      if (hasAngular) {
        delete (window as any).angular;
      }

      const element = defaultAngularProvider.element(document.body);
      const injector = element.injector();
      const $route = injector.get('$route');

      // Suppress console.warn for this test
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      // Suppress console.error for JSDOM navigation error (expected - JSDOM doesn't implement window.location.reload())
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      // This should log a warning, then call window.location.reload() which triggers JSDOM error
      $route.reload();

      expect(consoleSpy).toHaveBeenCalledWith('Angular not available, falling back to window.location.reload()');

      consoleSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });
  });
});
