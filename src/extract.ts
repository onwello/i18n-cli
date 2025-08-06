#!/usr/bin/env node

import { createExtractCommand } from './commands/extract';

const command = createExtractCommand();
command.parseAsync().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
}); 