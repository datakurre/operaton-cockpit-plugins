/**
 * Mock for min-dom module.
 *
 * @module
 */

/**
 * Query for elements in the DOM.
 */
export const query = jest.fn().mockReturnValue(null);

/**
 * Query all for elements in the DOM.
 */
export const queryAll = jest.fn().mockReturnValue([]);

/**
 * Remove element from the DOM.
 */
export const remove = jest.fn();

/**
 * Append element to the DOM.
 */
export const append = jest.fn();

/**
 * Create element.
 */
export const create = jest.fn().mockImplementation((tag: string) => {
  return document.createElement(tag);
});
