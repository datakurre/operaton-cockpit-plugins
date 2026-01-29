/**
 * Mock for svg-curves module.
 *
 * @module
 */

/**
 * Creates an SVG curve element.
 */
export const createCurve = jest.fn().mockImplementation(() => {
  const mockSvgPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  return mockSvgPath;
});
