import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { useForm, useFieldArray, Controller, FormProvider } from 'react-hook-form';

import { InstancePluginParams } from './types';
import { get, post } from './utils/api';
import { getBpmnElements, BpmnElement } from './utils/bpmnParsing';
import { Tabs, Tab } from './Components/Tabs';
import MessageCorrelationForm from './Components/MessageCorrelationForm';
import VariableBuilder from './Components/VariableBuilder';

// Declare angular globally
declare const angular: any;

interface Variable {
  name: string;
  type: string;
  value: any;
  local?: boolean;
}

interface ModificationInstruction {
  type: 'startBeforeActivity' | 'startAfterActivity' | 'startTransition' | 'cancel';
  activityId?: string;
  transitionId?: string;
  activityInstanceId?: string;
  ancestorActivityInstanceId?: string;
  variables?: Variable[];
}

interface ModifyFormData {
  instructions: ModificationInstruction[];
  annotation: string;
  skipCustomListeners: boolean;
  skipIoMappings: boolean;
}

interface ActiveActivityInstance {
  id: string;
  activityId: string;
  activityName?: string;
  parentActivityInstanceId?: string;
}

const ModifyForm: React.FC<InstancePluginParams> = ({ api, processInstanceId, processDefinitionId, processData }) => {
  const [activities, setActivities] = useState<BpmnElement[]>([]);
  const [sequenceFlows, setSequenceFlows] = useState<BpmnElement[]>([]);
  const [activeInstances, setActiveInstances] = useState<ActiveActivityInstance[]>([]);
  const [activityCounts, setActivityCounts] = useState<Map<string, number>>(new Map());
  const [cancelMethods, setCancelMethods] = useState<Map<number, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actualProcessDefId, setActualProcessDefId] = useState<string | null>(null);

  const methods = useForm<ModifyFormData>({
    defaultValues: {
      instructions: [{ type: 'startBeforeActivity', activityId: '', variables: [] }],
      annotation: '',
      skipCustomListeners: false,
      skipIoMappings: false,
    },
  });

  const { control, handleSubmit, register, watch, setValue } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'instructions',
  });

  useEffect(() => {
    const loadActivities = async () => {
      try {
        setLoading(true);
        let defId = processDefinitionId || processData?.definitionId || processData?.processDefinitionId;
        if (!defId) {
          const instanceData = await get(api, `/process-instance/${processInstanceId}`);
          defId = instanceData?.definitionId;
        }
        if (!defId) {
          throw new Error('Could not determine process definition ID');
        }
        setActualProcessDefId(defId);

        const { activities, sequenceFlows } = await getBpmnElements(defId, api);
        setActivities(activities);
        setSequenceFlows(sequenceFlows);

        const unfinishedActivityInstances = await get(api, '/history/activity-instance', {
          processInstanceId,
          unfinished: 'true',
        });

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

  const transformVariables = (vars: Variable[]) => {
    if (!vars) return {};
    return vars.reduce((acc, v) => {
      let value = v.value;
      if (v.type === 'Boolean') {
        value = v.value === 'true';
      } else if (['Integer', 'Double', 'Short', 'Long'].includes(v.type)) {
        value = parseFloat(v.value);
      } else if (['Json', 'Object'].includes(v.type)) {
        try {
          value = JSON.parse(v.value);
        } catch (e) {
          // ignore parsing errors, the backend will catch them
        }
      }

      acc[v.name] = {
        value,
        type: v.type,
        local: v.local,
      };
      return acc;
    }, {} as any);
  };

  const onSubmit = async (data: ModifyFormData) => {
    try {
      setSubmitted(true);
      setError(null);

      const payload = {
        skipCustomListeners: data.skipCustomListeners,
        skipIoMappings: data.skipIoMappings,
        instructions: data.instructions
          .filter(inst => {
            if (inst.type === 'startTransition') {
              return !!inst.transitionId;
            } else if (inst.type === 'cancel') {
              return !!(inst.activityInstanceId || inst.activityId);
            } else {
              return !!inst.activityId;
            }
          })
          .map(inst => {
            const instruction: any = { type: inst.type };
            if (inst.activityId) instruction.activityId = inst.activityId;
            if (inst.transitionId) instruction.transitionId = inst.transitionId;
            if (inst.activityInstanceId) instruction.activityInstanceId = inst.activityInstanceId;
            if (inst.ancestorActivityInstanceId)
              instruction.ancestorActivityInstanceId = inst.ancestorActivityInstanceId;
            if (inst.variables && inst.variables.length > 0) {
              instruction.variables = transformVariables(inst.variables);
            }
            return instruction;
          }),
        annotation: data.annotation || 'Modified via Cockpit plugin',
      };

      await post(api, `/process-instance/${processInstanceId}/modification`, {}, JSON.stringify(payload));

      // Show success message instead of immediate refresh
      setError('Process instance modified successfully! The page will refresh to show updates.');
      setSubmitted(false);
      
      // Delay refresh to allow user to see success message
      setTimeout(() => {
        try {
          const injector = angular.element(document.body).injector();
          const $route = injector.get('$route');
          $route.reload();
        } catch (angularErr) {
          console.error('Failed to reload Angular route:', angularErr);
          window.location.reload();
        }
      }, 2000);
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
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '10px' }}>
        <h4>Modification Instructions</h4>

        {fields.map((field, index) => (
          <div
            key={field.id}
            style={{
              marginBottom: '15px',
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: '#f9f9f9',
            }}
          >
            <div style={{ marginBottom: '10px' }}>
              <label>Instruction Type: </label>
              <Controller
                name={`instructions.${index}.type`}
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    className="form-control"
                    style={{ width: '300px', display: 'inline-block', marginLeft: '10px' }}
                  >
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
                    minWidth: '90px',
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
                      <select
                        {...field}
                        className="form-control"
                        style={{ width: '400px', display: 'inline-block', marginLeft: '10px' }}
                      >
                        <option value="">-- Select Sequence Flow --</option>
                        {sequenceFlows.map(flow => (
                          <option key={flow.id} value={flow.id}>
                            {flow.name}
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
                      <select
                        {...field}
                        className="form-control"
                        style={{ width: '400px', display: 'inline-block', marginLeft: '10px' }}
                      >
                        <option value="">-- None (default scope) --</option>
                        {activeInstances
                          .filter(inst => {
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
                    onChange={e => {
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
                        <select
                          {...field}
                          className="form-control"
                          style={{ width: '400px', display: 'inline-block', marginLeft: '10px' }}
                        >
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
                        <select
                          {...field}
                          className="form-control"
                          style={{ width: '400px', display: 'inline-block', marginLeft: '10px' }}
                        >
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
                      <select
                        {...field}
                        className="form-control"
                        style={{ width: '400px', display: 'inline-block', marginLeft: '10px' }}
                      >
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
                      const potentialAncestors = activeInstances.filter(inst => {
                        const activity = activities.find(a => a.id === inst.activityId);
                        return activity?.type?.includes('SubProcess') || activity?.type?.includes('Process');
                      });

                      return (
                        <select
                          {...field}
                          className="form-control"
                          style={{ width: '400px', display: 'inline-block', marginLeft: '10px' }}
                        >
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
                  <h5>Variables</h5>
                  <VariableBuilder name={`instructions.${index}.variables`} showLocalFlag={true} />
                </div>
              </>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={() => append({ type: 'startBeforeActivity', activityId: '', variables: [] })}
          style={{
            marginBottom: '15px',
            padding: '8px 16px',
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '2px',
            cursor: 'pointer',
            minWidth: '140px',
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
            <input type="checkbox" {...register('skipCustomListeners')} /> Skip Custom Listeners
          </label>
          <br />
          <label>
            <input type="checkbox" {...register('skipIoMappings')} /> Skip I/O Mappings
          </label>
        </div>

        <div
          style={{
            padding: '10px',
            backgroundColor: '#fff3cd',
            border: '1px solid #ffc107',
            borderRadius: '2px',
            marginBottom: '15px',
          }}
        >
          <strong>⚠️ Warning:</strong> Process instance modification is a powerful operation that can lead to
          inconsistent process states. Use with extreme care and only if you understand the consequences.
        </div>

        {error && (
          <div
            style={{
              padding: '10px',
              marginBottom: '15px',
              backgroundColor: error.includes('successfully') ? '#d4edda' : '#ffebee',
              color: error.includes('successfully') ? '#155724' : '#c62828',
              borderRadius: '2px',
              border: error.includes('successfully') ? '1px solid #c3e6cb' : '1px solid #ef5350',
            }}
          >
            <strong>{error.includes('successfully') ? 'Success:' : 'Error:'}</strong> {error}
          </div>
        )}

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
            minWidth: '160px',
          }}
        >
          {submitted ? 'Modifying...' : 'Apply Modifications'}
        </button>
      </form>
    </FormProvider>
  );
};

const ModifyTab: React.FC<InstancePluginParams> = props => {
  return (
    <Tabs>
      <Tab label="Modify Instance">
        <ModifyForm {...props} />
      </Tab>
      <Tab label="Correlate Message">
        <MessageCorrelationForm {...props} />
      </Tab>
    </Tabs>
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

        createRoot(node!).render(
          <React.StrictMode>
            <ModifyTab
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
