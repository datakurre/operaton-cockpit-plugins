# AGENTS Guide

This repository bundles minimal history-oriented plugins for Operaton and Camunda 7 Cockpit/Tasklist. TypeScript + React sources in `src/` are bundled with Rollup into the top-level `*.js` files that Cockpit loads via `config.js`.

## Project map
- Configuration and deploy hints: [README.md](README.md), [config.js](config.js) for Cockpit, and [tasklist-config.js](tasklist-config.js) for Tasklist define which built scripts are loaded and how to wire extra BPMN modules.
- Build pipeline: [rollup.config.mjs](rollup.config.mjs) compiles each plugin entrypoint in `src/` to a sibling `*.js`. SCSS is injected into the bundle.
- Plugin entrypoints:
  - [src/definition-historic-activities.tsx](src/definition-historic-activities.tsx): Adds a runtime tab and diagram overlay for historic activity statistics with a filter UI and badge overlays.
  - [src/instance-historic-activities.tsx](src/instance-historic-activities.tsx): Adds audit-log tab and diagram overlays for a process instance, including sequence-flow highlighting.
  - [src/instance-route-history.tsx](src/instance-route-history.tsx): Full history route (`#/history/process-instance/:id`) with breadcrumbs, BPMN viewer, audit log, variables, pagination, and filter box.
  - [src/instance-auto-refresh.tsx](src/instance-auto-refresh.tsx): Diagram plugin exposing a toggle for auto-refresh on an instance view.
  - [src/tasklist-audit-log.tsx](src/tasklist-audit-log.tsx): Tasklist detail tab that loads the instance audit log.
  - [src/instance-tab-modify.tsx](src/instance-tab-modify.tsx) and [src/RobotModule/index.ts](src/RobotModule/index.ts): Additional Cockpit extensions and BPMN module utilities.
- Shared pieces:
  - API helpers and CSRF-aware fetch wrappers in [src/utils/api.ts](src/utils/api.ts).
  - BPMN overlay/sequence-flow rendering helpers in [src/utils/bpmn.ts](src/utils/bpmn.ts).
  - Local storage + querystring settings utilities in [src/utils/misc.ts](src/utils/misc.ts).
  - Reusable UI components live under [src/Components/](src/Components/), including:
    - [FilterBox.tsx](src/Components/FilterBox.tsx): Query filter UI with CodeMirror editor, custom autocomplete, and date picker integration
    - [BPMN.tsx](src/Components/BPMN.tsx): BPMN viewer wrapper with zoom controls and history toggle buttons
    - [AuditLogTable.tsx](src/Components/AuditLogTable.tsx), [HistoryTable.tsx](src/Components/HistoryTable.tsx), [StatisticsTable.tsx](src/Components/StatisticsTable.tsx), [VariablesTable.tsx](src/Components/VariablesTable.tsx): Data display tables
    - [BreadcrumbsPanel.tsx](src/Components/BreadcrumbsPanel.tsx): Navigation breadcrumbs
    - [Pagination.tsx](src/Components/Pagination.tsx): Pagination controls
    - [Portal.tsx](src/Components/Portal.tsx): React portal for rendering into Cockpit DOM nodes
    - Various toggle buttons and UI controls
  - Plugin parameter typings in [src/types.ts](src/types.ts).

## Development
- Install and watch: 

```bash
npm install
npm run watch  # incremental bundles with sourcemaps
```

- Production bundle: `npm run build` (sets `NODE_ENV=production`).
- Formatting: `make format` (or `npm run prettier:format`); check with `npm run prettier:check`.
- Generated outputs: Rollup writes top-level `*.js` bundles; edit sources in `src/`, not the generated files.
- The build uses Rollup with TypeScript, Babel, and SCSS injection plugins. Rollup also aliases React/ReactDOM to ensure a single instance across the bundle (fixes hooks errors from nested dependencies).

## Deployment
- Cockpit loads plugins listed in `customScripts` inside [config.js](config.js); Tasklist loads plugins from [tasklist-config.js](tasklist-config.js).
- Copy the appropriate config file(s) and the built `*.js` files into the target webapp scripts directory per [README.md](README.md).
- `bpmnJs.additionalModules` in [config.js](config.js) injects the BPMN behavior module built from [src/RobotModule/index.ts](src/RobotModule/index.ts).
- Plugins expect Operaton/Camunda REST endpoints available via `api.engineApi` and related fields passed by Cockpit. History endpoints (`/history/*`) must be reachable and may return up to 1000 records unless overridden.

## Behavioral notes
- History overlays and sequence-flow coloring rely on completed activities; gateways use a deny-list to avoid highlighting inactive branches.
- User preferences (auto-refresh, badges, pane sizes, sequence-flow toggle) persist in `localStorage` under `minimal-history-plugin` and can also be influenced via URL query hash parameters.
- Filtering UIs build REST queries; date filters use `startedAfter`/`finishedBefore` in UTC with millisecond precision.

## Extending safely
- Follow the existing plugin export shape (array of `pluginPoint` definitions) and keep DOM side effects contained; several plugins reuse portals to ensure long-lived nodes.
- Reuse helpers: fetch data with [src/utils/api.ts](src/utils/api.ts) to inherit CSRF handling and history pagination limits; render BPMN overlays through [src/utils/bpmn.ts](src/utils/bpmn.ts) when adding diagram visuals.
- Keep UI pieces inside [src/Components/](src/Components/) to share styles and behavior; SCSS may be colocated and will be inlined by Rollup.

## Known issues and fixes
- **TypeScript warnings with `@waylay/react-filter-box`**: The package bundles its own `@types/react` which conflicts with the project's React types. [src/Components/FilterBox.tsx](src/Components/FilterBox.tsx) casts `SimpleReactFilterBox` to `any` to bypass this incompatibility while maintaining type safety elsewhere.
- **FilterBox initialization race condition**: The `SimpleReactFilterBox` component extends the upstream `ReactFilterBox` and defers its initial `onSubmit()` call by one event loop tick (using `setTimeout(0)`) to ensure CodeMirror and the AutoCompletePopup are fully initialized before submission. Additionally, the `autoCompleteHandler.setQuery()` call is executed synchronously during state initialization to prevent typeahead suggestions from failing. Without these fixes, the component would partially work with syntax highlighting but no typeahead suggestions, and filter changes wouldn't update the actual REST requests.
