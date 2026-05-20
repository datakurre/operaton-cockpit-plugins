import { BpmnModdle } from 'bpmn-moddle';
import moddle from 'camunda-bpmn-moddle/resources/camunda.json';
import { get } from './api';
import type { API } from '../types';

/** Exported BPMN element interface for activities and sequence flows */
export interface BpmnElement {
  id: string;
  name?: string;
  type: string;
  sourceRef?: string | undefined;
  targetRef?: string | undefined;
}

/** Exported BPMN message interface */
export interface BpmnMessage {
  id: string;
  name: string;
  /** True when this message is referenced by a top-level process start event */
  isStartEvent: boolean;
  /** True when this message is also referenced by a catch event, boundary event, receive task, or event subprocess start event */
  hasCatchUsage: boolean;
}

/** BPMN moddle element with common properties */
interface ModdleElement {
  $type: string;
  id?: string;
  name?: string;
  triggeredByEvent?: boolean;
  flowElements?: ModdleElement[];
  eventDefinitions?: ModdleEventDefinition[];
  messageRef?: ModdleMessageRef;
  rootElements?: ModdleElement[];
  sourceRef?: ModdleRef;
  targetRef?: ModdleRef;
}

/** BPMN moddle reference */
interface ModdleRef {
  id?: string;
}

/** BPMN message reference */
interface ModdleMessageRef {
  id: string;
}

/** BPMN event definition */
interface ModdleEventDefinition {
  $type: string;
  messageRef?: ModdleMessageRef;
}

/** BPMN moddle parse result */
interface ModdleParseResult {
  rootElement: ModdleElement;
}

/** Message event types that can reference messages */
const MESSAGE_EVENT_TYPES = [
  'bpmn:IntermediateCatchEvent',
  'bpmn:ReceiveTask',
  'bpmn:BoundaryEvent',
  'bpmn:StartEvent',
] as const;

/**
 * Check if element type indicates it is an activity
 * @param elementType - The $type property of the element
 * @returns True if the element is an activity type
 */
function isActivityType(elementType: string): boolean {
  return (
    elementType.includes('Task') ||
    elementType.includes('Gateway') ||
    elementType.includes('Event') ||
    elementType.includes('SubProcess')
  );
}

/**
 * Extract message from event definition if present
 * @param evtDef - The event definition to check
 * @param allMessages - All available messages
 * @returns The message if found, undefined otherwise
 */
function extractMessageFromEventDef(
  evtDef: ModdleEventDefinition,
  allMessages: BpmnMessage[]
): BpmnMessage | undefined {
  if (evtDef.$type !== 'bpmn:MessageEventDefinition' || evtDef.messageRef === undefined) {
    return undefined;
  }
  return allMessages.find(msg => msg.id === evtDef.messageRef?.id);
}

/**
 * Check if element is a message event type
 * @param elementType - The $type property of the element
 * @returns True if the element can have message references
 */
function isMessageEventType(elementType: string): boolean {
  return MESSAGE_EVENT_TYPES.some(t => elementType === t);
}

/**
 * Collect messages from event definitions in an element into the shared map.
 * Uses a Map so that a message already added from a non-start event can be
 * upgraded to isStartEvent=true when the same message is later encountered on
 * a start event of the main process.
 * @param el - The element to check
 * @param allMessages - All available messages
 * @param collected - Map from message ID to the collected BpmnMessage entry
 * @param insideEventSubprocess - Whether we are inside an event subprocess
 */
function collectMessagesFromElement(
  el: ModdleElement,
  allMessages: BpmnMessage[],
  collected: Map<string, BpmnMessage>,
  insideEventSubprocess: boolean
): void {
  // A start event is a "process start event" only when it is NOT inside an event subprocess
  const isProcessStartEvent = el.$type === 'bpmn:StartEvent' && !insideEventSubprocess;
  // Everything else (catch events, boundary events, event subprocess start events) counts as catch usage
  const isCatchContext = !isProcessStartEvent;

  // Check event definitions
  if (isMessageEventType(el.$type) && el.eventDefinitions !== undefined) {
    for (const evtDef of el.eventDefinitions) {
      const base = extractMessageFromEventDef(evtDef, allMessages);
      if (base !== undefined) {
        const existing = collected.get(base.id);
        if (existing === undefined) {
          collected.set(base.id, {
            ...base,
            isStartEvent: isProcessStartEvent,
            hasCatchUsage: isCatchContext,
          });
        } else {
          // Upgrade flags independently — both can become true over multiple encounters
          if (isProcessStartEvent) existing.isStartEvent = true;
          if (isCatchContext) existing.hasCatchUsage = true;
        }
      }
    }
  }

  // Handle receive tasks with direct messageRef (always catch usage)
  if (el.$type === 'bpmn:ReceiveTask' && el.messageRef !== undefined) {
    const base = allMessages.find(msg => msg.id === el.messageRef?.id);
    if (base !== undefined) {
      const existing = collected.get(base.id);
      if (existing === undefined) {
        collected.set(base.id, { ...base, isStartEvent: false, hasCatchUsage: true });
      } else {
        existing.hasCatchUsage = true;
      }
    }
  }
}

/**
 * Recursively collect messages from flow elements
 * @param elements - Flow elements to search
 * @param allMessages - All available messages
 * @param collected - Map from message ID to the collected BpmnMessage entry
 * @param insideEventSubprocess - Whether we are currently inside an event subprocess
 */
function collectMessagesFromEvents(
  elements: ModdleElement[],
  allMessages: BpmnMessage[],
  collected: Map<string, BpmnMessage>,
  insideEventSubprocess: boolean
): void {
  for (const el of elements) {
    collectMessagesFromElement(el, allMessages, collected, insideEventSubprocess);

    // Recurse into subprocesses, tracking whether the subprocess is event-triggered
    if (el.flowElements !== undefined) {
      const childIsEventSubprocess = el.$type === 'bpmn:SubProcess' && (el.triggeredByEvent ?? false);
      collectMessagesFromEvents(
        el.flowElements,
        allMessages,
        collected,
        insideEventSubprocess || childIsEventSubprocess
      );
    }
  }
}

/**
 * Recursively collect all activity elements from flow elements including nested subprocesses.
 * @param elements - Flow elements to search
 * @param collected - Array to push discovered activities into
 */
function collectActivities(elements: ModdleElement[], collected: BpmnElement[]): void {
  for (const el of elements) {
    if (isActivityType(el.$type)) {
      collected.push({
        id: el.id ?? '',
        name: el.name ?? el.id ?? '',
        type: el.$type.replace('bpmn:', ''),
      });
    }
    if (el.flowElements !== undefined) {
      collectActivities(el.flowElements, collected);
    }
  }
}

/**
 * Recursively collect all sequence flow elements from flow elements including nested subprocesses.
 * @param elements - Flow elements to search
 * @param collected - Array to push discovered sequence flows into
 */
function collectSequenceFlows(elements: ModdleElement[], collected: BpmnElement[]): void {
  for (const el of elements) {
    if (el.$type === 'bpmn:SequenceFlow') {
      collected.push({
        id: el.id ?? '',
        name: el.name ?? el.id ?? '',
        type: el.$type.replace('bpmn:', ''),
        sourceRef: el.sourceRef?.id,
        targetRef: el.targetRef?.id,
      });
    }
    if (el.flowElements !== undefined) {
      collectSequenceFlows(el.flowElements, collected);
    }
  }
}

/**
 * Fetches and parses BPMN elements from a process definition
 * @param processDefinitionId - The ID of the process definition
 * @param api - The API configuration object
 * @returns Parsed activities, sequence flows, and messages
 */
export const getBpmnElements = async (
  processDefinitionId: string,
  api: API
): Promise<{
  activities: BpmnElement[];
  sequenceFlows: BpmnElement[];
  messages: BpmnMessage[];
}> => {
  const definitionData = (await get(api, `/process-definition/${processDefinitionId}/xml`)) as {
    id: string;
    bpmn20Xml?: string;
  };
  if (definitionData.bpmn20Xml === undefined) {
    throw new Error('Failed to load process definition XML');
  }

  const bpmnModdle = new BpmnModdle({ camunda: moddle });
  const result = (await bpmnModdle.fromXML(definitionData.bpmn20Xml)) as ModdleParseResult;
  const definitions = result.rootElement;
  const rootElements = definitions.rootElements ?? [];
  const processes = rootElements.filter((el: ModdleElement) => el.$type === 'bpmn:Process');
  const flowElements = processes.flatMap((process: ModdleElement) => process.flowElements ?? []);

  const activities: BpmnElement[] = [];
  collectActivities(flowElements, activities);

  const sequenceFlows: BpmnElement[] = [];
  collectSequenceFlows(flowElements, sequenceFlows);

  const allMessages: BpmnMessage[] = rootElements
    .filter((el: ModdleElement) => el.$type === 'bpmn:Message')
    .map((msg: ModdleElement) => ({
      id: msg.id ?? '',
      name: msg.name ?? '',
      isStartEvent: false,
      hasCatchUsage: false,
    }));

  const collectedMessages = new Map<string, BpmnMessage>();
  collectMessagesFromEvents(flowElements, allMessages, collectedMessages, false);
  const messageEvents = Array.from(collectedMessages.values());

  return { activities, sequenceFlows, messages: messageEvents };
};
