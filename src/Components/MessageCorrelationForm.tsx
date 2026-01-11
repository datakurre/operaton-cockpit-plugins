import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { InstancePluginParams } from '../types';
import { get, post } from '../utils/api';
import { getBpmnElements, BpmnMessage } from '../utils/bpmnParsing';
import VariableBuilder from './VariableBuilder';

interface Variable {
  name: string;
  type: string;
  value: any;
  local?: boolean;
}

interface CorrelationFormData {
  messageName: string;
  correlationKeys: Variable[];
  localCorrelationKeys: Variable[];
  processVariables: Variable[];
  processVariablesLocal: Variable[];
}

declare const angular: any;

const MessageCorrelationForm: React.FC<InstancePluginParams> = ({
  api,
  processInstanceId,
  processDefinitionId,
  processData,
}) => {
  const [messages, setMessages] = useState<BpmnMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [advanced, setAdvanced] = useState(false);

  const methods = useForm<CorrelationFormData>({
    defaultValues: {
      correlationKeys: [],
      localCorrelationKeys: [],
      processVariables: [],
      processVariablesLocal: [],
    },
  });

  useEffect(() => {
    const loadMessages = async () => {
      try {
        setLoading(true);
        let defId = processDefinitionId || processData?.definitionId || processData?.processDefinitionId;
        if (!defId) {
          const instanceData = await get(api, `/process-instance/${processInstanceId}`);
          defId = instanceData.definitionId;
        }

        if (defId) {
          const { messages } = await getBpmnElements(defId, api);
          setMessages(messages);
        } else {
          throw new Error('Could not determine process definition ID.');
        }
      } catch (err) {
        setError('Failed to load BPMN messages.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadMessages();
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
      };
      return acc;
    }, {} as any);
  };

  const onSubmit = async (data: CorrelationFormData) => {
    try {
      setSubmitted(true);
      setError(null);

      const payload: any = {
        messageName: data.messageName,
        processInstanceId,
        all: false,
        correlationKeys: transformVariables(data.correlationKeys),
        localCorrelationKeys: transformVariables(data.localCorrelationKeys),
        processVariables: transformVariables(data.processVariables),
        processVariablesLocal: transformVariables(data.processVariablesLocal),
      };

      await post(api, '/message', {}, JSON.stringify(payload));

      // Show success message instead of immediate refresh
      setError('Message correlated successfully! The page will refresh to show updates.');
      
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
      setError('Failed to correlate message.');
      console.error(err);
    } finally {
      setSubmitted(false);
    }
  };

  if (loading) {
    return <p>Loading messages...</p>;
  }

  if (messages.length === 0 && !error) {
    return (
      <div style={{ padding: '10px' }}>
        <p>No message catch events found in the process definition.</p>
        <p style={{ fontSize: '0.9em', color: '#666' }}>
          Message correlation requires the process to have message intermediate catch events, message boundary events,
          or receive tasks.
        </p>
      </div>
    );
  }

  // Show error during initial load (not post-submission errors/success)
  if (messages.length === 0 && error && !error.includes('successfully')) {
    return (
      <div style={{ padding: '10px' }}>
        <div 
          style={{ 
            padding: '15px',
            marginBottom: '15px',
            borderRadius: '4px',
            backgroundColor: '#f8d7da',
            color: '#721c24',
            border: '1px solid #f5c6cb'
          }}
        >
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} style={{ padding: '10px' }}>
        <div className="form-group">
          <label>Message Name</label>
          <select {...methods.register('messageName')} className="form-control">
            {messages.map(msg => (
              <option key={msg.id} value={msg.name}>
                {msg.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>
            <input type="checkbox" checked={advanced} onChange={() => setAdvanced(!advanced)} /> Advanced Options
          </label>
        </div>

        {advanced && (
          <>
            <div className="form-group">
              <h5>Correlation Keys</h5>
              <VariableBuilder name="correlationKeys" showLocalFlag={false} />
            </div>
            <div className="form-group">
              <h5>Local Correlation Keys</h5>
              <VariableBuilder name="localCorrelationKeys" showLocalFlag={false} />
            </div>
            <div className="form-group">
              <h5>Process Variables</h5>
              <VariableBuilder name="processVariables" showLocalFlag={false} />
            </div>
            <div className="form-group">
              <h5>Process Variables Local</h5>
              <VariableBuilder name="processVariablesLocal" showLocalFlag={false} />
            </div>
          </>
        )}

        {error && (
          <div 
            style={{ 
              padding: '15px',
              marginBottom: '15px',
              borderRadius: '4px',
              backgroundColor: error.includes('successfully') ? '#d4edda' : '#f8d7da',
              color: error.includes('successfully') ? '#155724' : '#721c24',
              border: error.includes('successfully') ? '1px solid #c3e6cb' : '1px solid #f5c6cb'
            }}
          >
            <strong>{error.includes('successfully') ? 'Success:' : 'Error:'}</strong> {error}
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={submitted}>
          {submitted ? 'Correlating...' : 'Correlate Message'}
        </button>
      </form>
    </FormProvider>
  );
};

export default MessageCorrelationForm;
