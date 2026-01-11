import BpmnModdle from 'bpmn-moddle';
import moddle from 'camunda-bpmn-moddle/resources/camunda.json';
import { get } from './api';

export interface BpmnElement {
  id: string;
  name?: string;
  type: string;
}

export interface BpmnMessage {
  id: string;
  name: string;
}

export const getBpmnElements = async (
  processDefinitionId: string,
  api: any
): Promise<{
  activities: BpmnElement[];
  sequenceFlows: BpmnElement[];
  messages: BpmnMessage[];
}> => {
  const definitionData = await get(api, `/process-definition/${processDefinitionId}/xml`);
  if (!definitionData?.bpmn20Xml) {
    throw new Error('Failed to load process definition XML');
  }

  const bpmnModdle = new BpmnModdle({ camunda: moddle });
  const result: any = await bpmnModdle.fromXML(definitionData.bpmn20Xml);
  const definitions = result.rootElement;
  const processes = definitions.rootElements.filter((el: any) => el.$type === 'bpmn:Process');

  const flowElements = processes.flatMap((process: any) => process.flowElements || []);

  const activities: BpmnElement[] = flowElements
    .filter(
      (el: any) =>
        el.$type &&
        (el.$type.includes('Task') ||
          el.$type.includes('Gateway') ||
          el.$type.includes('Event') ||
          el.$type.includes('SubProcess'))
    )
    .map((el: any) => ({
      id: el.id,
      name: el.name || el.id,
      type: el.$type.replace('bpmn:', ''),
    }));

  const sequenceFlows: BpmnElement[] = flowElements
    .filter((el: any) => el.$type === 'bpmn:SequenceFlow')
    .map((el: any) => ({
      id: el.id,
      name: el.name || el.id,
      type: el.$type.replace('bpmn:', ''),
      sourceRef: el.sourceRef?.id,
      targetRef: el.targetRef?.id,
    }));

  const messages: BpmnMessage[] = (definitions.rootElements || [])
    .filter((el: any) => el.$type === 'bpmn:Message')
    .map((msg: any) => ({
      id: msg.id,
      name: msg.name,
    }));

  // Collect messages referenced by catch events, receive tasks, and boundary events
  const messageEventTypes = [
    'bpmn:IntermediateCatchEvent',
    'bpmn:ReceiveTask',
    'bpmn:BoundaryEvent',
    'bpmn:StartEvent',
  ];

  const collectMessagesFromEvents = (elements: any[]): BpmnMessage[] => {
    const collected: BpmnMessage[] = [];
    for (const el of elements) {
      if (messageEventTypes.some(t => el.$type === t) && el.eventDefinitions) {
        for (const evtDef of el.eventDefinitions) {
          if (evtDef.$type === 'bpmn:MessageEventDefinition' && evtDef.messageRef) {
            const message = messages.find(msg => msg.id === evtDef.messageRef.id);
            if (message && !collected.find(m => m.id === message.id)) {
              collected.push(message);
            }
          }
        }
      }
      // Handle receive tasks with direct messageRef
      if (el.$type === 'bpmn:ReceiveTask' && el.messageRef) {
        const message = messages.find(msg => msg.id === el.messageRef.id);
        if (message && !collected.find(m => m.id === message.id)) {
          collected.push(message);
        }
      }
      // Recurse into subprocesses
      if (el.flowElements) {
        collected.push(...collectMessagesFromEvents(el.flowElements));
      }
    }
    return collected;
  };

  const messageEvents = collectMessagesFromEvents(flowElements);

  return { activities, sequenceFlows, messages: messageEvents };
};
