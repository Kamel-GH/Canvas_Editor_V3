#!/usr/bin/env node

import process from 'node:process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { ESLint } = require('eslint');
const tsParser = require('@typescript-eslint/parser');
const globals = require('globals');
const tsPluginPackagePath = require.resolve('@typescript-eslint/eslint-plugin/package.json');
const tsNoUnusedVarsModule = require(
  `${tsPluginPackagePath.replace(/package\.json$/, 'dist/rules/no-unused-vars.js')}`
);
const tsNoUnusedVars = tsNoUnusedVarsModule.default ?? tsNoUnusedVarsModule;

const defaultLintTargets = [
  'src/**/*.{js,jsx,ts,tsx,mjs,cjs}',
  'scripts/lint.mjs',
  'eslint.config.mjs',
  'next.config.mjs',
  'postcss.config.mjs'
];

const lintTargets = process.argv.slice(2);

async function runEslint() {
  process.stderr.write('[lint] eslint start\n');
  const eslint = new ESLint({
    cache: true,
    cacheLocation: 'node_modules/.cache/eslint',
    overrideConfigFile: true,
    overrideConfig: [
      {
        files: ['**/*.{js,jsx,mjs,cjs}'],
        languageOptions: {
          ecmaVersion: 'latest',
          sourceType: 'module',
          parserOptions: {
            ecmaFeatures: {
              jsx: true
            }
          },
          globals: {
            ...globals.browser,
            ...globals.node
          }
        },
        rules: {
          'no-undef': 'error',
          'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }]
        }
      },
      {
        files: ['**/*.{ts,tsx}'],
        languageOptions: {
          parser: tsParser,
          ecmaVersion: 'latest',
          sourceType: 'module',
          parserOptions: {
            ecmaFeatures: {
              jsx: true
            }
          },
          globals: {
            ...globals.browser,
            ...globals.node
          }
        },
        plugins: {
          '@typescript-eslint': {
            rules: {
              'no-unused-vars': tsNoUnusedVars
            }
          }
        },
        rules: {
          'no-unused-vars': 'off',
          '@typescript-eslint/no-unused-vars': [
            'warn',
            {
              argsIgnorePattern: '^_',
              caughtErrorsIgnorePattern: '^_',
              varsIgnorePattern: '^_'
            }
          ]
        }
      }
    ]
  });

  const targets = lintTargets.length > 0 ? lintTargets : defaultLintTargets;

  process.stderr.write(`[lint] files=${targets.length}\n`);

  const results = await eslint.lintFiles(targets);

  process.stderr.write('[lint] eslint done\n');
  const formatter = await eslint.loadFormatter('stylish');
  const output = formatter.format(results);

  if (output.trim().length > 0) {
    process.stdout.write(`${output}\n`);
  }

  return results.reduce((total, result) => total + result.errorCount, 0);
}

async function main() {
  const eslintErrors = await runEslint();
  process.exitCode = eslintErrors > 0 ? 1 : 0;
}

main().catch((error) => {
  process.stderr.write(`${error.stack || error.message || String(error)}\n`);
  process.exitCode = 1;
});
