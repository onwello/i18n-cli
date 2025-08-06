#!/usr/bin/env node

import { createGenerateCommand } from './commands/generate';

const command = createGenerateCommand();
command.parseAsync().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
}); 