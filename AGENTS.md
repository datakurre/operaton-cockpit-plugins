# AGENTS Guide

This repository bundles minimal history-oriented plugins for Operaton and Camunda 7 Cockpit/Tasklist. TypeScript + React sources in `src/` are bundled with Rollup into top-level `*.js` files that Cockpit loads via `config.js`.

**Note:** Built JavaScript modules are committed to the repository for convenience. Users can deploy the plugins directly without running the build process.

## Project map

### Configuration and deployment
- [README.md](README.md): Usage and deployment instructions
- [config.js](config.js): Cockpit plugin configuration (defines `customScripts` and `bpmnJs.additionalModules`)
- [cockpit-nologin-config.js](cockpit-nologin-config.js): Cockpit no-login plugin configuration
- [tasklist-config.js](tasklist-config.js): Tasklist plugin configuration
- [tasklist-nologin-config.js](tasklist-nologin-config.js): Tasklist no-login plugin configuration
- [admin-config.js](admin-config.js): Admin no-login plugin configuration
- [welcome-config.js](welcome-config.js): Welcome no-login plugin configuration

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
- `decisions-dashboard.js` – DMN decision table testing dashboard
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
- [src/decisions-dashboard.tsx](src/decisions-dashboard.tsx): DMN decision table testing dashboard. Provides a UI for selecting deployed decision definitions, parsing DMN inputs, evaluating decisions via the API, displaying results, and highlighting matched rules on the rendered decision table.
- [src/definition-historic-activities.tsx](src/definition-historic-activities.tsx): Adds a runtime tab and diagram overlay for historic activity statistics with a filter UI and badge overlays.
- [src/definition-tab-modify.tsx](src/definition-tab-modify.tsx): Process definition modification template builder tab for designing modification instructions that can be applied to specific process instances.
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
- [HistoryService.ts](src/services/HistoryService.ts): History API abstraction for testability with typed interfaces for historic activities and variables
- [ViewerService.ts](src/services/ViewerService.ts): BPMN viewer abstraction with interfaces for overlays, element registry, and canvas operations

### Shared utilities (`src/utils/`)
- [api.ts](src/utils/api.ts): API helpers and CSRF-aware fetch wrappers
- [angular.ts](src/utils/angular.ts): Angular service abstraction for testability (route reloading)
- [authorization.ts](src/utils/authorization.ts): Authorization types, constants (AUTH_TYPES, RESOURCE_TYPES, PERMISSIONS_BY_RESOURCE), and helper functions for admin authorization management
- [bpmn.ts](src/utils/bpmn.ts): Re-exports from `bpmn/` submodule for backwards compatibility
- [bpmnParsing.ts](src/utils/bpmnParsing.ts): BPMN XML parsing for extracting activities, sequence flows, and message definitions
- [constants.ts](src/utils/constants.ts): Centralized UI, timing, pagination, retry, and validation constants
- [filterAutocomplete.ts](src/utils/filterAutocomplete.ts): Configurable autocomplete handler for filter boxes with category operators and date picker support
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

### Reusable UI components (`src/Components/`)

**Layout and structure:**
- [APIContext.ts](src/Components/APIContext.ts): React context for API configuration
- [Container.tsx](src/Components/Container.tsx): Fixed view container wrapper
- [Page.tsx](src/Components/Page.tsx): Page wrapper with API context provider
- [Portal.tsx](src/Components/Portal.tsx): React portal for rendering into Cockpit DOM nodes
- [Tabs.tsx](src/Components/Tabs.tsx): Tab navigation component with active state management
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
- [FilterBox.tsx](src/Components/FilterBox.tsx): Query filter UI with CodeMirror editor, custom autocomplete, and date picker integration
- [VariableBuilder.tsx](src/Components/VariableBuilder.tsx): Dynamic variable input builder with type-specific controls (String, Integer, Boolean, JSON, Date, etc.) and form validation
- [MessageCorrelationForm.tsx](src/Components/MessageCorrelationForm.tsx): Message correlation form with BPMN message parsing and variable configuration
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
- [react-datepicker.scss](src/Components/react-datepicker.scss): Date picker overrides
- [react-filter-box.scss](src/Components/react-filter-box.scss): Filter box overrides

### Type definitions
- <a>src/operaton.json</a>: Camunda 7 / Operaton REST API OpenAPI 3.0 specification (~52k lines). Defines all REST endpoints, request/response schemas, and parameters for the process engine API.
- <a>src/operaton.ts</a>: Auto-generated TypeScript types from `operaton.json` (~37k lines). Provides type-safe interfaces for all REST API paths, operations, components, and schemas. Generated by `openapi-typescript` and excluded from ESLint checks.
- <a>src/types.ts</a>: Plugin parameter typings and API interfaces
- <a>src/custom.d.ts</a>: Custom module declarations
- <a>@types/</a>: Additional type definitions for external modules

## Development

### Setup
```bash
npm install
npm run watch  # incremental bundles with sourcemaps
```

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

**Before committing**, run `npm run check` to validate all static analysis passes.

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
- Copy `tasklist-config.js` and `tasklist-audit-log.js` into the scripts directory

### Requirements
- Plugins expect Operaton/Camunda REST endpoints available via `api.engineApi` and related fields passed by Cockpit
- History endpoints (`/history/*`) must be reachable and may return up to 1000 records unless overridden

See [README.md](README.md) for detailed deployment instructions including Spring Boot setup.

## Behavioral notes
- History overlays and sequence-flow coloring rely on completed activities; gateways use a deny-list to avoid highlighting inactive branches.
- User preferences (auto-refresh, badges, pane sizes, sequence-flow toggle) persist in `localStorage` under `minimal-history-plugin` and can also be influenced via URL query hash parameters.
- Filtering UIs build REST queries; date filters use `startedAfter`/`finishedBefore` in UTC with millisecond precision.

## Extending safely
- Follow the existing plugin export shape (array of `pluginPoint` definitions) and keep DOM side effects contained; several plugins reuse portals to ensure long-lived nodes.
- Reuse helpers: fetch data with [src/utils/api.ts](src/utils/api.ts) to inherit CSRF handling and history pagination limits; render BPMN overlays through [src/utils/bpmn.ts](src/utils/bpmn.ts) when adding diagram visuals.
- Keep UI pieces inside [src/Components/](src/Components/) to share styles and behavior; SCSS may be colocated and will be inlined by Rollup.

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

## Testing

The project uses Jest with React Testing Library for unit and integration tests. Run tests with:
```bash
npm run test          # Run all tests
npm run test:watch    # Run in watch mode
npm run test:coverage # Generate coverage report
npm run test:ci       # Run in CI mode with coverage
```

**Current coverage:** ~60% statements, ~40% branches, ~55% functions, ~60% lines (495 passing tests)

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
- **React 18 warning with `@waylay/react-filter-box`**: The package uses `ReactDOM.render()` internally (in `AutoCompletePopup.tsx`) which triggers a console warning: "ReactDOM.render is no longer supported in React 18". This does not affect functionality - React falls back to React 17 behavior. The warning originates from the dependency, not this project's source code.
- **TypeScript warnings with `@waylay/react-filter-box`**: The package bundles its own `@types/react` which conflicts with the project's React types. [src/Components/FilterBox.tsx](src/Components/FilterBox.tsx) casts `SimpleReactFilterBox` to `any` to bypass this incompatibility while maintaining type safety elsewhere.
- **FilterBox initialization race condition**: The `SimpleReactFilterBox` component extends the upstream `ReactFilterBox` and defers its initial `onSubmit()` call by one event loop tick (using `setTimeout(0)`) to ensure CodeMirror and the AutoCompletePopup are fully initialized before submission. Additionally, the `autoCompleteHandler.setQuery()` call is executed synchronously during state initialization to prevent typeahead suggestions from failing. Without these fixes, the component would partially work with syntax highlighting but no typeahead suggestions, and filter changes wouldn't update the actual REST requests.

