/**
 * Angular service abstraction for testability.
 * Wraps the global angular object to allow mocking in tests.
 * @module utils/angular
 */

/**
 * Interface for Angular's $route service
 */
export interface RouteService {
  reload: () => void;
}

/**
 * Interface for Angular's injector
 */
export interface AngularInjector {
  get: (serviceName: string) => RouteService;
}

/**
 * Interface for Angular element wrapper
 */
export interface AngularElement {
  injector: () => AngularInjector;
}

/**
 * Interface for the global Angular object
 */
export interface Angular {
  element: (selector: Element | string) => AngularElement;
}

/**
 * Default Angular provider that uses the global angular object.
 * Falls back gracefully when angular is not available.
 */
export const defaultAngularProvider: Angular = {
  element: (selector: Element | string) => {
    if (typeof window !== 'undefined' && 'angular' in window) {
      return (window as unknown as { angular: Angular }).angular.element(selector);
    }
    // Return a noop provider when angular is not available
    return {
      injector: () => ({
        get: () => ({
          reload: () => {
            console.warn('Angular not available, falling back to window.location.reload()');
            window.location.reload();
          },
        }),
      }),
    };
  },
};

let angularProvider: Angular = defaultAngularProvider;

/**
 * Sets a custom Angular provider for testing purposes.
 * @param provider - The Angular provider to use
 */
export function setAngularProvider(provider: Angular): void {
  angularProvider = provider;
}

/**
 * Resets the Angular provider to the default.
 */
export function resetAngularProvider(): void {
  angularProvider = defaultAngularProvider;
}

/**
 * Gets the current Angular provider.
 * @returns The current Angular provider
 */
export function getAngularProvider(): Angular {
  return angularProvider;
}

/**
 * Reloads the current Angular route.
 * Falls back to window.location.reload() if Angular is not available.
 */
export function reloadAngularRoute(): void {
  try {
    const injector = angularProvider.element(document.body).injector();
    const $route = injector.get('$route');
    $route.reload();
  } catch (err) {
    console.error('Failed to reload Angular route:', err);
    window.location.reload();
  }
}
