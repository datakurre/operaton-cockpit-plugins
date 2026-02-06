/**
 * Cockpit plugin for testing DMN decision tables.
 * Provides a dashboard for selecting decision definitions, filling inputs,
 * evaluating decisions, and visualizing results with hit highlighting.
 * @module decisions-dashboard
 */

// Styles
import './decisions-dashboard.scss';

// React
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';

// Third-party libraries
import type DmnJsViewer from 'dmn-js';
import type { DmnElement, DmnInput, DmnOutput } from 'dmn-js';

// Local components
import DecisionInputForm, { DecisionInputField } from './Components/DecisionInputForm';
import DecisionResults, { DecisionOutputField } from './Components/DecisionResults';
import DecisionSelector from './Components/DecisionSelector';
import DmnViewer from './Components/DmnViewer';
import ErrorMessage from './Components/ErrorMessage';
import SuccessMessage from './Components/SuccessMessage';
import DashboardSection from './Components/DashboardSection';

// Local utilities
import {
  evaluateDecision,
  getDecisionDefinitions,
  getDecisionDefinitionXml,
  getLatestDecisionInstance,
  DecisionEvaluationResult,
} from './utils/api';

// Types
import type { API, DecisionDefinition, VariableValueDto } from './types';

/** Plugin parameters for dashboard route */
interface DashboardPluginParams {
  api: API;
}

/** Maps DMN type references to variable types for API */
const TYPE_REF_MAP: Record<string, string> = {
  string: 'String',
  boolean: 'Boolean',
  integer: 'Integer',
  long: 'Long',
  double: 'Double',
  date: 'Date',
};

/**
 * Converts a DMN typeRef to an Operaton variable type.
 * @param typeRef - The DMN type reference
 * @returns The Operaton variable type
 */
function getVariableType(typeRef: string | undefined): string {
  if (!typeRef) {
    return 'String';
  }
  return TYPE_REF_MAP[typeRef.toLowerCase()] ?? 'String';
}

/**
 * Parses input value based on its type.
 * @param value - The raw string value
 * @param type - The variable type
 * @returns The parsed value
 */
function parseInputValue(value: string, type: string): unknown {
  if (value === '') {
    return null;
  }

  switch (type) {
    case 'Boolean':
      return value === 'true';
    case 'Integer':
    case 'Long':
      return parseInt(value, 10);
    case 'Double':
      return parseFloat(value);
    default:
      return value;
  }
}

/**
 * Highlights matched rules in the DMN viewer using rule IDs from history.
 *
 * After evaluating a decision, we query the decision history to get the matched
 * rule IDs, then use dmn-js's data-row-id attributes to highlight the correct rows.
 *
 * This approach works correctly for all hit policies (FIRST, UNIQUE, COLLECT, RULE ORDER, etc.)
 * because it uses the actual rule IDs returned by the engine.
 *
 * @param viewerRef - Reference to the DMN viewer
 * @param ruleIds - Array of matched rule IDs from the decision history
 */
function highlightMatchedRules(viewerRef: React.RefObject<DmnJsViewer | null>, ruleIds: string[]): void {
  if (viewerRef.current === null || ruleIds.length === 0) {
    return;
  }

  const activeViewer = viewerRef.current.getActiveViewer();
  if (activeViewer === null) {
    console.warn('No active viewer');
    return;
  }

  // Delay to ensure DOM is ready
  setTimeout(() => {
    try {
      // Clear previous highlights
      const existingStyle = document.getElementById('dmn-rule-highlights');
      if (existingStyle) {
        existingStyle.remove();
      }

      console.log(`Highlighting ${ruleIds.length} rules:`, ruleIds);

      // Create dynamic CSS rules using data-row-id selectors (same as dmn-testing-plugin)
      const firstRuleId = ruleIds[0];
      const otherRuleIds = ruleIds.slice(1);

      const firstRowSelector = `[data-row-id="${firstRuleId}"]`;
      const otherRowSelectors = otherRuleIds.map(id => `[data-row-id="${id}"]`).join(',');

      const cssRules = `
        /* First matched rule - blue highlight */
        ${firstRowSelector},
        ${firstRowSelector} > * {
          background-color: #cce5ff !important;
        }
        ${firstRowSelector} > * {
          font-weight: 500 !important;
        }
        
        /* Other matched rules - green highlight */
        ${otherRowSelectors ? `${otherRowSelectors},` : ''}
        ${otherRowSelectors ? `${otherRowSelectors} > * {` : ''}
        ${otherRowSelectors ? `  background-color: #d4edda !important;` : ''}
        ${otherRowSelectors ? `}` : ''}
      `;

      // Inject the dynamic styles
      const styleElement = document.createElement('style');
      styleElement.id = 'dmn-rule-highlights';
      styleElement.textContent = cssRules;
      document.head.appendChild(styleElement);

      console.log(`Successfully highlighted ${ruleIds.length} rules using data-row-id attributes`);
    } catch (e) {
      console.error('Failed to highlight rules:', e);
    }
  }, 100);
}

/**
 * Clears rule highlights from the DMN viewer.
 * @param _viewerRef - Reference to the DMN viewer (unused, kept for API consistency)
 */
function clearRuleHighlights(_viewerRef: React.RefObject<DmnJsViewer | null>): void {
  try {
    const existingStyle = document.getElementById('dmn-rule-highlights');
    if (existingStyle) {
      existingStyle.remove();
      console.log('Cleared DMN rule highlights');
    }
  } catch (e) {
    console.warn('Failed to clear highlights:', e);
  }
}

/**
 * Main decisions dashboard component.
 */
// eslint-disable-next-line max-lines-per-function -- Dashboard with complex state management
const DecisionsDashboard: React.FC<DashboardPluginParams> = ({ api }) => {
  // State
  const [decisions, setDecisions] = useState<DecisionDefinition[]>([]);
  const [selectedDecisionId, setSelectedDecisionId] = useState<string>('');
  const [dmnXml, setDmnXml] = useState<string>('');
  const [inputs, setInputs] = useState<DecisionInputField[]>([]);
  const [outputs, setOutputs] = useState<DecisionOutputField[]>([]);
  const [inputValues, setInputValues] = useState<Record<string, string>>({});
  const [results, setResults] = useState<DecisionEvaluationResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evaluationError, setEvaluationError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Refs for viewer
  const viewerRef = useRef<DmnJsViewer | null>(null);

  // Load decision definitions on mount
  useEffect(() => {
    const loadDecisions = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);
        const defs = await getDecisionDefinitions(api);
        setDecisions(defs);
      } catch (err) {
        console.error('Failed to load decision definitions:', err);
        setError(err instanceof Error ? err.message : 'Failed to load decision definitions');
      } finally {
        setIsLoading(false);
      }
    };
    void loadDecisions();
  }, [api]);

  // Load DMN XML when decision is selected
  useEffect(() => {
    if (!selectedDecisionId) {
      setDmnXml('');
      setInputs([]);
      setOutputs([]);
      setResults(null);
      setEvaluationError(null);
      return;
    }

    const loadDmn = async (): Promise<void> => {
      try {
        setError(null);
        setResults(null);
        setEvaluationError(null);
        const result = await getDecisionDefinitionXml(api, selectedDecisionId);
        setDmnXml(result.dmnXml);
      } catch (err) {
        console.error('Failed to load DMN XML:', err);
        setError(err instanceof Error ? err.message : 'Failed to load DMN XML');
        setDmnXml('');
      }
    };
    void loadDmn();
  }, [api, selectedDecisionId]);

  /**
   * Handles viewer ready callback - extracts inputs and outputs from decision.
   */
  const handleViewerReady = useCallback((viewer: DmnJsViewer, decision: DmnElement | null) => {
    viewerRef.current = viewer;

    if (decision?.decisionLogic === undefined) {
      setInputs([]);
      setOutputs([]);
      return;
    }

    const logic = decision.decisionLogic;

    // Extract inputs
    const parsedInputs: DecisionInputField[] = (logic.input ?? []).map((input: DmnInput) => ({
      id: input.id,
      name: input.inputExpression?.text ?? input.label ?? input.id,
      label: input.label ?? input.inputExpression?.text ?? input.id,
      typeRef: input.inputExpression?.typeRef ?? 'string',
    }));

    // Extract outputs
    const parsedOutputs: DecisionOutputField[] = (logic.output ?? []).map((output: DmnOutput) => ({
      id: output.id,
      name: output.name ?? output.label ?? output.id,
      label: output.label ?? output.name ?? output.id,
      typeRef: output.typeRef ?? 'string',
    }));

    setInputs(parsedInputs);
    setOutputs(parsedOutputs);

    // Initialize input values
    const initialValues: Record<string, string> = {};
    parsedInputs.forEach(input => {
      initialValues[input.name] = '';
    });
    setInputValues(initialValues);
  }, []);

  /**
   * Handles input value change.
   */
  const handleInputChange = useCallback((name: string, value: string) => {
    setInputValues(prev => ({ ...prev, [name]: value }));
  }, []);

  /**
   * Clears all input values and results.
   */
  const handleClear = useCallback(() => {
    const clearedValues: Record<string, string> = {};
    inputs.forEach(input => {
      clearedValues[input.name] = '';
    });
    setInputValues(clearedValues);
    setResults(null);
    setEvaluationError(null);
    setSuccessMessage(null);
    clearRuleHighlights(viewerRef);
  }, [inputs]);

  /**
   * Evaluates the decision with current input values.
   */
  const handleEvaluate = useCallback(async () => {
    if (!selectedDecisionId) {
      return;
    }

    try {
      setIsEvaluating(true);
      setEvaluationError(null);
      setSuccessMessage(null);
      setResults(null);

      // Build variables object
      const variables: Record<string, VariableValueDto> = {};
      inputs.forEach(input => {
        const rawValue = inputValues[input.name] ?? '';
        const type = getVariableType(input.typeRef);
        const parsedValue = parseInputValue(rawValue, type);

        if (parsedValue !== null) {
          variables[input.name] = {
            value: parsedValue,
            type,
          };
        }
      });

      // Step 1: Evaluate the decision
      const evaluationResults = await evaluateDecision(api, selectedDecisionId, variables);
      setResults(evaluationResults);

      // Step 2: Fetch the latest decision instance from history to get rule IDs
      const historyInstance = await getLatestDecisionInstance(api, selectedDecisionId);

      if (historyInstance?.outputs && historyInstance.outputs.length > 0) {
        // Extract unique rule IDs from outputs (handle COLLECT policies with multiple outputs per rule)
        const ruleIds = Array.from(
          new Set(historyInstance.outputs.map(output => output.ruleId).filter((id): id is string => id != null))
        );
        console.log('Matched rule IDs from history:', ruleIds);

        setSuccessMessage(
          `Decision evaluated successfully. ${ruleIds.length} rule${ruleIds.length !== 1 ? 's' : ''} matched.`
        );

        // Highlight matched rules using rule IDs
        if (ruleIds.length > 0) {
          highlightMatchedRules(viewerRef, ruleIds);
        }
      } else {
        setSuccessMessage('Decision evaluated successfully. No rules matched.');
        console.warn('No outputs found in decision history');
      }
    } catch (err) {
      console.error('Decision evaluation failed:', err);
      const errorMessage = err instanceof Error ? err.message : 'Decision evaluation failed';
      setEvaluationError(errorMessage);
    } finally {
      setIsEvaluating(false);
    }
  }, [api, selectedDecisionId, inputs, inputValues]);

  /**
   * Handles decision selection change.
   */
  const handleDecisionSelect = useCallback((id: string) => {
    setSelectedDecisionId(id);
    setInputValues({});
    setResults(null);
    setEvaluationError(null);
    setSuccessMessage(null);
  }, []);

  const title =
    decisions.length > 0
      ? `DMN Decision Simulator (${decisions.length} definition${decisions.length !== 1 ? 's' : ''})`
      : 'DMN Decision Simulator';

  // Error state with no decisions
  if (error && decisions.length === 0) {
    return (
      <DashboardSection title="DMN Decision Simulator" hasData={false} emptyMessage="">
        <ErrorMessage message={error} />
      </DashboardSection>
    );
  }

  return (
    <DashboardSection
      title={title}
      isLoading={isLoading}
      hasData={decisions.length > 0}
      emptyMessage="No decision definitions found. Deploy a DMN diagram to get started."
    >
      <div className="decisions-dashboard">
        <DecisionSelector
          decisions={decisions}
          selectedId={selectedDecisionId}
          onSelect={handleDecisionSelect}
          disabled={isEvaluating}
        />

        {error && <ErrorMessage message={error} />}
        {successMessage && <SuccessMessage message={successMessage} />}

        {selectedDecisionId && (
          <div className="decisions-dashboard__content">
            <div className="decisions-dashboard__left-panel">
              <DecisionInputForm
                inputs={inputs}
                values={inputValues}
                onChange={handleInputChange}
                onEvaluate={() => {
                  void handleEvaluate();
                }}
                onClear={handleClear}
                isLoading={isEvaluating}
              />

              <DecisionResults results={results} outputs={outputs} error={evaluationError} />
            </div>

            <div className="decisions-dashboard__right-panel">
              <div className="decisions-dashboard__viewer-container">
                {dmnXml ? (
                  <DmnViewer xml={dmnXml} onViewReady={handleViewerReady} />
                ) : (
                  <p className="decisions-dashboard__empty">Loading DMN diagram...</p>
                )}
              </div>
            </div>
          </div>
        )}

        {!selectedDecisionId && decisions.length > 0 && (
          <div className="decisions-dashboard__empty">
            <p>Select a decision definition to begin testing.</p>
          </div>
        )}
      </div>
    </DashboardSection>
  );
};

/**
 * Plugin export for Cockpit integration.
 * Registers as a dashboard route plugin at cockpit.decisions.dashboard
 */
export default [
  {
    id: 'decisionsDashboard',
    pluginPoint: 'cockpit.decisions.dashboard',
    properties: {
      label: 'Decision Simulator',
    },
    render: (node: Element, { api }: DashboardPluginParams): void => {
      createRoot(node).render(
        <React.StrictMode>
          <DecisionsDashboard api={api} />
        </React.StrictMode>
      );
    },
  },
];
