// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import jsdocPlugin from 'eslint-plugin-jsdoc';

/**
 * ESLint configuration optimized for LLM coding agent maintainability.
 * 
 * Goals:
 * - Enforce explicit types and documentation for AI comprehension
 * - Prevent ambiguous patterns that confuse code analysis
 * - Ensure consistent code structure for pattern matching
 * - Limit complexity to keep functions understandable
 * - Require meaningful names and avoid magic values
 */
export default tseslint.config(
  // Base configs
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  // Global settings
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  // Source files configuration
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      'jsx-a11y': jsxA11yPlugin,
      jsdoc: jsdocPlugin,
    },
    rules: {
      // ============================================================
      // TYPE SAFETY - Essential for LLM understanding of data shapes
      // ============================================================
      
      // Disallow 'any' type - forces explicit typing
      '@typescript-eslint/no-explicit-any': 'warn', // Start as warning, upgrade to error
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-member-access': 'warn',
      '@typescript-eslint/no-unsafe-call': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      
      // Disable non-nullable-type-assertion-style as it conflicts with no-non-null-assertion
      '@typescript-eslint/non-nullable-type-assertion-style': 'off',
      
      // Require explicit return types on exported functions
      '@typescript-eslint/explicit-function-return-type': ['warn', {
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true,
        allowDirectConstAssertionInArrowFunctions: true,
      }],
      
      // Require explicit types on exported module boundaries
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      
      // Prefer nullish coalescing for clearer intent
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'error',
      
      // Strict boolean expressions prevent truthy/falsy confusion
      '@typescript-eslint/strict-boolean-expressions': ['warn', {
        allowString: true,
        allowNumber: false,
        allowNullableObject: true,
        allowNullableBoolean: true,
        allowNullableString: true,
      }],
      
      // ============================================================
      // NAMING CONVENTIONS - Predictable patterns for AI parsing
      // ============================================================
      
      '@typescript-eslint/naming-convention': [
        'warn',
        // Interfaces must start with capital letter (not I prefix)
        {
          selector: 'interface',
          format: ['PascalCase'],
        },
        // Type aliases must be PascalCase
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
        },
        // Constants should be UPPER_CASE or camelCase
        {
          selector: 'variable',
          modifiers: ['const'],
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        },
        // Functions should be camelCase
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'],
        },
        // React components must be PascalCase
        {
          selector: 'variable',
          modifiers: ['const'],
          types: ['function'],
          format: ['camelCase', 'PascalCase'],
        },
        // Boolean variables should have is/has/should prefix
        {
          selector: 'variable',
          types: ['boolean'],
          format: ['PascalCase'],
          prefix: ['is', 'has', 'should', 'can', 'did', 'will', 'show'],
        },
      ],

      // ============================================================
      // COMPLEXITY LIMITS - Keep code chunks LLM-digestible
      // ============================================================
      
      // Limit function length - easier for AI to understand
      'max-lines-per-function': ['warn', {
        max: 100,
        skipBlankLines: true,
        skipComments: true,
      }],
      
      // Limit file length - prevents monolithic files
      'max-lines': ['warn', {
        max: 400,
        skipBlankLines: true,
        skipComments: true,
      }],
      
      // Limit cyclomatic complexity
      complexity: ['warn', { max: 15 }],
      
      // Limit nesting depth
      'max-depth': ['warn', { max: 4 }],
      
      // Limit parameters - suggests need for options object
      'max-params': ['warn', { max: 5 }],
      
      // Limit statements per function
      'max-statements': ['warn', { max: 25 }],

      // ============================================================
      // DOCUMENTATION - Help AI understand intent
      // ============================================================
      
      // Require JSDoc on exported functions
      'jsdoc/require-jsdoc': ['warn', {
        publicOnly: true,
        require: {
          FunctionDeclaration: true,
          MethodDefinition: true,
          ClassDeclaration: true,
          ArrowFunctionExpression: false,
          FunctionExpression: false,
        },
        contexts: [
          'ExportNamedDeclaration > FunctionDeclaration',
          'ExportDefaultDeclaration > FunctionDeclaration',
        ],
      }],
      
      // Require param descriptions
      'jsdoc/require-param-description': 'warn',
      'jsdoc/require-returns-description': 'warn',
      
      // Check param types match TypeScript
      'jsdoc/check-param-names': 'warn',
      'jsdoc/check-tag-names': 'warn',

      // ============================================================
      // CODE CLARITY - Reduce ambiguity for AI parsing
      // ============================================================
      
      // No magic numbers - use named constants
      'no-magic-numbers': ['warn', {
        ignore: [-1, 0, 1, 2, 100, 1000],
        ignoreArrayIndexes: true,
        ignoreDefaultValues: true,
        enforceConst: true,
      }],
      
      // Allow numbers and booleans in template literals (common pattern in React)
      '@typescript-eslint/restrict-template-expressions': ['error', {
        allowNumber: true,
        allowBoolean: true,
        allowNullish: false,
        allowRegExp: false,
      }],

      // Prefer const - signals immutability
      'prefer-const': 'error',
      
      // No var - consistent scoping
      'no-var': 'error',
      
      // Require curly braces - prevents ambiguous blocks
      curly: ['error', 'all'],
      
      // Require default case in switch - explicit handling
      'default-case': 'error',
      
      // No fallthrough in switch - explicit breaks
      'no-fallthrough': 'error',
      
      // Strict equality only
      eqeqeq: ['error', 'always'],
      
      // No nested ternaries - hard to parse
      'no-nested-ternary': 'error',
      
      // No unneeded ternary
      'no-unneeded-ternary': 'error',
      
      // Prefer template literals
      'prefer-template': 'warn',
      
      // No console in production code
      'no-console': ['warn', { allow: ['warn', 'error', 'debug'] }],

      // ============================================================
      // IMPORTS - Consistent and organized
      // ============================================================
      
      // No unused imports
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],

      // ============================================================
      // REACT SPECIFIC - Maintainable component patterns
      // ============================================================
      
      // Enforce hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      
      // Require key in iterators
      'react/jsx-key': 'error',
      
      // No array index as key (unstable)
      'react/no-array-index-key': 'warn',
      
      // Self-closing components
      'react/self-closing-comp': 'warn',
      
      // Consistent component naming
      'react/jsx-pascal-case': 'error',
      
      // Boolean props shorthand
      'react/jsx-boolean-value': ['warn', 'never'],
      
      // Fragment shorthand
      'react/jsx-fragments': ['warn', 'syntax'],
      
      // No unused state
      'react/no-unused-state': 'warn',
      
      // Props destructuring for clarity
      'react/destructuring-assignment': ['warn', 'always'],

      // ============================================================
      // ACCESSIBILITY - Inclusive by default
      // ============================================================
      
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-role': 'error',

      // ============================================================
      // ERROR HANDLING - Explicit and traceable
      // ============================================================
      
      // No empty catch blocks
      'no-empty': ['error', { allowEmptyCatch: false }],
      
      // Prefer promise rejection with Error
      'prefer-promise-reject-errors': 'error',
      
      // No floating promises
      '@typescript-eslint/no-floating-promises': 'error',
      
      // Require await in async functions
      'require-await': 'off',
      '@typescript-eslint/require-await': 'warn',
      
      // No misused promises
      '@typescript-eslint/no-misused-promises': 'error',

      // ============================================================
      // DEPRECATED PATTERNS - Steer toward modern alternatives
      // ============================================================
      
      // No deprecated React lifecycle methods
      'react/no-deprecated': 'error',
      
      // Prefer function components
      'react/prefer-stateless-function': 'warn',
      
      // No string refs
      'react/no-string-refs': 'error',
    },
  },

  // Relaxed rules for test files
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', '**/__tests__/**'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/no-useless-constructor': 'off',
      '@typescript-eslint/no-base-to-string': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/require-await': 'off',
      'react/destructuring-assignment': 'off',
      'max-lines-per-function': 'off',
      'max-lines': 'off',
      'no-magic-numbers': 'off',
      'jsdoc/require-jsdoc': 'off',
    },
  },

  // Relaxed rules for mock files
  {
    files: ['**/__mocks__/**'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      'jsdoc/require-jsdoc': 'off',
      'no-magic-numbers': 'off',
    },
  },

  // Ignore patterns
  {
    ignores: [
      'node_modules/**',
      '*.js',
      '!eslint.config.mjs',
      'dist/**',
      'build/**',
      '*.js.map',
      'src/operaton.ts', // Generated API types file
      'src/setupPolyfills.js', // Jest polyfills file
    ],
  },
);
