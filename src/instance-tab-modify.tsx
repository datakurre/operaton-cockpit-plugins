import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import moddle from 'camunda-bpmn-moddle/resources/camunda.json';
import BpmnModdle from 'bpmn-moddle';

import { InstancePluginParams } from './types';
import { get, post } from './utils/api';

// Declare angular globally
declare const angular: any;

interface VariableValue {
  value: any;
  type: string;
  local?: boolean;
}

interface ModificationInstruction {
  type: 'startBeforeActivity' | 'startAfterActivity' | 'startTransition' | 'cancel';
  // For startBeforeActivity, startAfterActivity, cancel
  activityId?: string;
  // For startTransition
  transitionId?: string;
  // For cancel instructions - to cancel specific instances
  activityInstanceId?: string;
  // For start instructions - to specify ancestor scope
  ancestorActivityInstanceId?: string;
  // For start instructions - variables with proper type system
  variables?: Record<string, VariableValue>;
}

interface ModifyFormData {
  instructions: ModificationInstruction[];
  annotation: string;
  skipCustomListeners: boolean;
  skipIoMappings: boolean;
}

interface BpmnActivity {
  id: string;
  name?: string;
  type: string;
}

interface BpmnSequenceFlow {
  id: string;
  name?: string;
  sourceRef: string;
  targetRef: string;
}

interface ActiveActivityInstance {
  id: string;
  activityId: string;
  activityName?: string;
  parentActivityInstanceId?: string;
}

const ModifyForm: React.FC<InstancePluginParams> = ({ api, processInstanceId, processDefinitionId, processData }) => {
  const [activities, setActivities] = useState<BpmnActivity[]>([]);
  const [sequenceFlows, setSequenceFlows] = useState<BpmnSequenceFlow[]>([]);
  const [activeInstances, setActiveInstances] = useState<ActiveActivityInstance[]>([]);
  const [activityCounts, setActivityCounts] = useState<Map<string, number>>(new Map());
  const [cancelMethods, setCancelMethods] = useState<Map<number, string>>(new Map());
  const [jsonErrors, setJsonErrors] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actualProcessDefId, setActualProcessDefId] = useState<string | null>(null);

  const { control, handleSubmit, register, watch, setValue } = useForm<ModifyFormData>({
    defaultValues: {
      instructions: [{ type: 'startBeforeActivity', activityId: '', variables: {} }],
      annotation: '',
      skipCustomListeners: false,
      skipIoMappings: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'instructions',
  });

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        
        // Get the processDefinitionId from multiple possible sources
        let defId = processDefinitionId || processData?.definitionId || processData?.processDefinitionId;
        
        // If still no processDefinitionId, fetch it from the process instance
        if (!defId) {
          console.log('No processDefinitionId found in props, fetching from instance...');
          const instanceData = await get(api, `/process-instance/${processInstanceId}`);
          defId = instanceData?.definitionId;
          console.log('Fetched processDefinitionId from instance:', defId);
        }
        
        if (!defId) {
          throw new Error('Could not determine process definition ID');
        }
        
        setActualProcessDefId(defId);
        console.log('Using processDefinitionId:', defId);
        
        // Get the process definition XML
        const definitionData = await get(api, `/process-definition/${defId}/xml`);
        console.log('Got definition data:', definitionData ? 'success' : 'null');
        
        if (!definitionData?.bpmn20Xml) {
          throw new Error('Failed to load process definition XML');
        }

        // Parse XML using camunda-bpmn-moddle
        const bpmnModdle = new BpmnModdle({ camunda: moddle });
        const result: any = await bpmnModdle.fromXML(definitionData.bpmn20Xml);
        
        // Extract all flow nodes (activities, gateways, events) from all processes
        const definitions = result.rootElement;
        const processes = definitions.rootElements || [definitions];
        
        const flowElements = processes
          .filter((el: any) => el.$type === 'bpmn:Process')
          .flatMap((process: any) => process.flowElements || []);

        const extractedActivities: BpmnActivity[] = flowElements
          .filter((el: any) => 
            el.$type && (
              el.$type.includes('Task') || 
              el.$type.includes('Gateway') ||
              el.$type.includes('Event') ||
              el.$type.includes('SubProcess')
            )
          )
          .map((el: any) => ({
            id: el.id,
            name: el.name || el.id,
            type: el.$type.replace('bpmn:', ''),
          }));

        // Extract sequence flows
        const extractedSequenceFlows: BpmnSequenceFlow[] = flowElements
          .filter((el: any) => el.$type === 'bpmn:SequenceFlow')
          .map((el: any) => ({
            id: el.id,
            name: el.name || el.id,
            sourceRef: el.sourceRef?.id || el.sourceRef,
            targetRef: el.targetRef?.id || el.targetRef,
          }));

        console.log('Extracted activities:', extractedActivities.length);
        console.log('Extracted sequence flows:', extractedSequenceFlows.length);
        
        // Fetch active (unfinished) activity instances using history endpoint
        const unfinishedActivityInstances = await get(api, '/history/activity-instance', {
          processInstanceId,
          unfinished: 'true',
        });
        
        console.log('Fetched unfinished activity instances:', unfinishedActivityInstances?.length || 0);
        
        // Map historic activity instances to our interface
        const allActiveInstances: ActiveActivityInstance[] = (unfinishedActivityInstances || []).map((inst: any) => ({
          id: inst.id,
          activityId: inst.activityId,
          activityName: inst.activityName,
          parentActivityInstanceId: inst.parentActivityInstanceId,
        }));
        
        const counts = new Map<string, number>();
        allActiveInstances.forEach(inst => {
          counts.set(inst.activityId, (counts.get(inst.activityId) || 0) + 1);
        });
        
        console.log('Active activity instances:', allActiveInstances.length);
        
        setActivities(extractedActivities);
        setSequenceFlows(extractedSequenceFlows);
        setActiveInstances(allActiveInstances);
        setActivityCounts(counts);
        setError(null);
      } catch (err) {
        console.error('Error loading activities:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Failed to load process activities: ${errorMessage}. Check console for details.`);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
  }, [api, processInstanceId, processDefinitionId, processData]);

  const onSubmit = async (data: ModifyFormData) => {
    try {
      setSubmitted(true);
      setError(null);

      const payload = {
        skipCustomListeners: data.skipCustomListeners,
        skipIoMappings: data.skipIoMappings,
        instructions: data.instructions
          .filter(inst => {
            // Validate that required fields are present based on instruction type
            if (inst.type === 'startTransition') {
              return !!inst.transitionId;
            } else if (inst.type === 'cancel') {
              return !!(inst.activityInstanceId || inst.activityId);
            } else {
              return !!inst.activityId;
            }
          })
          .map(inst => {
            // Build instruction according to API spec
            const instruction: any = { type: inst.type };
            
            // Add fields based on instruction type
            if (inst.activityId) instruction.activityId = inst.activityId;
            if (inst.transitionId) instruction.transitionId = inst.transitionId;
            if (inst.activityInstanceId) instruction.activityInstanceId = inst.activityInstanceId;
            if (inst.ancestorActivityInstanceId) instruction.ancestorActivityInstanceId = inst.ancestorActivityInstanceId;
            if (inst.variables && Object.keys(inst.variables).length > 0) {
              instruction.variables = inst.variables;
            }
            
            return instruction;
          }),
        annotation: data.annotation || 'Modified via Cockpit plugin',
      };

      const result = await post(
        api, 
        `/process-instance/${processInstanceId}/modification`, 
        {}, 
        JSON.stringify(payload)
      );
      
      console.log('Modification result:', result);
      
      // Update the AngularJS app without full page refresh
      try {
        const injector = angular.element(document.body).injector();
        const $route = injector.get('$route');
        $route.reload();
      } catch (angularErr) {
        console.error('Failed to reload Angular route:', angularErr);
        // Fallback to page reload if Angular is not available
        window.location.reload();
      }
      
      setSubmitted(false);
      setError(null);
    } catch (err) {
      console.error('Modification error:', err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Failed to modify process instance: ${errorMessage}. Check console for details.`);
      setSubmitted(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '10px' }}>
        <p>Loading process activities...</p>
        <p style={{ fontSize: '0.9em', color: '#666' }}>Process Instance ID: {processInstanceId}</p>
        <p style={{ fontSize: '0.9em', color: '#666' }}>Process Definition ID: {actualProcessDefId || 'fetching...'}</p>
      </div>
    );
  }

  if (error && activities.length === 0) {
    return (
      <div style={{ padding: '10px', color: 'red' }}>
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '10px' }}>
      {error && (
        <div style={{ padding: '10px', marginBottom: '10px', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '2px' }}>
          {error}
        </div>
      )}

      <h4>Modification Instructions</h4>
      
      {fields.map((field, index) => (
        <div key={field.id} style={{ 
          marginBottom: '15px', 
          padding: '10px', 
          border: '1px solid #ddd',
          borderRadius: '4px',
          backgroundColor: '#f9f9f9'
        }}>
          <div style={{ marginBottom: '10px' }}>
            <label>Instruction Type: </label>
            <Controller
              name={`instructions.${index}.type`}
              control={control}
              render={({ field }) => (
                <select {...field} className="form-control" style={{ width: '300px', display: 'inline-block', marginLeft: '10px' }}>
                  <option value="startBeforeActivity">Start Before Activity</option>
                  <option value="startAfterActivity">Start After Activity</option>
                  <option value="startTransition">Start Transition</option>
                  <option value="cancel">Cancel Activity Instance</option>
                </select>
              )}
            />
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                style={{ 
                  marginLeft: '10px', 
                  padding: '8px 16px', 
                  backgroundColor: '#6c757d', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '2px', 
                  cursor: 'pointer',
                  minWidth: '90px'
                }}
              >
                Remove
              </button>
            )}
          </div>

          {watch(`instructions.${index}.type`) === 'startTransition' ? (
            <>
              <div style={{ marginBottom: '10px' }}>
                <label>Transition: </label>
                <Controller
                  name={`instructions.${index}.transitionId`}
                  control={control}
                  render={({ field }) => (
                    <select {...field} className="form-control" style={{ width: '400px', display: 'inline-block', marginLeft: '10px' }}>
                      <option value="">-- Select Sequence Flow --</option>
                      {sequenceFlows.map(flow => (
                        <option key={flow.id} value={flow.id}>
                          {flow.name} ({flow.sourceRef} → {flow.targetRef})
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Ancestor Activity Instance (optional): </label>
                <Controller
                  name={`instructions.${index}.ancestorActivityInstanceId`}
                  control={control}
                  render={({ field }) => (
                    <select {...field} className="form-control" style={{ width: '400px', display: 'inline-block', marginLeft: '10px' }}>
                      <option value="">-- None (default scope) --</option>
                      {activeInstances
                        .filter(inst => {
                          // Only show instances that could be ancestors (e.g., subprocesses)
                          const activity = activities.find(a => a.id === inst.activityId);
                          return activity?.type?.includes('SubProcess') || activity?.type?.includes('Process');
                        })
                        .map(inst => (
                          <option key={inst.id} value={inst.id}>
                            {inst.activityName || inst.activityId} (ID: {inst.id})
                          </option>
                        ))}
                    </select>
                  )}
                />
              </div>
            </>
          ) : watch(`instructions.${index}.type`) === 'cancel' ? (
            <>
              <div style={{ marginBottom: '10px' }}>
                <label>Cancel Method: </label>
                <select 
                  className="form-control" 
                  style={{ width: '300px', display: 'inline-block', marginLeft: '10px' }}
                  value={cancelMethods.get(index) || 'activity'}
                  onChange={(e) => {
                    const method = e.target.value;
                    setCancelMethods(new Map(cancelMethods.set(index, method)));
                    if (method === 'activity') {
                      setValue(`instructions.${index}.activityInstanceId`, '');
                    } else if (method === 'activityInstance') {
                      setValue(`instructions.${index}.activityId`, '');
                    }
                  }}
                >
                  <option value="activity">All instances of activity</option>
                  <option value="activityInstance">Specific activity instance</option>
                </select>
              </div>
              
              {(cancelMethods.get(index) || 'activity') === 'activity' && (
                <div style={{ marginBottom: '10px' }}>
                  <label>Activity (cancel all instances): </label>
                  <Controller
                    name={`instructions.${index}.activityId`}
                    control={control}
                    render={({ field }) => (
                      <select {...field} className="form-control" style={{ width: '400px', display: 'inline-block', marginLeft: '10px' }}>
                        <option value="">-- Select Active Activity --</option>
                        {activities
                          .filter(activity => activityCounts.has(activity.id))
                          .map(activity => (
                            <option key={activity.id} value={activity.id}>
                              {activity.name} ({activity.type}) - {activityCounts.get(activity.id)} active
                            </option>
                          ))}
                      </select>
                    )}
                  />
                </div>
              )}
              
              {(cancelMethods.get(index) || 'activity') === 'activityInstance' && (
                <div style={{ marginBottom: '10px' }}>
                  <label>Activity Instance (cancel specific): </label>
                  <Controller
                    name={`instructions.${index}.activityInstanceId`}
                    control={control}
                    render={({ field }) => (
                      <select {...field} className="form-control" style={{ width: '400px', display: 'inline-block', marginLeft: '10px' }}>
                        <option value="">-- Select Activity Instance --</option>
                        {activeInstances.map(inst => (
                          <option key={inst.id} value={inst.id}>
                            {inst.activityName || inst.activityId} (ID: {inst.id})
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <div style={{ marginBottom: '10px' }}>
                <label>Activity: </label>
                <Controller
                  name={`instructions.${index}.activityId`}
                  control={control}
                  render={({ field }) => (
                    <select {...field} className="form-control" style={{ width: '400px', display: 'inline-block', marginLeft: '10px' }}>
                      <option value="">-- Select Activity --</option>
                      {activities.map(activity => (
                        <option key={activity.id} value={activity.id}>
                          {activity.name} ({activity.type})
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Ancestor Activity Instance (optional): </label>
                <Controller
                  name={`instructions.${index}.ancestorActivityInstanceId`}
                  control={control}
                  render={({ field }) => {
                    const selectedActivityId = watch(`instructions.${index}.activityId`);
                    const selectedActivity = activities.find(a => a.id === selectedActivityId);
                    
                    // Find potential ancestor instances - only subprocesses/processes can be ancestors
                    const potentialAncestors = activeInstances.filter(inst => {
                      const activity = activities.find(a => a.id === inst.activityId);
                      return activity?.type?.includes('SubProcess') || activity?.type?.includes('Process');
                    });
                    
                    return (
                      <select {...field} className="form-control" style={{ width: '400px', display: 'inline-block', marginLeft: '10px' }}>
                        <option value="">-- None (default scope) --</option>
                        {potentialAncestors.map(inst => (
                          <option key={inst.id} value={inst.id}>
                            {inst.activityName || inst.activityId} (ID: {inst.id})
                          </option>
                        ))}
                      </select>
                    );
                  }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Variables (JSON, optional): </label>
                <br />
                <textarea
                  className="form-control"
                  placeholder='{"varName": {"value": "someValue", "type": "String", "local": false}}'
                  style={{ 
                    width: '100%', 
                    minHeight: '80px', 
                    fontFamily: 'monospace', 
                    fontSize: '12px',
                    borderColor: jsonErrors.get(index) ? '#dc3545' : undefined,
                    backgroundColor: jsonErrors.get(index) ? '#fff5f5' : undefined
                  }}
                  onChange={(e) => {
                    const value = e.target.value.trim();
                    try {
                      if (value === '') {
                        // Empty is valid
                        setValue(`instructions.${index}.variables`, {});
                        setJsonErrors(new Map(jsonErrors.set(index, '')));
                      } else {
                        const parsed = JSON.parse(value);
                        if (typeof parsed !== 'object' || Array.isArray(parsed)) {
                          throw new Error('Variables must be a JSON object');
                        }
                        setValue(`instructions.${index}.variables`, parsed);
                        setJsonErrors(new Map(jsonErrors.set(index, '')));
                      }
                    } catch (err) {
                      const errorMsg = err instanceof Error ? err.message : 'Invalid JSON syntax';
                      setJsonErrors(new Map(jsonErrors.set(index, errorMsg)));
                    }
                  }}
                />
                {jsonErrors.get(index) && (
                  <small style={{ color: '#dc3545', display: 'block', marginTop: '5px', fontWeight: 'bold' }}>
                    ⚠️ {jsonErrors.get(index)}
                  </small>
                )}
                <small style={{ color: '#666', display: 'block', marginTop: '5px' }}>
                  Format: {'{"varName": {"value": "val", "type": "String|Integer|Boolean|...", "local": true/false}}'}
                </small>
              </div>
            </>
          )}
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ type: 'startBeforeActivity', activityId: '', variables: {} })}
        style={{ 
          marginBottom: '15px', 
          padding: '8px 16px', 
          backgroundColor: '#6c757d', 
          color: 'white', 
          border: 'none', 
          borderRadius: '2px', 
          cursor: 'pointer',
          minWidth: '140px'
        }}
      >
        Add Another Instruction
      </button>

      <div style={{ marginBottom: '15px' }}>
        <label>Annotation (optional): </label>
        <br />
        <input
          type="text"
          {...register('annotation')}
          className="form-control"
          placeholder="Reason for modification"
          style={{ width: '100%', maxWidth: '600px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>
          <input type="checkbox" {...register('skipCustomListeners')} />
          {' '}Skip Custom Listeners
        </label>
        <br />
        <label>
          <input type="checkbox" {...register('skipIoMappings')} />
          {' '}Skip I/O Mappings
        </label>
      </div>

      <div style={{ padding: '10px', backgroundColor: '#fff3cd', border: '1px solid #ffc107', borderRadius: '2px', marginBottom: '15px' }}>
        <strong>⚠️ Warning:</strong> Process instance modification is a powerful operation that can lead to inconsistent process states. 
        Use with extreme care and only if you understand the consequences.
      </div>

      <button
        type="submit"
        disabled={submitted}
        style={{ 
          padding: '8px 16px', 
          backgroundColor: submitted ? '#adb5bd' : '#495057', 
          color: 'white', 
          border: 'none', 
          borderRadius: '2px', 
          cursor: submitted ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          minWidth: '160px'
        }}
      >
        {submitted ? 'Modifying...' : 'Apply Modifications'}
      </button>
    </form>
  );
};

export default [
  {
    id: 'instanceTabModify',
    pluginPoint: 'cockpit.processInstance.runtime.tab',
    properties: {
      label: 'Modify',
    },
    render: (node: Element, { api, processInstanceId, processData }: InstancePluginParams) => {
      (async () => {
        // Get the process definition ID from processData
        const processDefinitionId = processData?.definitionId || processData?.processDefinitionId;
        
        console.log('Plugin render - processInstanceId:', processInstanceId);
        console.log('Plugin render - processData:', processData);
        console.log('Plugin render - processDefinitionId:', processDefinitionId);
        
        createRoot(node!).render(
          <React.StrictMode>
            <ModifyForm 
              api={api} 
              processInstanceId={processInstanceId} 
              processDefinitionId={processDefinitionId}
              processData={processData}
            />
          </React.StrictMode>
        );
      })();
    },
  },
];
