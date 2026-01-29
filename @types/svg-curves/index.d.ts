declare module 'svg-curves' {
  interface CurveOptions {
    markerEnd?: string;
    stroke?: string;
    strokeWidth?: number;
    strokeDasharray?: string;
    strokeLinecap?: string;
  }

  interface Point {
    x: number;
    y: number;
  }

  /**
   * Creates an SVG path element for a curve through the given points.
   * @param waypoints - Array of points defining the curve
   * @param options - SVG styling options
   * @returns SVG path element
   */
  export function createCurve(waypoints: Point[], options?: CurveOptions): SVGPathElement;
}
