import BpmnModdle from 'bpmn-moddle';
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
}

/** BPMN moddle element with common properties */
interface ModdleElement {
  $type: string;
  id?: string;
  name?: string;
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
 * Collect messages from event definitions in an element
 * @param el - The element to check
 * @param allMessages - All available messages
 * @param collected - Set of already collected message IDs
 * @returns Array of new messages found
 */
function collectMessagesFromElement(
  el: ModdleElement,
  allMessages: BpmnMessage[],
  collected: Set<string>
): BpmnMessage[] {
  const result: BpmnMessage[] = [];

  // Check event definitions
  if (isMessageEventType(el.$type) && el.eventDefinitions !== undefined) {
    for (const evtDef of el.eventDefinitions) {
      const message = extractMessageFromEventDef(evtDef, allMessages);
      if (message !== undefined && !collected.has(message.id)) {
        collected.add(message.id);
        result.push(message);
      }
    }
  }

  // Handle receive tasks with direct messageRef
  if (el.$type === 'bpmn:ReceiveTask' && el.messageRef !== undefined) {
    const message = allMessages.find(msg => msg.id === el.messageRef?.id);
    if (message !== undefined && !collected.has(message.id)) {
      collected.add(message.id);
      result.push(message);
    }
  }

  return result;
}

/**
 * Recursively collect messages from flow elements
 * @param elements - Flow elements to search
 * @param allMessages - All available messages
 * @param collected - Set of already collected message IDs
 * @returns Array of messages found
 */
function collectMessagesFromEvents(
  elements: ModdleElement[],
  allMessages: BpmnMessage[],
  collected: Set<string>
): BpmnMessage[] {
  const result: BpmnMessage[] = [];

  for (const el of elements) {
    result.push(...collectMessagesFromElement(el, allMessages, collected));

    // Recurse into subprocesses
    if (el.flowElements !== undefined) {
      result.push(...collectMessagesFromEvents(el.flowElements, allMessages, collected));
    }
  }

  return result;
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

  const activities: BpmnElement[] = flowElements
    .filter((el: ModdleElement) => isActivityType(el.$type))
    .map((el: ModdleElement) => ({
      id: el.id ?? '',
      name: el.name ?? el.id ?? '',
      type: el.$type.replace('bpmn:', ''),
    }));

  const sequenceFlows: BpmnElement[] = flowElements
    .filter((el: ModdleElement) => el.$type === 'bpmn:SequenceFlow')
    .map((el: ModdleElement) => ({
      id: el.id ?? '',
      name: el.name ?? el.id ?? '',
      type: el.$type.replace('bpmn:', ''),
      sourceRef: el.sourceRef?.id,
      targetRef: el.targetRef?.id,
    }));

  const allMessages: BpmnMessage[] = rootElements
    .filter((el: ModdleElement) => el.$type === 'bpmn:Message')
    .map((msg: ModdleElement) => ({
      id: msg.id ?? '',
      name: msg.name ?? '',
    }));

  const messageEvents = collectMessagesFromEvents(flowElements, allMessages, new Set<string>());

  return { activities, sequenceFlows, messages: messageEvents };
};
