import type {
  API,
  DecisionDefinition,
  ExternalTask,
  HistoricActivityInstance,
  HistoricDecisionInstance,
  HistoricProcessInstance,
  HistoricVariableInstance,
  ProcessDefinition,
  ProcessInstance,
  VariableValueDto,
} from '../types';
import { loadSettings } from './misc';

/**
 * Gets the configured max results setting as a string for API params.
 * @returns The max results value from settings as a string
 */
function getMaxResultsParam(): string {
  return String(loadSettings().maxResults);
}

// =============================================================================
// Request Caching Layer
// =============================================================================

/** Cache entry with expiration */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

/** Cache TTL duration in minutes */
const CACHE_TTL_MINUTES = 5;

/** Seconds per minute */
const SECONDS_PER_MINUTE = 60;

/** Default cache TTL in milliseconds (5 minutes) */
const CACHE_TTL_MS = CACHE_TTL_MINUTES * SECONDS_PER_MINUTE * 1000;

/** In-memory cache for process definition XML */
const processDefinitionXmlCache = new Map<string, CacheEntry<{ id: string; bpmn20Xml: string }>>();

/** In-memory cache for process definitions */
const processDefinitionCache = new Map<string, CacheEntry<ProcessDefinition>>();

/**
 * Checks if a cache entry is still valid.
 * @param entry - The cache entry to check
 * @returns True if the entry is valid and not expired
 */
function isCacheValid<T>(entry: CacheEntry<T> | undefined): entry is CacheEntry<T> {
  if (!entry) {
    return false;
  }
  return Date.now() - entry.timestamp < CACHE_TTL_MS;
}

/**
 * Clears all API caches.
 * Useful for testing or when data may have changed.
 */
export function clearApiCache(): void {
  processDefinitionXmlCache.clear();
  processDefinitionCache.clear();
}

/**
 * Custom error class for API errors with status code and response body.
 */
export class ApiError extends Error {
  /** HTTP status code */
  readonly status: number;
  /** Response body (parsed JSON or text) */
  readonly body: unknown;
  /** API endpoint path */
  readonly path: string;

  /**
   *
   */
  constructor(message: string, status: number, body: unknown, path: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
    this.path = path;
  }
}

/**
 * Type definition for a fetch function
 */
export type FetchFunction = typeof fetch;

/**
 * Injectable fetch function for testing purposes.
 * Defaults to the global fetch.
 */
let fetchFn: FetchFunction = fetch;

/**
 * Sets a custom fetch function for testing purposes.
 * @param fn - The fetch function to use
 */
export function setFetchFunction(fn: FetchFunction): void {
  fetchFn = fn;
}

/**
 * Resets the fetch function to the global fetch.
 */
export function resetFetchFunction(): void {
  fetchFn = fetch;
}

/**
 * Gets the current fetch function.
 * @returns The current fetch function
 */
export function getFetchFunction(): FetchFunction {
  return fetchFn;
}

/**
 * Builds headers for API requests with CSRF token.
 * @param api - The API configuration object
 * @returns Headers object for fetch requests
 */
export const headers = (api: API): Record<string, string> => {
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-XSRF-TOKEN': api.CSRFToken,
  };
};

/**
 * Parses response body based on content type.
 * @param res - The fetch Response object
 * @returns Parsed JSON or text content
 */
async function parseResponseBody(res: Response): Promise<unknown> {
  const contentType = res.headers.get('Content-Type') ?? '';
  if (contentType.startsWith('application/json')) {
    return res.json();
  }
  return res.text();
}

/**
 * Makes a GET request to the engine API.
 * @param api - The API configuration object
 * @param path - The API endpoint path
 * @param params - Optional query parameters
 * @returns Promise resolving to the response data
 * @throws {ApiError} When the response status is not 2xx
 */
export const get = async (api: API, path: string, params?: Record<string, string>): Promise<unknown> => {
  // XXX: Workaround a possible bug where engine api has been parsed wrong
  if (/\/#\//.exec(api.engine)) {
    const splitResult = api.engine.split('/#/')[0];
    api.engine = (splitResult ?? '').replace(/.*\//g, '');
    api.engineApi = `${api.baseApi}/engine/${api.engine}`;
  }

  params = params ?? {};
  if (
    ['/history/activity-instance', '/history/variable-instance', '/history/decision-instance'].includes(path) &&
    !params['maxResults']
  ) {
    params['maxResults'] = getMaxResultsParam();
  }

  const query = new URLSearchParams(params).toString();
  const url = query ? `${api.engineApi}${path}?${query}` : `${api.engineApi}${path}`;
  const res = await fetchFn(url, {
    method: 'get',
    headers: headers(api),
  });

  const body = await parseResponseBody(res);

  if (res.ok) {
    return body;
  } else {
    const message =
      typeof body === 'object' && body !== null && 'message' in body
        ? String(body.message)
        : `API error: ${res.status}`;
    throw new ApiError(message, res.status, body, path);
  }
};

/**
 * Makes a POST request to the engine API.
 * @param api - The API configuration object
 * @param path - The API endpoint path
 * @param params - Optional query parameters
 * @param payload - Optional request body
 * @returns Promise resolving to the response data
 * @throws {ApiError} When the response status is not 2xx
 */
export const post = async (
  api: API,
  path: string,
  params?: Record<string, string>,
  payload?: string
): Promise<unknown> => {
  params = params ?? {};
  if (
    ['/history/activity-instance', '/history/variable-instance', '/history/decision-instance'].includes(path) &&
    !params['maxResults']
  ) {
    params['maxResults'] = getMaxResultsParam();
  }

  const query = new URLSearchParams(params).toString();
  const body: BodyInit | null = payload ?? null;
  const url = query ? `${api.engineApi}${path}?${query}` : `${api.engineApi}${path}`;
  const res = await fetchFn(url, {
    method: 'post',
    headers: headers(api),
    body,
  });

  const responseBody = await parseResponseBody(res);

  if (res.ok) {
    return responseBody;
  } else {
    const message =
      typeof responseBody === 'object' && responseBody !== null && 'message' in responseBody
        ? String(responseBody.message)
        : `API error: ${res.status}`;
    throw new ApiError(message, res.status, responseBody, path);
  }
};

// =============================================================================
// Typed API Client Functions
// =============================================================================

/**
 * Fetches historic activity instances for a process instance.
 * @param api - The API configuration object
 * @param processInstanceId - The process instance ID
 * @param params - Optional additional query parameters
 * @returns Promise resolving to array of historic activity instances
 */
export async function getActivities(
  api: API,
  processInstanceId: string,
  params?: Record<string, string>
): Promise<HistoricActivityInstance[]> {
  return (await get(api, '/history/activity-instance', {
    processInstanceId,
    ...params,
  })) as HistoricActivityInstance[];
}

/**
 * Fetches historic variable instances for a process instance.
 * @param api - The API configuration object
 * @param processInstanceId - The process instance ID
 * @param params - Optional additional query parameters
 * @returns Promise resolving to array of historic variable instances
 */
export async function getVariables(
  api: API,
  processInstanceId: string,
  params?: Record<string, string>
): Promise<HistoricVariableInstance[]> {
  return (await get(api, '/history/variable-instance', {
    processInstanceId,
    ...params,
  })) as HistoricVariableInstance[];
}

/**
 * Fetches historic decision instances for a process instance.
 * @param api - The API configuration object
 * @param processInstanceId - The process instance ID
 * @param params - Optional additional query parameters
 * @returns Promise resolving to array of historic decision instances
 */
export async function getDecisions(
  api: API,
  processInstanceId: string,
  params?: Record<string, string>
): Promise<HistoricDecisionInstance[]> {
  return (await get(api, '/history/decision-instance', {
    processInstanceId,
    ...params,
  })) as HistoricDecisionInstance[];
}

/**
 * Fetches a process definition by ID.
 * Results are cached for 5 minutes since process definitions rarely change.
 * @param api - The API configuration object
 * @param processDefinitionId - The process definition ID
 * @returns Promise resolving to the process definition
 */
export async function getProcessDefinition(api: API, processDefinitionId: string): Promise<ProcessDefinition> {
  // Check cache first
  const cached = processDefinitionCache.get(processDefinitionId);
  if (isCacheValid(cached)) {
    return cached.data;
  }

  const data = (await get(api, `/process-definition/${processDefinitionId}`)) as ProcessDefinition;

  // Store in cache
  processDefinitionCache.set(processDefinitionId, {
    data,
    timestamp: Date.now(),
  });

  return data;
}

/**
 * Fetches the BPMN XML for a process definition.
 * Results are cached for 5 minutes since BPMN XML doesn't change for a given definition ID.
 * @param api - The API configuration object
 * @param processDefinitionId - The process definition ID
 * @returns Promise resolving to the BPMN XML object with id and bpmn20Xml properties
 */
export async function getProcessDefinitionXml(
  api: API,
  processDefinitionId: string
): Promise<{ id: string; bpmn20Xml: string }> {
  // Check cache first
  const cached = processDefinitionXmlCache.get(processDefinitionId);
  if (isCacheValid(cached)) {
    return cached.data;
  }

  const data = (await get(api, `/process-definition/${processDefinitionId}/xml`)) as { id: string; bpmn20Xml: string };

  // Store in cache
  processDefinitionXmlCache.set(processDefinitionId, {
    data,
    timestamp: Date.now(),
  });

  return data;
}

/**
 * Fetches a running process instance by ID.
 * @param api - The API configuration object
 * @param processInstanceId - The process instance ID
 * @returns Promise resolving to the process instance
 */
export async function getProcessInstance(api: API, processInstanceId: string): Promise<ProcessInstance> {
  return (await get(api, `/process-instance/${processInstanceId}`)) as ProcessInstance;
}

/**
 * Fetches a historic process instance by ID.
 * @param api - The API configuration object
 * @param processInstanceId - The process instance ID
 * @returns Promise resolving to the historic process instance
 */
export async function getHistoricProcessInstance(
  api: API,
  processInstanceId: string
): Promise<HistoricProcessInstance> {
  return (await get(api, `/history/process-instance/${processInstanceId}`)) as HistoricProcessInstance;
}

/**
 * Fetches the count of historic process instances for a process definition.
 * @param api - The API configuration object
 * @param processDefinitionId - The process definition ID
 * @returns Promise resolving to the count
 */
export async function getHistoricProcessInstanceCount(api: API, processDefinitionId: string): Promise<number> {
  const result = (await get(api, '/history/process-instance/count', { processDefinitionId })) as { count: number };
  return result.count;
}

/**
 * Fetches external tasks for a process instance.
 * @param api - The API configuration object
 * @param processInstanceId - The process instance ID
 * @param params - Optional additional query parameters
 * @returns Promise resolving to array of external tasks
 */
export async function getExternalTasks(
  api: API,
  processInstanceId: string,
  params?: Record<string, string>
): Promise<ExternalTask[]> {
  return (await get(api, '/external-task', {
    processInstanceId,
    ...params,
  })) as ExternalTask[];
}

/**
 * Unlocks an external task.
 * @param api - The API configuration object
 * @param externalTaskId - The external task ID
 * @returns Promise resolving when the task is unlocked
 */
export async function unlockExternalTask(api: API, externalTaskId: string): Promise<void> {
  await post(api, `/external-task/${externalTaskId}/unlock`);
}

/**
 * Fetches a task by ID.
 * @param api - The API configuration object
 * @param taskId - The task ID
 * @returns Promise resolving to the task with processInstanceId
 */
export async function getTask(api: API, taskId: string): Promise<{ processInstanceId: string }> {
  return (await get(api, `/task/${taskId}`)) as { processInstanceId: string };
}

/**
 * Fetches the engine version.
 * @param api - The API configuration object
 * @returns Promise resolving to the version object
 */
export async function getVersion(api: API): Promise<{ version: string }> {
  return (await get(api, '/version')) as { version: string };
}

/**
 * Submits a process instance modification.
 * @param api - The API configuration object
 * @param processInstanceId - The process instance ID
 * @param payload - The modification payload
 * @returns Promise resolving when modification is complete
 */
export async function modifyProcessInstance(
  api: API,
  processInstanceId: string,
  payload: Record<string, unknown>
): Promise<void> {
  await post(api, `/process-instance/${processInstanceId}/modification`, {}, JSON.stringify(payload));
}

// =============================================================================
// Decision Definition API Functions
// =============================================================================

/**
 * Fetches all decision definitions.
 * @param api - The API configuration object
 * @param params - Optional query parameters for filtering
 * @returns Promise resolving to array of decision definitions
 */
export async function getDecisionDefinitions(api: API, params?: Record<string, string>): Promise<DecisionDefinition[]> {
  return (await get(api, '/decision-definition', {
    sortBy: 'name',
    sortOrder: 'asc',
    latestVersion: 'true',
    ...params,
  })) as DecisionDefinition[];
}

/**
 * Fetches a decision definition by ID.
 * @param api - The API configuration object
 * @param decisionDefinitionId - The decision definition ID
 * @returns Promise resolving to the decision definition
 */
export async function getDecisionDefinition(api: API, decisionDefinitionId: string): Promise<DecisionDefinition> {
  return (await get(api, `/decision-definition/${decisionDefinitionId}`)) as DecisionDefinition;
}

/**
 * Fetches the DMN XML for a decision definition.
 * @param api - The API configuration object
 * @param decisionDefinitionId - The decision definition ID
 * @returns Promise resolving to the DMN XML object
 */
export async function getDecisionDefinitionXml(
  api: API,
  decisionDefinitionId: string
): Promise<{ id: string; dmnXml: string }> {
  return (await get(api, `/decision-definition/${decisionDefinitionId}/xml`)) as { id: string; dmnXml: string };
}

/** Decision evaluation result type */
export type DecisionEvaluationResult = Record<string, VariableValueDto>[];

/**
 * Evaluates a decision definition with the given variables.
 * @param api - The API configuration object
 * @param decisionDefinitionId - The decision definition ID
 * @param variables - The input variables for evaluation
 * @returns Promise resolving to array of result records
 */
export async function evaluateDecision(
  api: API,
  decisionDefinitionId: string,
  variables: Record<string, VariableValueDto>
): Promise<DecisionEvaluationResult> {
  return (await post(
    api,
    `/decision-definition/${decisionDefinitionId}/evaluate`,
    {},
    JSON.stringify({ variables })
  )) as DecisionEvaluationResult;
}
