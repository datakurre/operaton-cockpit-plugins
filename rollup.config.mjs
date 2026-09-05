import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import image from "@rollup/plugin-image";
import json from "@rollup/plugin-json";
import replace from "@rollup/plugin-replace";
import resolve from "@rollup/plugin-node-resolve";
import scss from 'rollup-plugin-scss';
import typescript from "@rollup/plugin-typescript";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDevelopment = process.env.NODE_ENV !== "production";
const buildPlugin = process.env.BUILD_PLUGIN;

const plugins = [
  replace({
    preventAssignment: true,
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
  }),
  alias({
    entries: [
      // Force all React imports to use the same instance (fixes hooks errors from nested react-filter-box)
      { find: "react", replacement: path.resolve(__dirname, "node_modules/react") },
      { find: "react-dom", replacement: path.resolve(__dirname, "node_modules/react-dom") },
    ],
  }),
  resolve(),
  commonjs({
    include: "node_modules/**",
  }),
  typescript({
    noEmitOnError: !isDevelopment,
    compilerOptions: {
      outDir: ".",
    },
  }),
  image(),
  json(),
  scss({
    insert: true,
    silenceDeprecations: ['legacy-js-api'],
  }),
];

// All available plugin configurations
const allConfigs = [
  {
    input: "src/RobotModule/index.ts",
    output: {
      file: "robot-module.js",
      sourcemap: isDevelopment,
    },
    plugins,
  },
  {
    onwarn: function(warning, superOnWarn) {
      if (warning.code === 'THIS_IS_UNDEFINED') { return; }
      superOnWarn(warning);
    },
    input: "src/instance-historic-activities.tsx",
    output: {
      file: "instance-historic-activities.js",
      sourcemap: isDevelopment,
    },
    plugins,
  },
  {
    onwarn: function(warning, superOnWarn) {
      if (warning.code === 'THIS_IS_UNDEFINED') { return; }
      superOnWarn(warning);
    },
    input: "src/definition-historic-activities.tsx",
    output: {
      file: "definition-historic-activities.js",
      sourcemap: isDevelopment,
    },
    plugins,
  },
  {
    onwarn: function(warning, superOnWarn) {
      if (warning.code === 'THIS_IS_UNDEFINED') { return; }
      superOnWarn(warning);
    },
    input: "src/instance-auto-refresh.tsx",
    output: {
      file: "instance-auto-refresh.js",
      sourcemap: isDevelopment,
    },
    plugins,
  },
  {
    onwarn: function(warning, superOnWarn) {
      if (warning.code === 'THIS_IS_UNDEFINED') { return; }
      superOnWarn(warning);
    },
    input: "src/instance-route-history.tsx",
    output: {
      file: "instance-route-history.js",
      sourcemap: isDevelopment,
    },
    plugins,
  },
  {
    onwarn: function(warning, superOnWarn) {
      if (warning.code === 'THIS_IS_UNDEFINED') { return; }
      superOnWarn(warning);
    },
    input: "src/tasklist-audit-log.tsx",
    output: {
      file: "tasklist-audit-log.js",
      sourcemap: isDevelopment,
    },
    plugins,
  },
  {
    onwarn: function(warning, superOnWarn) {
      if (warning.code === 'THIS_IS_UNDEFINED') { return; }
      superOnWarn(warning);
    },
    input: "src/instance-tab-modify.tsx",
    output: {
      file: "instance-tab-modify.js",
      sourcemap: isDevelopment,
    },
    plugins,
  },
  {
    onwarn: function(warning, superOnWarn) {
      if (warning.code === 'THIS_IS_UNDEFINED') { return; }
      superOnWarn(warning);
    },
    input: "src/instance-action-unlock.tsx",
    output: {
      file: "instance-action-unlock.js",
      sourcemap: isDevelopment,
    },
    plugins,
  },
  {
    onwarn: function(warning, superOnWarn) {
      if (warning.code === 'THIS_IS_UNDEFINED') { return; }
      superOnWarn(warning);
    },
    input: "src/definition-tab-modify.tsx",
    output: {
      file: "definition-tab-modify.js",
      sourcemap: isDevelopment,
    },
    plugins,
  },
  {
    onwarn: function(warning, superOnWarn) {
      if (warning.code === 'THIS_IS_UNDEFINED') { return; }
      superOnWarn(warning);
    },
    input: "src/cockpit-custom-styles.tsx",
    output: {
      file: "cockpit-custom-styles.js",
      sourcemap: isDevelopment,
    },
    plugins,
  },
  {
    onwarn: function(warning, superOnWarn) {
      if (warning.code === 'THIS_IS_UNDEFINED') { return; }
      superOnWarn(warning);
    },
    input: "src/admin-custom-styles.tsx",
    output: {
      file: "admin-custom-styles.js",
      sourcemap: isDevelopment,
    },
    plugins,
  },
  {
    onwarn: function(warning, superOnWarn) {
      if (warning.code === 'THIS_IS_UNDEFINED') { return; }
      superOnWarn(warning);
    },
    input: "src/tasklist-custom-styles.tsx",
    output: {
      file: "tasklist-custom-styles.js",
      sourcemap: isDevelopment,
    },
    plugins,
  },
  {
    onwarn: function(warning, superOnWarn) {
      if (warning.code === 'THIS_IS_UNDEFINED') { return; }
      superOnWarn(warning);
    },
    input: "src/welcome-custom-styles.tsx",
    output: {
      file: "welcome-custom-styles.js",
      sourcemap: isDevelopment,
    },
    plugins,
  },
  {
    onwarn: function(warning, superOnWarn) {
      if (warning.code === 'THIS_IS_UNDEFINED') { return; }
      superOnWarn(warning);
    },
    input: "src/dashboard-favourites.tsx",
    output: {
      file: "dashboard-favourites.js",
      sourcemap: isDevelopment,
    },
    plugins,
  },
  {
    onwarn: function(warning, superOnWarn) {
      if (warning.code === 'THIS_IS_UNDEFINED') { return; }
      superOnWarn(warning);
    },
    input: "src/dashboard-integrations.tsx",
    output: {
      file: "dashboard-integrations.js",
      sourcemap: isDevelopment,
    },
    plugins,
  },
  {
    onwarn: function(warning, superOnWarn) {
      if (warning.code === 'THIS_IS_UNDEFINED') { return; }
      superOnWarn(warning);
    },
    input: "src/tasklist-nologin.tsx",
    output: {
      file: "tasklist-nologin.js",
      sourcemap: isDevelopment,
    },
    plugins,
  },
  {
    onwarn: function(warning, superOnWarn) {
      if (warning.code === 'THIS_IS_UNDEFINED') { return; }
      superOnWarn(warning);
    },
    input: "src/welcome-nologin.tsx",
    output: {
      file: "welcome-nologin.js",
      sourcemap: isDevelopment,
    },
    plugins,
  },
  {
    onwarn: function(warning, superOnWarn) {
      if (warning.code === 'THIS_IS_UNDEFINED') { return; }
      superOnWarn(warning);
    },
    input: "src/admin-nologin.tsx",
    output: {
      file: "admin-nologin.js",
      sourcemap: isDevelopment,
    },
    plugins,
  },
  {
    onwarn: function(warning, superOnWarn) {
      if (warning.code === 'THIS_IS_UNDEFINED') { return; }
      superOnWarn(warning);
    },
    input: "src/admin-route-authorization.tsx",
    output: {
      file: "admin-route-authorization.js",
      sourcemap: isDevelopment,
    },
    plugins,
  },
  {
    onwarn: function(warning, superOnWarn) {
      if (warning.code === 'THIS_IS_UNDEFINED') { return; }
      superOnWarn(warning);
    },
    input: "src/cockpit-nologin.tsx",
    output: {
      file: "cockpit-nologin.js",
      sourcemap: isDevelopment,
    },
    plugins,
  },
  {
    onwarn: function(warning, superOnWarn) {
      if (warning.code === 'THIS_IS_UNDEFINED') { return; }
      superOnWarn(warning);
    },
    input: "src/decisions-dashboard.tsx",
    output: {
      file: "decisions-dashboard.js",
      sourcemap: isDevelopment,
    },
    plugins,
  },
];

// Filter configs based on BUILD_PLUGIN environment variable
// Usage: BUILD_PLUGIN=instance-historic-activities npm run build
// Supports partial matching: BUILD_PLUGIN=historic will build all historic-activities plugins
export default buildPlugin
  ? allConfigs.filter(config => {
      const outputFile = config.output.file.replace('.js', '');
      return outputFile.toLowerCase().includes(buildPlugin.toLowerCase());
    })
  : allConfigs;
