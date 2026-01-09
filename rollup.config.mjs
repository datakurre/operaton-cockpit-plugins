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
  typescript(),
  image(),
  json(),
  scss({
    insert: true,
    silenceDeprecations: ['legacy-js-api'],
  }),
];

export default [
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
];
