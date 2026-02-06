/**
 * Type declarations for dmn-js library
 */

declare module 'dmn-js' {
  export interface DmnViewerOptions {
    container?: HTMLElement | string;
    height?: number | string;
    width?: number | string;
    position?: 'absolute' | 'relative';
    additionalModules?: unknown[];
  }

  export interface ImportXmlResult {
    warnings: string[];
  }

  export interface DmnElement {
    id: string;
    name?: string;
    $type: string;
    decisionLogic?: {
      $type: string;
      input?: DmnInput[];
      output?: DmnOutput[];
      rule?: DmnRule[];
    };
  }

  export interface DmnInput {
    id: string;
    label?: string;
    inputExpression?: {
      id: string;
      typeRef?: string;
      text?: string;
    };
  }

  export interface DmnOutput {
    id: string;
    label?: string;
    name?: string;
    typeRef?: string;
  }

  export interface DmnRule {
    id: string;
    inputEntry?: DmnInputEntry[];
    outputEntry?: DmnOutputEntry[];
  }

  export interface DmnInputEntry {
    id: string;
    text?: string;
  }

  export interface DmnOutputEntry {
    id: string;
    text?: string;
  }

  export interface DmnDefinitions {
    id: string;
    name?: string;
    $type: 'dmn:Definitions';
    drgElement?: DmnElement[];
  }

  export interface ActiveView {
    type: string;
    element: DmnElement;
  }

  export interface EventBus {
    on(event: string, priority: number | Function, callback?: Function, target?: unknown): void;
    off(event: string, callback?: Function): void;
    fire(type: string, event?: unknown): unknown;
  }

  export interface Sheet {
    getRoot(): {
      rows?: unknown[];
      cols?: unknown[];
    };
  }

  export interface DmnViewer {
    importXML(xml: string): Promise<ImportXmlResult>;
    destroy(): void;
    getActiveView(): ActiveView | null;
    getActiveViewer(): DmnViewer | null;
    getViews(): ActiveView[];
    open(view: ActiveView | DmnElement): Promise<ImportXmlResult>;
    get<T = unknown>(name: string): T;
    on(event: string, priority: number | Function, callback?: Function, target?: unknown): void;
    off(event: string, callback?: Function): void;
    attachTo(parentNode: HTMLElement): void;
    detach(): void;
    _definitions?: DmnDefinitions;
  }

  export default class Viewer implements DmnViewer {
    constructor(options?: DmnViewerOptions);
    importXML(xml: string): Promise<ImportXmlResult>;
    destroy(): void;
    getActiveView(): ActiveView | null;
    getActiveViewer(): DmnViewer | null;
    getViews(): ActiveView[];
    open(view: ActiveView | DmnElement): Promise<ImportXmlResult>;
    get<T = unknown>(name: string): T;
    on(event: string, priority: number | Function, callback?: Function, target?: unknown): void;
    off(event: string, callback?: Function): void;
    attachTo(parentNode: HTMLElement): void;
    detach(): void;
    _definitions?: DmnDefinitions;
  }
}

declare module 'dmn-js/lib/Viewer' {
  import Viewer from 'dmn-js';
  export default Viewer;
}

declare module 'dmn-js/lib/NavigatedViewer' {
  import Viewer from 'dmn-js';
  export default Viewer;
}
