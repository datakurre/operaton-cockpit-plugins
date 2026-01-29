/**
 * Custom React hooks for data fetching
 *
 * @module hooks/useData
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { API } from '../types';
import { get } from '../utils/api';
import { getBpmnElements, BpmnElement, BpmnMessage } from '../utils/bpmnParsing';

/**
 * Common state for async data hooks
 */
interface AsyncState<T> {
  data: T;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Activity instance from the history API
 */
interface ActivityInstance {
  id: string;
  activityId: string;
  activityName?: string;
  activityType?: string;
  startTime: string;
  endTime?: string;
  canceled?: boolean;
  parentActivityInstanceId?: string;
  calledProcessInstanceId?: string;
}

/**
 * Variable instance from the history API
 */
interface VariableInstance {
  id: string;
  name: string;
  type: string;
  value: unknown;
  processInstanceId: string;
  activityInstanceId?: string;
}

/**
 * Hook for fetching activity instances for a process instance
 * @param api - API configuration
 * @param processInstanceId - The process instance ID
 * @param params - Additional query parameters
 * @returns Async state with activities array
 */
export function useActivities(
  api: API,
  processInstanceId: string,
  params?: Record<string, string>
): AsyncState<ActivityInstance[]> {
  const [data, setData] = useState<ActivityInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(() => {
    const doFetch = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);
        const queryParams = { processInstanceId, ...params };
        const activities: unknown = await get(api, '/history/activity-instance', queryParams);
        setData(activities as ActivityInstance[]);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch activities';
        setError(message);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    void doFetch();
  }, [api, processInstanceId, params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

/**
 * Hook for fetching variable instances for a process instance
 * @param api - API configuration
 * @param processInstanceId - The process instance ID
 * @param params - Additional query parameters
 * @returns Async state with variables array
 */
export function useVariables(
  api: API,
  processInstanceId: string,
  params?: Record<string, string>
): AsyncState<VariableInstance[]> {
  const [data, setData] = useState<VariableInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(() => {
    const doFetch = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);
        const queryParams = { processInstanceId, ...params };
        const variables: unknown = await get(api, '/history/variable-instance', queryParams);
        setData(variables as VariableInstance[]);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch variables';
        setError(message);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };
    void doFetch();
  }, [api, processInstanceId, params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

/**
 * Result of BPMN elements hook
 */
interface BpmnElementsResult {
  activities: BpmnElement[];
  sequenceFlows: BpmnElement[];
  messages: BpmnMessage[];
}

/**
 * Hook for fetching BPMN elements for a process definition
 * @param api - API configuration
 * @param processDefinitionId - The process definition ID
 * @returns Async state with BPMN elements
 */
export function useBpmnElements(api: API, processDefinitionId: string | null): AsyncState<BpmnElementsResult> {
  const emptyResult = useMemo<BpmnElementsResult>(() => ({ activities: [], sequenceFlows: [], messages: [] }), []);
  const [data, setData] = useState<BpmnElementsResult>(emptyResult);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(() => {
    if (processDefinitionId === null) {
      setData(emptyResult);
      setIsLoading(false);
      return;
    }

    const doFetch = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);
        const elements = await getBpmnElements(processDefinitionId, api);
        setData(elements);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch BPMN elements';
        setError(message);
        setData(emptyResult);
      } finally {
        setIsLoading(false);
      }
    };
    void doFetch();
  }, [api, processDefinitionId, emptyResult]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}

/**
 * Hook for managing plugin settings
 * @returns Settings state and update function
 */
export { loadSettings, saveSettings, type PluginSettings } from '../utils/misc';

import { loadSettings, saveSettings, PluginSettings } from '../utils/misc';

/**
 * Hook for managing plugin settings with React state
 * @returns Settings state and update function
 */
export function useSettings(): {
  settings: PluginSettings;
  updateSettings: (updates: Partial<PluginSettings>) => void;
} {
  const [settings, setSettings] = useState<PluginSettings>(loadSettings);

  const updateSettings = useCallback((updates: Partial<PluginSettings>) => {
    setSettings(current => {
      const newSettings = { ...current, ...updates };
      saveSettings(newSettings);
      return newSettings;
    });
  }, []);

  return { settings, updateSettings };
}
