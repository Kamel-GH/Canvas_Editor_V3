#!/usr/bin/env node

import process from 'node:process';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const require = createRequire(import.meta.url);

function main() {
  process.stderr.write('[typecheck] start\n');

  const tscPath = require.resolve('typescript/lib/tsc.js');
  const result = spawnSync(process.execPath, [tscPath, '--noEmit', '--pretty', 'false', '--incremental', 'false'], {
    cwd: process.cwd(),
    stdio: 'inherit'
  });

  if (result.error) {
    throw result.error;
  }

  process.exitCode = result.status ?? 1;
}

try {
  main();
} catch (error) {
  process.stderr.write(`${error.stack || error.message || String(error)}\n`);
  process.exitCode = 1;
}
