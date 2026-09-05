# AGENTS Guide

This repository bundles minimal history-oriented plugins for Operaton and Camunda 7 Cockpit/Tasklist. TypeScript + React sources in `src/` are bundled with Rollup into top-level `*.js` files that Cockpit loads via `config.js`.

**Note:** Built JavaScript modules are committed to the repository for convenience. Users can deploy the plugins directly without running the build process.

**Plugin status legend** used throughout this document:

| Status | Meaning |
|--------|---------|
| **shipped** | Referenced from a `*config.js` and/or bundled by the [Dockerfile](Dockerfile). This is what users actually run. |
| **optional** | Built and committed, but not referenced by the default configs. Users opt in by adding it to their own `config.js`. |
| **abandoned** | Sources and bundle are kept for reference only. Not referenced by any config, not bundled by the Dockerfile, and not maintained. Do not invest in it. |

A source file existing under `src/` does **not** mean the plugin is shipped — always cross-check
[config.js](config.js), the other `*config.js` files, and the [Dockerfile](Dockerfile).

## Project map

### Configuration and deployment
- [README.md](README.md): Usage and deployment instructions
- [config.js](config.js): Cockpit plugin configuration (defines `customScripts` and `bpmnJs.additionalModules`)
- [cockpit-nologin-config.js](cockpit-nologin-config.js): Alternative Cockpit configuration that only loads `cockpit-nologin.js`
- [tasklist-config.js](tasklist-config.js): Tasklist configuration (`tasklist-nologin.js`, `tasklist-audit-log.js`)
- [admin-config.js](admin-config.js): Admin configuration (`admin-nologin.js`, `admin-route-authorization.js`)
- [welcome-config.js](welcome-config.js): Welcome configuration (`welcome-nologin.js`)
- [Dockerfile](Dockerfile): Standalone Operaton Docker image build (context-free); its `cp` list is the
  authoritative statement of which bundles ship

### Build pipeline
- [rollup.config.mjs](rollup.config.mjs): Compiles each plugin entrypoint in `src/` to a top-level `*.js` bundle
- [package.json](package.json): Dependencies and npm scripts
- [tsconfig.json](tsconfig.json): TypeScript configuration
- [Makefile](Makefile): Development shortcuts (formatting, etc.)

### Built outputs (committed for convenience)
- `admin-nologin.js` – Admin no-login plugin (hides signin form via CSS)
- `admin-route-authorization.js` – Admin authorization management route
- `cockpit-custom-styles.js` – Custom stylesheet plugin for UI customization
- `cockpit-nologin.js` – Cockpit no-login plugin (hides signin form via CSS)
- `dashboard-favourites.js` – Process definition favorites star button and dashboard table
- `dashboard-integrations.js` – External task ("integrations") dashboard with retry/unlock actions
- `decisions-dashboard.js` – **abandoned** DMN decision simulator (see [Abandoned plugins](#abandoned-plugins))
- `definition-historic-activities.js` – Process definition statistics overlay
- `definition-tab-modify.js` – Process definition modification template builder
- `instance-action-unlock.js` – External task unlock action
- `instance-auto-refresh.js` – Auto-refresh toggle for instance views
- `instance-historic-activities.js` – Process instance audit log and overlays
- `instance-route-history.js` – Full history route view
- `instance-tab-modify.js` – Process modification and message correlation
- `robot-module.js` – BPMN module utilities for diagram rendering
- `tasklist-audit-log.js` – Tasklist audit log tab
- `tasklist-nologin.js` – Tasklist no-login plugin (hides signin form via CSS)
- `welcome-nologin.js` – Welcome no-login plugin (hides signin form via CSS)
- `*.js.map` – Source maps (development builds only)

### Plugin entrypoints (`src/`)
- [src/admin-nologin.tsx](src/admin-nologin.tsx): Admin no-login plugin that hides the signin form with CSS. For environments with external authentication (SSO, reverse proxy).
- [src/admin-route-authorization.tsx](src/admin-route-authorization.tsx): Admin authorization management route. Two-panel layout with resource type list and authorization CRUD operations.
- [src/cockpit-custom-styles.tsx](src/cockpit-custom-styles.tsx): Minimal plugin that only applies custom stylesheets (SCSS) for UI customization without any JavaScript functionality.
- [src/cockpit-nologin.tsx](src/cockpit-nologin.tsx): Cockpit no-login plugin that hides the signin form with CSS. For environments with external authentication (SSO, reverse proxy).
- [src/dashboard-favourites.tsx](src/dashboard-favourites.tsx): Process definition favorites plugin. Adds a star button on process definition runtime views to favorite/unfavorite definitions, and provides a dashboard table showing favorited process definitions with version info and direct links.
- [src/dashboard-integrations.tsx](src/dashboard-integrations.tsx): Cockpit dashboard section listing active external tasks (process, task, topic, worker, lock time, retries) with incident indicators and retry/unlock actions for individual tasks and batches. Reuses the favourites stored by `dashboard-favourites` (`minimal-history-plugin-favourites`) to offer a favourites-only filter, on by default.
- [src/decisions-dashboard.tsx](src/decisions-dashboard.tsx): **Abandoned.** DMN "Decision Simulator" dashboard (`cockpit.decisions.dashboard`). See [Abandoned plugins](#abandoned-plugins) before touching it.
- [src/definition-historic-activities.tsx](src/definition-historic-activities.tsx): Adds a runtime tab and diagram overlay for historic activity statistics with a filter UI and badge overlays.
- [src/definition-tab-modify.tsx](src/definition-tab-modify.tsx): Process definition "Modify" tab hosting three batch operations against a definition: `BatchModifyForm` (Batch Modify), `BatchMessageForm` (Message) and `BatchSignalForm` (Signal). The Message tab has a known half-broken feature — see [Known issues and fixes](#known-issues-and-fixes).
- [src/instance-action-unlock.tsx](src/instance-action-unlock.tsx): Process instance action button that provides a dialog for unlocking external tasks that are locked by workers, with batch selection and individual retry capabilities.
- [src/instance-auto-refresh.tsx](src/instance-auto-refresh.tsx): Diagram plugin exposing a toggle for auto-refresh on an instance view.
- [src/instance-historic-activities.tsx](src/instance-historic-activities.tsx): Adds audit-log tab and diagram overlays for a process instance, including sequence-flow highlighting.
- [src/instance-route-history.tsx](src/instance-route-history.tsx): Full history route (`#/history/process-instance/:id`) with breadcrumbs, BPMN viewer, audit log, variables, pagination, and filter box.
- [src/instance-tab-modify.tsx](src/instance-tab-modify.tsx): Process instance modification tab with sub-tabs for modifying process flow (start/cancel activities) and correlating messages. Includes a visual form builder for variables with type-specific inputs and comprehensive validation.
- [src/nologin.scss](src/nologin.scss): Shared stylesheet for all no-login plugins. Hides `form[name="signinForm"]` across all Operaton/Camunda webapps.
- [src/RobotModule/index.ts](src/RobotModule/index.ts): Additional BPMN module utilities for diagram rendering.
- [src/tasklist-audit-log.tsx](src/tasklist-audit-log.tsx): Tasklist detail tab that loads the instance audit log.
- [src/tasklist-nologin.tsx](src/tasklist-nologin.tsx): Tasklist no-login plugin that hides the signin form with CSS. For environments with external authentication (SSO, reverse proxy).
- [src/welcome-nologin.tsx](src/welcome-nologin.tsx): Welcome no-login plugin that hides the signin form with CSS. For environments with external authentication (SSO, reverse proxy).

### Services (`src/services/`)
- [AuthorizationService.ts](src/services/AuthorizationService.ts): Authorization CRUD API abstraction used by the admin authorization route
- [ExternalTaskService.ts](src/services/ExternalTaskService.ts): External task API abstraction (query, retries, unlock) used by the integrations dashboard and unlock action
- [HistoryService.ts](src/services/HistoryService.ts): History API abstraction for testability with typed interfaces for historic activities and variables
- [ProcessInstanceService.ts](src/services/ProcessInstanceService.ts): Process instance API abstraction (query, modification, message/signal delivery)
- [ViewerService.ts](src/services/ViewerService.ts): BPMN viewer abstraction with interfaces for overlays, element registry, and canvas operations

### Shared utilities (`src/utils/`)
- [api.ts](src/utils/api.ts): API helpers and CSRF-aware fetch wrappers
- [angular.ts](src/utils/angular.ts): Angular service abstraction for testability (route reloading)
- [authorization.ts](src/utils/authorization.ts): Authorization types, constants (AUTH_TYPES, RESOURCE_TYPES, PERMISSIONS_BY_RESOURCE), and helper functions for admin authorization management
- [bpmn.ts](src/utils/bpmn.ts): Re-exports from `bpmn/` submodule for backwards compatibility
- [bpmnParsing.ts](src/utils/bpmnParsing.ts): BPMN XML parsing for extracting activities, sequence flows, and message definitions
- [constants.ts](src/utils/constants.ts): Centralized UI, timing, pagination, retry, and validation constants
- [datePickerWidget.tsx](src/utils/datePickerWidget.tsx) / [datePickerWidget.scss](src/utils/datePickerWidget.scss): Date picker widget used inside FilterBox tokens
- [filterExpressionParsers.ts](src/utils/filterExpressionParsers.ts): Pure functions for parsing FilterBox expressions to API query parameters. Provides `parseActivityInstanceExpressions()`, `parseProcessInstanceExpressions()`, `parseAuthorizationExpressions()` with typed interfaces for each query type.
- [filterSchema.ts](src/utils/filterSchema.ts): Schema-based filter configuration using react-select-filter-box. Provides `createDefinitionFilterSchema()`, `createInstanceQuerySchema()`, `createAuthorizationFilterSchema()`, and legacy expression converters for backward compatibility.
- [formatting.ts](src/utils/formatting.ts): Date formatting (`formatDateTime`, `formatDateForApi`) and URL building (`buildCockpitUrl`, `buildHistoryUrl`) utilities
- [misc.ts](src/utils/misc.ts): Local storage and querystring settings utilities
- [resizable-layout.scss](src/utils/resizable-layout.scss): Shared SCSS styles for Allotment-based resizable layouts (Resizer, Pane borders)
- [storage.ts](src/utils/storage.ts): Injectable storage abstraction with `MemoryStorage` for testing
- [variables.ts](src/utils/variables.ts): Variable transformation utilities (`transformVariables`, `transformVariableValue`) for API requests

### BPMN utilities (`src/utils/bpmn/`)
- [index.ts](src/utils/bpmn/index.ts): Module exports for BPMN utilities
- [connections.ts](src/utils/bpmn/connections.ts): Connection and flow analysis utilities (sequence flows, dotted connections)
- [overlays.ts](src/utils/bpmn/overlays.ts): Overlay rendering (activity count badges)
- [svg.ts](src/utils/bpmn/svg.ts): SVG sequence flow path rendering with arrow markers

### Custom hooks (`src/hooks/`)
- [useData.ts](src/hooks/useData.ts): Data fetching hooks (`useActivities`, `useVariables`, `useBpmnElements`, `useSettings`)
- [useFilterState.ts](src/hooks/useFilterState.ts): FilterBox expression state, query-parameter building, and URL/localStorage persistence
- [usePagination.ts](src/hooks/usePagination.ts): Page navigation state and `firstResult` calculation

### Reusable UI components (`src/Components/`)

**Layout and structure:**
- [APIContext.ts](src/Components/APIContext.ts): React context for API configuration
- [Container.tsx](src/Components/Container.tsx): Fixed view container wrapper
- [Page.tsx](src/Components/Page.tsx): Page wrapper with API context provider
- [Portal.tsx](src/Components/Portal.tsx): React portal for rendering into Cockpit DOM nodes
- [Tabs.tsx](src/Components/Tabs.tsx): Tab navigation component with active state management
- [DashboardSection.tsx](src/Components/DashboardSection.tsx): Collapsible dashboard section with title, loading/empty states, refresh button, and header actions
- [ErrorBoundary.tsx](src/Components/ErrorBoundary.tsx): React error boundary with fallback UI, keeping a crashing plugin from taking down the surrounding Cockpit view
- [HistoryViewLayout.tsx](src/Components/HistoryViewLayout.tsx): Resizable pane layout with BPMN viewer, info panel, and tabs (uses Allotment)
- [ProcessInfoPanel.tsx](src/Components/ProcessInfoPanel.tsx): Process instance metadata display with copy-to-clipboard

**Navigation:**
- [BreadcrumbsPanel.tsx](src/Components/BreadcrumbsPanel.tsx): Navigation breadcrumbs
- [Pagination.tsx](src/Components/Pagination.tsx): Pagination controls
- [PageLink.tsx](src/Components/PageLink.tsx): Individual page link component

**Data display:**
- [AuditLogTable.tsx](src/Components/AuditLogTable.tsx): Audit log table
- [HistoryTable.tsx](src/Components/HistoryTable.tsx): History records table
- [StatisticsTable.tsx](src/Components/StatisticsTable.tsx): Activity statistics table
- [VariablesTable.tsx](src/Components/VariablesTable.tsx): Process variables table
- [SortableTable.tsx](src/Components/SortableTable.tsx): Generic sortable table wrapper with react-table and ARIA support
- [SortableAuthorizationsTable.tsx](src/Components/SortableAuthorizationsTable.tsx): Sortable authorization table with react-table for admin authorization management

**BPMN viewer:**
- [BPMN.tsx](src/Components/BPMN.tsx): BPMN viewer wrapper with zoom controls and history toggle buttons
- [ViewerButtonsPortal.tsx](src/Components/ViewerButtonsPortal.tsx): Testable abstraction for injecting buttons into BPMN viewer container via React portals
- [ResetZoomButton.tsx](src/Components/ResetZoomButton.tsx): Reset zoom control
- [ZoomInButton.tsx](src/Components/ZoomInButton.tsx): Zoom in control
- [ZoomOutButton.tsx](src/Components/ZoomOutButton.tsx): Zoom out control

**DMN viewer:**
- [DmnViewer.tsx](src/Components/DmnViewer.tsx): DMN viewer wrapper using dmn-js for rendering decision tables, DRD, and literal expressions
- [DecisionSelector.tsx](src/Components/DecisionSelector.tsx): Dropdown selector for choosing deployed decision definitions
- [DecisionInputForm.tsx](src/Components/DecisionInputForm.tsx): Dynamic input form for decision evaluation with type-specific inputs based on DMN schema
- [DecisionResults.tsx](src/Components/DecisionResults.tsx): Results display table showing evaluation outputs and matched rules

**Toggle buttons:**
- [ToggleAutoRefreshButton.tsx](src/Components/ToggleAutoRefreshButton.tsx): Auto-refresh toggle
- [ToggleHistoryStatisticsButton.tsx](src/Components/ToggleHistoryStatisticsButton.tsx): History statistics toggle
- [ToggleHistoryViewButton.tsx](src/Components/ToggleHistoryViewButton.tsx): History view toggle
- [ToggleSequenceFlowButton.tsx](src/Components/ToggleSequenceFlowButton.tsx): Sequence flow highlighting toggle

**Forms and inputs:**
- [FilterBox.tsx](src/Components/FilterBox.tsx): Token-based filter builder using react-select-filter-box with schema-based configuration, saved searches persistence, and legacy expression conversion
- [FilterBox.scss](src/Components/FilterBox.scss): Styles for FilterBox and saved searches dropdown
- [VariableBuilder.tsx](src/Components/VariableBuilder.tsx): Dynamic variable input builder with type-specific controls (String, Integer, Boolean, JSON, Date, etc.) and form validation
- [MessageCorrelationForm.tsx](src/Components/MessageCorrelationForm.tsx): Single-instance message correlation form with BPMN message parsing, variable configuration, and a business key field for message start events
- [RestartProcessForm.tsx](src/Components/RestartProcessForm.tsx): Restart form for externally/internally terminated instances, either picking one from a list or targeting the instance currently open in the history view
- [BatchModifyForm.tsx](src/Components/BatchModifyForm.tsx): Batch process modification form with instance selection, dry-run preview, and modification instructions
- [BatchMessageForm.tsx](src/Components/BatchMessageForm.tsx): Definition-level message form — correlates asynchronously to all active instances of the definition, or starts a new instance when the selected message sits on a start event (see [Known issues and fixes](#known-issues-and-fixes))
- [BatchSignalForm.tsx](src/Components/BatchSignalForm.tsx): Batch signal broadcast form for broadcasting signals globally
- [DryRunResultPreview.tsx](src/Components/DryRunResultPreview.tsx): Dry-run result preview component showing affected process instances
- [IdentityAutocomplete.tsx](src/Components/IdentityAutocomplete.tsx): Autocomplete input for users/groups in authorization forms
- [ResourceAutocomplete.tsx](src/Components/ResourceAutocomplete.tsx): Autocomplete input for resource IDs in authorization forms
- [AuthorizationFormModal.tsx](src/Components/AuthorizationFormModal.tsx): Modal form for creating/editing authorizations with type, identity, permissions, and resource ID selection
- [AuthorizationDeleteModal.tsx](src/Components/AuthorizationDeleteModal.tsx): Confirmation modal for deleting authorization records
- [SelectField.tsx](src/Components/SelectField.tsx): Reusable form select field with consistent styling
- [FormButton.tsx](src/Components/FormButton.tsx): Reusable form button with variants (primary, secondary, danger, success)
- [InstructionCard.tsx](src/Components/InstructionCard.tsx): Process modification instruction card with type selector
- [InstructionFields.tsx](src/Components/InstructionFields.tsx): Type-specific form fields for modification instructions (start activity, cancel, transition)
- [ModifyFormOptions.tsx](src/Components/ModifyFormOptions.tsx): Modification form options (annotation, skip listeners/mappings)

**Feedback components:**
- [ErrorMessage.tsx](src/Components/ErrorMessage.tsx): Error alert with ARIA live region
- [SuccessMessage.tsx](src/Components/SuccessMessage.tsx): Success alert with ARIA support
- [LoadingSpinner.tsx](src/Components/LoadingSpinner.tsx): Loading indicator with ARIA busy state
- [WarningBox.tsx](src/Components/WarningBox.tsx): Warning box with customizable title

**Plugin wrapper components:**
- [InstanceDiagramAutoRefresh.tsx](src/Components/InstanceDiagramAutoRefresh.tsx): Auto-refresh button wrapper for instance diagram
- [InstanceDiagramHistoricActivities.tsx](src/Components/InstanceDiagramHistoricActivities.tsx): Historic activities overlays and sequence flow toggle
- [InstanceTabAuditLog.tsx](src/Components/InstanceTabAuditLog.tsx): Audit log tab for process instances
- [TasklistTabAuditLog.tsx](src/Components/TasklistTabAuditLog.tsx): Audit log tab for tasklist tasks
- [TaskListComponents.tsx](src/Components/TaskListComponents.tsx): Task item components for unlock dialog

**Utilities:**
- [Clippy.tsx](src/Components/Clippy.tsx): Copy-to-clipboard component with visual feedback

**Styles:**
- [Button.scss](src/Components/Button.scss): Button styles
- [Modal.scss](src/Components/Modal.scss): Modal dialog styles
- [MessageCorrelationForm.scss](src/Components/MessageCorrelationForm.scss): Message correlation form styles
- [icons.scss](src/Components/icons.scss): `react-icons` sizing/alignment helpers and spinner animation
- [react-datepicker.scss](src/Components/react-datepicker.scss): Date picker overrides

### Type definitions
- <a>src/operaton.json</a>: Camunda 7 / Operaton REST API OpenAPI 3.0 specification (~52k lines). Defines all REST endpoints, request/response schemas, and parameters for the process engine API.
- <a>src/operaton.ts</a>: Auto-generated TypeScript types from `operaton.json` (~37k lines). Provides type-safe interfaces for all REST API paths, operations, components, and schemas. Generated by `openapi-typescript` and excluded from ESLint checks.
- <a>src/types.ts</a>: Plugin parameter typings and API interfaces
- <a>src/custom.d.ts</a>: Custom module declarations
- <a>@types/</a>: Additional type definitions for external modules

## Abandoned plugins

### decisions-dashboard

**Status: abandoned. Do not extend it, and do not add it back to a default config.**

`decisions-dashboard` ([src/decisions-dashboard.tsx](src/decisions-dashboard.tsx), bundled to
`decisions-dashboard.js`) was an attempt to bring DMN evaluation directly into Cockpit: pick a deployed
decision definition, parse its DMN inputs into a form, evaluate it through the REST API, show the outputs,
and highlight matched rules on the rendered decision table.

It works, but the conclusion was that this simply does not belong in Cockpit. DMN authoring and evaluation
belong in the modelling tool, next to the DMN file being edited — and there is already a better version of
this idea in the **`datakurre.operaton-dmn-modeler` VS Code extension**. Cockpit is for operating running
processes, not for iterating on decision logic.

What that means concretely:

- It is **not** listed in [config.js](config.js) and **not** copied by the [Dockerfile](Dockerfile), so it
  does not ship. (Note that [README.md](README.md) still shows it in an older example `config.js` snippet;
  that snippet is out of date.)
- Sources, the committed bundle, its tests, and the DMN components it uses
  ([DmnViewer.tsx](src/Components/DmnViewer.tsx), [DecisionSelector.tsx](src/Components/DecisionSelector.tsx),
  [DecisionInputForm.tsx](src/Components/DecisionInputForm.tsx), [DecisionResults.tsx](src/Components/DecisionResults.tsx))
  are kept so the code stays buildable and the history stays readable — it is still an entry in
  [rollup.config.mjs](rollup.config.mjs) and still covered by
  [src/__tests__/decisions-dashboard.integration.test.tsx](src/__tests__/decisions-dashboard.integration.test.tsx).
- Keep it compiling and keep its tests green when you make repo-wide changes (dependency bumps, lint rules,
  shared component refactors). That is the whole maintenance contract.
- Do **not** spend effort on new features, UX work, or bug fixes here. If a user wants DMN evaluation, point
  them at `datakurre.operaton-dmn-modeler` instead.
- `dmn-js` remains a dependency only because of this plugin. If it is ever fully removed, that dependency and
  the four DMN components above go with it.

## Development

### Setup
```bash
npm install
npm run watch  # incremental bundles with sourcemaps
```

For a full stack, [devenv.nix](devenv.nix) provisions Operaton + PostgreSQL and a Caddy reverse proxy on
port 8000 that serves `*-config.js` and the bundles straight from the repository root, falling back to the
webapp's own assets. With `make up` (`devenv up`) running alongside `npm run watch`, a page refresh picks up
each rebuild.

### Scripts
- `npm run watch` – Development build with file watching and sourcemaps
- `npm run build` – Production bundle (sets `NODE_ENV=production`, no sourcemaps)
- `BUILD_PLUGIN=<name> npm run build` – Build only specific plugin(s) matching `<name>` (supports partial matching)
  - Example: `BUILD_PLUGIN=instance-historic-activities npm run build` – Build only instance-historic-activities.js
  - Example: `BUILD_PLUGIN=historic npm run build` – Build all plugins with "historic" in their name
  - Example: `BUILD_PLUGIN=nologin npm run build` – Build all nologin plugins
- `npm run lint` – Run ESLint on src/
- `npm run lint:fix` – Run ESLint with auto-fix
- `npm run typecheck` – Run TypeScript type checking
- `npm run prettier:check` – Check code formatting
- `npm run prettier:format` – Format code with Prettier
- `npm run check` – Run all static analysis (typecheck + lint + prettier)
- `npm run fix` – Auto-fix all fixable issues (lint + prettier)
- `make format` – Alias for Prettier formatting

### Static Analysis
The project uses strict static analysis optimized for LLM coding agent maintainability:

**ESLint** ([eslint.config.mjs](eslint.config.mjs)):
- TypeScript strict type checking (no implicit any, strict null checks)
- Complexity limits (max 100 lines/function, max 400 lines/file, max 15 cyclomatic complexity)
- Naming conventions (PascalCase for components/types, camelCase for functions, boolean prefixes)
- Required JSDoc on exported functions
- React hooks rules and accessibility checks
- Import organization and no circular dependencies
- No magic numbers (use named constants)

**TypeScript** ([tsconfig.json](tsconfig.json)):
- All strict mode options enabled
- `noUncheckedIndexedAccess` – Array access returns `T | undefined`
- `exactOptionalPropertyTypes` – Explicit undefined handling
- `noImplicitReturns` – All code paths must return

**Before committing**, run `npm run check` to validate all static analysis passes. It passes on `main`
as of `e95c20b`, so a failure is yours.

### Build notes
- Rollup compiles TypeScript + React with Babel
- SCSS is injected into the JavaScript bundles
- React/ReactDOM are aliased to ensure a single instance across the bundle (fixes hooks errors from nested dependencies)
- Built `*.js` files are committed for convenience; edit sources in `src/`, not the generated files

## Deployment

### Cockpit
- Plugins listed in `customScripts` inside [config.js](config.js) are loaded by Cockpit
- `bpmnJs.additionalModules` in [config.js](config.js) injects the BPMN behavior module
- Copy `config.js` and the relevant `*.js` files into the target webapp scripts directory

### Tasklist
- Plugins listed in [tasklist-config.js](tasklist-config.js) are loaded by Tasklist
- Copy `tasklist-config.js` (as `config.js`) plus `tasklist-audit-log.js` and `tasklist-nologin.js` into the scripts directory

### Admin and Welcome
- [admin-config.js](admin-config.js) loads `admin-nologin.js` and `admin-route-authorization.js`
- [welcome-config.js](welcome-config.js) loads `welcome-nologin.js`
- Each is copied into the corresponding webapp's scripts directory as `config.js`

### Docker
- The [Dockerfile](Dockerfile) fetches this repository at `PLUGINS_REF`, lays the bundles and the four
  configs into an overlay, and `zip -u`s them into Operaton's `operaton-webapp-webjar-*.jar` /
  `operaton-webapp-*.war`. When you add or remove a shipped plugin, update **both** the relevant `*config.js`
  **and** the Dockerfile's `cp` list, or the image and the config will disagree.

### Requirements
- Plugins expect Operaton/Camunda REST endpoints available via `api.engineApi` and related fields passed by Cockpit
- History endpoints (`/history/*`) must be reachable and may return up to 1000 records unless overridden

See [README.md](README.md) for detailed deployment instructions including Spring Boot setup.

## Behavioral notes
- History overlays and sequence-flow coloring rely on completed activities; gateways use a deny-list to avoid highlighting inactive branches.
- User preferences (auto-refresh, badges, pane sizes, sequence-flow toggle) persist in `localStorage` under `minimal-history-plugin` and can also be influenced via URL query hash parameters.
- Filtering UIs build REST queries; date filters use `startedAfter`/`finishedBefore` in UTC with millisecond precision.
- Favourited definitions live in `localStorage` under `minimal-history-plugin-favourites` and are written by `dashboard-favourites` but also *read* by `dashboard-integrations` (favourites-only filter, on by default). Changing that key breaks both plugins.

## Extending safely
- Follow the existing plugin export shape (array of `pluginPoint` definitions) and keep DOM side effects contained; several plugins reuse portals to ensure long-lived nodes.
- Reuse helpers: fetch data with [src/utils/api.ts](src/utils/api.ts) to inherit CSRF handling and history pagination limits; render BPMN overlays through [src/utils/bpmn.ts](src/utils/bpmn.ts) when adding diagram visuals.
- Keep UI pieces inside [src/Components/](src/Components/) to share styles and behavior; SCSS may be colocated and will be inlined by Rollup.
- Adding a new shipped plugin means four places, not one: `src/`, [rollup.config.mjs](rollup.config.mjs), the relevant `*config.js`, and the [Dockerfile](Dockerfile) `cp` list.
- Anything that mutates engine state at scale is subject to [Dangerous operations and dry runs](#dangerous-operations-and-dry-runs) — dry run, visible payload, and a `WarningBox` scoped honestly.

### Portal usage patterns

Cockpit plugins receive DOM nodes via render callbacks. Two patterns are used to integrate React:

**1. Direct rendering** (simple plugins):
```tsx
// For plugins that only need one entry point
render: (node: Element, { api }) => {
  createRoot(node).render(<MyComponent api={api} />);
}
```
Used in: `definition-tab-modify.tsx`, `instance-tab-modify.tsx`, `tasklist-audit-log.tsx`, `instance-action-unlock.tsx`

**2. Hooks pattern with Portal** (multi-entry plugins):
```tsx
// For plugins that share state across multiple pluginPoints (e.g., diagram + tab)
const initialState: Record<string, any> = { viewer: null };
const hooks: Record<string, any> = {
  setViewer: (v) => (initialState['viewer'] = v),
};

const Plugin: React.FC = ({ root }) => {
  const [viewer, setViewer] = useState(initialState['viewer']);
  hooks['setViewer'] = setViewer; // Bridge external callback to React state
  return viewer ? <Portal node={root}><Content /></Portal> : null;
};

export default [
  { pluginPoint: 'diagram.plugin', render: (v) => hooks['setViewer'](v) },
  { pluginPoint: 'runtime.action', render: (node, api) => createRoot(node).render(<Plugin root={node} api={api} />) },
];
```
Used in: `definition-historic-activities.tsx`, `instance-route-history.tsx`

**3. ViewerButtonsPortal** (BPMN viewer buttons):
```tsx
// Clean abstraction for injecting buttons into BPMN viewer
<ViewerButtonsPortal viewer={viewer} position={{ right: '15px', top: '15px' }}>
  <ToggleButton onToggle={handleToggle} />
</ViewerButtonsPortal>
```
Used in: `instance-historic-activities.tsx` via `InstanceDiagramHistoricActivities`

## Dangerous operations and dry runs

Several plugins fire operations that can affect thousands of running process instances at once and cannot be
undone: batch modification, asynchronous message correlation, engine-wide signal broadcast, external task
retry/unlock, process restart, and authorization changes. Treat every one of these as a destructive action.

The rule for anything with such a blast radius:

1. **It must have a dry run.** The user gets to look before they leap.
2. **The dry run must show the request the real run would send** — HTTP method, endpoint, and the full JSON
   body, exactly as it would be serialized — in addition to the affected instances. Showing only a count and a
   sample of instance IDs is not enough: the payload is where the real damage is decided (which instructions,
   which variables and their types, `skipCustomListeners` / `skipIoMappings`, whether the target is
   `processInstanceIds` or an open-ended `processInstanceQuery`). A user cannot sanity-check an operation they
   cannot see.
3. **It must carry a `WarningBox`** stating the scope in plain words, especially when the scope is wider than
   the view the user is standing in (e.g. `BatchSignalForm` broadcasts engine-wide, not just to this
   definition).

Current state, and the gap to close:

| Form | Dry run | Shows affected instances | Shows POST payload |
|------|---------|--------------------------|--------------------|
| [BatchModifyForm.tsx](src/Components/BatchModifyForm.tsx) (`POST /modification/executeAsync`) | "Dry Run" button | yes | **no — to be added** |
| [BatchMessageForm.tsx](src/Components/BatchMessageForm.tsx) (`POST /process-instance/message-async`, `POST /message`) | "Preview Instances" button | yes | **no — to be added** |
| [BatchSignalForm.tsx](src/Components/BatchSignalForm.tsx) (`POST /signal`) | "Preview Instances" button | yes, but only for the current definition while the broadcast is engine-wide | **no — to be added** |

The per-instance actions — external task retry/unlock ([instance-action-unlock.tsx](src/instance-action-unlock.tsx),
[dashboard-integrations.tsx](src/dashboard-integrations.tsx)) and restart
([RestartProcessForm.tsx](src/Components/RestartProcessForm.tsx)) — act on an explicit selection the user can
see in a table, which satisfies rule 1 for them. They still send a body worth showing, so if you touch them,
surface it too.

When adding the payload preview, build it from the *same* code path that builds the real request body — do not
write a second, parallel "what we would send" serializer, or the preview will drift from reality and become
worse than no preview at all. Extract the body builder into a pure function, render it with
`JSON.stringify(payload, null, 2)`, and pass the same value to `post()`. The natural home for the shared
rendering is [DryRunResultPreview.tsx](src/Components/DryRunResultPreview.tsx), which today only renders the
instance list and is not yet used by all three forms.

## Testing

The project uses Jest with React Testing Library for unit and integration tests. Run tests with:
```bash
npm run test          # Run all tests
npm run test:watch    # Run in watch mode
npm run test:coverage # Generate coverage report
npm run test:ci       # Run in CI mode with coverage
```

Coverage moves with every change, so this document does not pin exact numbers — run `npm run test:coverage`
for the current figures. The enforced floor lives in [jest.config.js](jest.config.js) (see
[Coverage thresholds](#coverage-thresholds)); keep changes at or above it.

### Test organization
- `src/__tests__/` – Integration tests for plugins and API
- `src/Components/__tests__/` – Component unit tests
- `src/services/__tests__/` – Service layer tests
- `src/utils/__tests__/` – Utility function tests
- `src/__fixtures__/` – Test fixtures (activities, variables, BPMN XML, API responses)
- `src/__mocks__/` – Module mocks for external dependencies

### Coverage thresholds
Coverage thresholds are enforced in [jest.config.js](jest.config.js):
- Global: 35% branches, 55% functions/lines/statements
- `src/utils/`: 55% branches, 75% functions/lines/statements

**Note:** End-to-end testing is intentionally skipped. The plugins integrate with Operaton/Camunda Cockpit's Angular-based runtime environment, making browser automation setup complex. The unit and integration tests provide sufficient coverage for the React components and API interactions.

## Known issues and fixes

- **`bpmn-moddle` imports must stay named — do not "fix" them to default imports.** This broke the
  repository once (typecheck exit 2, no bundle could be built, 26 tests failing across 6 suites, CI red
  at the typecheck step so the `Build` job never ran); fixed in `e95c20b`. `@types/bpmn-moddle@10` and
  the package's own ESM build both expose **named** exports and no default:

  ```
  dist/index.js: export { SimpleBpmnModdle as BpmnModdle }
  index.d.ts:    export const BpmnModdle: BPMNModdleConstructor
  ```

  So [src/RobotModule/renderer.ts](src/RobotModule/renderer.ts) and
  [src/utils/bpmn/connections.ts](src/utils/bpmn/connections.ts) use `import type * as BPMNModdle` for
  namespace-style type access, and [src/utils/bpmnParsing.ts](src/utils/bpmnParsing.ts) uses
  `import { BpmnModdle }` for the constructor. A default import is TS2613 and fails `tsc` *and* the
  rollup typescript plugin, which is what makes it fatal rather than cosmetic.

  The matching Jest setup is load-bearing too. There is deliberately **no** `^bpmn-moddle$` module
  mapping: the CJS build is `module.exports = SimpleBpmnModdle`, which a named import cannot read, and
  it requires the ESM-only `moddle` and `moddle-xml` anyway. Jest loads the same ESM entry rollup does,
  which is why `transformIgnorePatterns` in [jest.config.js](jest.config.js) allowlists the whole chain
  (`bpmn-moddle`, `moddle`, `moddle-xml`, `saxen`, `min-dash`). That pattern is unanchored, so a nested
  path such as `bpmn-moddle/node_modules/min-dash` — `bpmn-moddle@10` ships its own `min-dash@5` while
  the project pins `4.2.3` — is only transformed when *every* `node_modules/` segment in it is followed
  by an allowlisted name. Drop `bpmn-moddle` from that list and the nested copy silently stops being
  transformed again.

- **Definition-level message sending is half-broken.** In the `Message` tab of `definition-tab-modify`
  ([BatchMessageForm.tsx](src/Components/BatchMessageForm.tsx)) the selected BPMN message drives two very
  different code paths, and only one of them is finished:
  - *Intermediate/boundary message* — correlates asynchronously to **every** active instance of the
    definition (`POST /process-instance/message-async` with `processInstanceQuery: { processDefinitionId }`).
    The "Preview Instances" button queries the same set, but there is no way to narrow it: no filter, no
    per-instance selection, no business-key or variable-based targeting. It is all instances of the
    definition or nothing, even though the form presents itself as targeting a set.
  - *Message start event* — falls back to `POST /message` with just `messageName` and `processVariables`,
    starting a single new instance. The targeting UI is hidden but the surrounding "batch" framing still
    applies, and unlike the single-instance
    [MessageCorrelationForm.tsx](src/Components/MessageCorrelationForm.tsx) it offers **no business key**
    field, so the caller cannot identify or later find the instance it just started.

  Fixing this means deciding what the tab is for and making both paths honour it: real target selection
  (instance query/selection reusing `BatchModifyForm`'s instance-selection UI) for correlation, and parity
  with `MessageCorrelationForm` — business key included — for the start-event path. Until then, do not
  describe this feature as working in user-facing docs.

- **Dry runs do not show the request payload.** See
  [Dangerous operations and dry runs](#dangerous-operations-and-dry-runs). All three batch forms preview
  *which* instances would be hit but never *what* would be sent to them; the payload preview is the missing
  half and should be added to each.

- **`DryRunResultPreview` is not used consistently.** [DryRunResultPreview.tsx](src/Components/DryRunResultPreview.tsx)
  exists as the shared preview component, but `BatchModifyForm`, `BatchMessageForm` and `BatchSignalForm`
  each still inline their own near-identical copy of the same markup. Consolidate on the component when you
  next touch these forms — it is also where the payload preview belongs.

- **`BatchSignalForm` preview understates the blast radius.** `POST /signal` broadcasts engine-wide to every
  matching signal catch event in every deployed definition, but the preview only lists instances of the
  current definition. The `WarningBox` says so in words; the preview still does not.

- **`dashboard-integrations` fetches external tasks one instance at a time.** It calls
  `/external-task` with no `maxResults` and no `processDefinitionKeyIn`, then loops one
  `GET /process-definition/{id}` and one `GET /incident` per instance, sequentially. Both filters exist
  on those endpoints (`/incident` even takes `processDefinitionKeyIn`), and `getProcessDefinition` in
  [src/utils/api.ts](src/utils/api.ts) is already cached, so this could be two calls rather than N.
  Unfixed.

- **Direct `fetch()` calls bypass the API helpers.** [src/utils/filterSchema.ts](src/utils/filterSchema.ts)
  calls `fetch` directly in its four autocompleters. They send `Accept` and `X-XSRF-TOKEN` by hand but
  skip `ApiError`, the `api.engine` normalisation in `get()`, and the `setFetchFunction` seam the tests
  rely on. Unfixed.

- **`instance-tab-modify` uses one state field for both success and failure.** `onSubmit` writes its
  success text into `error`, and the render decides which alert to show with
  `error.includes('successfully')`. The component already imports `SuccessMessage`; it wants a separate
  state field. Unfixed.

- **react-select-filter-box installed from git**: The package has no npm releases and is pinned to a commit
  of `github:jyukopla/react-select-filter-box` in [package.json](package.json). Bumping it means moving the
  commit hash, and there is no changelog to consult.

- **TypeScript warnings with react-select-filter-box**: The package bundles its own `@types/react` which conflicts with the project's React types. [src/Components/FilterBox.tsx](src/Components/FilterBox.tsx) casts the component to a local type to bypass this incompatibility. Jest sidesteps it entirely with a mock at [src/__mocks__/react-select-filter-box.tsx](src/__mocks__/react-select-filter-box.tsx).


