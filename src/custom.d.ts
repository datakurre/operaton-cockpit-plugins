declare module '*.svg' {
  const content: string;
  export default content;
}

declare module '@bpmn-io/element-template-icon-renderer' {
  const module: Record<string, unknown>;
  export default module;
}
