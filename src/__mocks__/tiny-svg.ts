/**
 * Mock for tiny-svg module.
 *
 * @module
 */

/**
 * Append SVG element to parent.
 */
export const append = jest.fn();

/**
 * Set attributes on SVG element.
 */
export const attr = jest.fn();

/**
 * Create SVG element.
 */
export const create = jest.fn().mockImplementation((tag: string) => {
  return document.createElementNS('http://www.w3.org/2000/svg', tag);
});

/**
 * Remove SVG element.
 */
export const remove = jest.fn().mockImplementation((el: Element) => {
  if (el.parentNode) {
    el.parentNode.removeChild(el);
  }
});
